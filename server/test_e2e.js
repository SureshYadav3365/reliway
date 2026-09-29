const BASE_URL = 'http://localhost:5000/api';
const ROOT_URL = 'http://localhost:5000';

async function ensureServerRunning() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    if (res.ok) return;
  } catch (err) {
    // Server not running, boot it
    console.log('[INFO] Server is not running. Booting server/server.js in-process...');
    require('./server');
    // Wait for server to listen
    await new Promise(r => setTimeout(r, 2000));
  }
}

async function runTests() {
  await ensureServerRunning();

  console.log('====================================================');
  console.log('  STARTING SHOPEASE UNIFIED SERVICE E2E SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  };

  try {
    // 0. Production Frontend Serving & SPA Routing
    console.log('--- 0. Testing Single-Service Frontend & SPA Routing ---');
    const rootHtml = await fetch(`${ROOT_URL}/`).then(r => r.text());
    assert(rootHtml.includes('ShopEase') || rootHtml.includes('root'), 'Root path "/" serves production React HTML');

    const spaRouteHtml = await fetch(`${ROOT_URL}/shop`).then(r => r.text());
    assert(spaRouteHtml.includes('ShopEase') || spaRouteHtml.includes('root'), 'SPA route "/shop" falls back to React HTML correctly');

    const adminRouteHtml = await fetch(`${ROOT_URL}/admin/dashboard`).then(r => r.text());
    assert(adminRouteHtml.includes('ShopEase') || adminRouteHtml.includes('root'), 'SPA route "/admin/dashboard" falls back to React HTML correctly');

    // 1. Health check
    console.log('\n--- 1. Testing Health Endpoint ---');
    const healthRes = await fetch(`${BASE_URL}/health`).then(r => r.json());
    assert(healthRes.status === 'ok', 'API health check passed');

    // 2. Categories
    console.log('\n--- 2. Testing Categories ---');
    const catRes = await fetch(`${BASE_URL}/categories`).then(r => r.json());
    assert(catRes.success && catRes.categories.length >= 7, `Fetched ${catRes.categories?.length} active categories`);

    // 3. Products
    console.log('\n--- 3. Testing Products Listing & Search ---');
    const prodRes = await fetch(`${BASE_URL}/products?limit=10`).then(r => r.json());
    assert(prodRes.success && prodRes.total >= 30, `Total products count: ${prodRes.total}`);

    const searchRes = await fetch(`${BASE_URL}/products/suggestions?q=Sony`).then(r => r.json());
    assert(searchRes.success && searchRes.suggestions.length > 0, `Search suggestions returned for "Sony"`);

    const singleProd = prodRes.products[0];
    const detailsRes = await fetch(`${BASE_URL}/products/${singleProd.slug}`).then(r => r.json());
    assert(detailsRes.success && detailsRes.product.name === singleProd.name, `Product details loaded for ${singleProd.name}`);

    // 4. Customer Login
    console.log('\n--- 4. Testing Customer Authentication ---');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '9876543210', password: 'Password@123' })
    }).then(r => r.json());

    assert(loginRes.success && loginRes.token, `Customer login successful for Aarav Sharma`);
    const customerToken = loginRes.token;

    // 5. Wishlist
    console.log('\n--- 5. Testing Wishlist Operations ---');
    const wishRes = await fetch(`${BASE_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    }).then(r => r.json());
    assert(wishRes.success && Array.isArray(wishRes.wishlist), `Wishlist fetched (${wishRes.wishlist.length} items)`);

    const toggleRes = await fetch(`${BASE_URL}/wishlist/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({ productId: singleProd._id })
    }).then(r => r.json());
    assert(toggleRes.success, `Wishlist toggle action: ${toggleRes.message}`);

    // 6. Cart Operations
    console.log('\n--- 6. Testing Cart Management ---');
    const addToCartRes = await fetch(`${BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({ productId: singleProd._id, quantity: 1, variant: 'Midnight Black' })
    }).then(r => r.json());
    assert(addToCartRes.success && addToCartRes.cart.items.length > 0, `Added item to cart (Total items in cart: ${addToCartRes.cart.items.length})`);

    // 7. Coupon Validation
    console.log('\n--- 7. Testing Coupon Validation ---');
    const couponRes = await fetch(`${BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({ code: 'WELCOME10', cartTotal: 5000 })
    }).then(r => r.json());
    assert(couponRes.success && couponRes.coupon.discountAmount === 500, `Coupon WELCOME10 applied with discount: ₹${couponRes.coupon.discountAmount}`);

    // 8. Order Placement & Inventory Deduction
    console.log('\n--- 8. Testing Order Creation & Stock Tracking ---');
    const initialStock = singleProd.stock;

    const orderPayload = {
      orderItems: [
        {
          product: singleProd._id,
          name: singleProd.name,
          image: singleProd.images[0],
          price: singleProd.discountPrice || singleProd.price,
          quantity: 1,
          variant: 'Midnight Black'
        }
      ],
      shippingAddress: {
        fullName: 'Aarav Sharma',
        phone: '9876543210',
        house: 'Flat 302, Sunrise Towers',
        street: 'Indiranagar 100ft Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038'
      },
      paymentMethod: 'online',
      couponCode: 'WELCOME10'
    };

    const orderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify(orderPayload)
    }).then(r => r.json());

    assert(orderRes.success && orderRes.order.orderId, `Order placed successfully! Generated Order ID: ${orderRes.order.orderId}`);
    const createdOrderId = orderRes.order._id;

    // Check inventory reduced
    const updatedProdRes = await fetch(`${BASE_URL}/products/${singleProd.slug}`).then(r => r.json());
    assert(updatedProdRes.product.stock === initialStock - 1, `Inventory deducted correctly: ${initialStock} -> ${updatedProdRes.product.stock}`);

    // 9. Order Details & Timeline
    console.log('\n--- 9. Testing Order Details & Timeline ---');
    const orderDetailsRes = await fetch(`${BASE_URL}/orders/${createdOrderId}`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    }).then(r => r.json());
    assert(orderDetailsRes.success && orderDetailsRes.order.statusHistory.length > 0, `Order tracking history active with ${orderDetailsRes.order.statusHistory.length} status event`);

    // 10. Admin Authentication & Role Protection
    console.log('\n--- 10. Testing Admin Authorization ---');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '9999999999', password: 'Admin@123456' })
    }).then(r => r.json());

    assert(adminLoginRes.success && adminLoginRes.user.role === 'admin', `Admin authenticated with role "${adminLoginRes.user.role}"`);
    const adminToken = adminLoginRes.token;

    // 11. Admin Dashboard Stats
    console.log('\n--- 11. Testing Admin Dashboard & Analytics ---');
    const dashRes = await fetch(`${BASE_URL}/admin/dashboard-stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    }).then(r => r.json());
    assert(dashRes.success && dashRes.stats.totalProducts >= 30, `Dashboard stats retrieved: Total products=${dashRes.stats.totalProducts}, Total revenue=₹${dashRes.stats.totalRevenue}`);

    const analyticsRes = await fetch(`${BASE_URL}/admin/analytics?range=7days`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    }).then(r => r.json());
    assert(analyticsRes.success && Array.isArray(analyticsRes.analytics.categorySales), `Analytics compiled: ${analyticsRes.analytics.categorySales.length} categories analyzed`);

    // 12. Admin Order Status Progression
    console.log('\n--- 12. Testing Admin Order Status Progression ---');
    const statusUpdateRes = await fetch(`${BASE_URL}/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        orderStatus: 'Shipped',
        comment: 'Dispatched via Express tracking #EX991204'
      })
    }).then(r => r.json());

    assert(statusUpdateRes.success && statusUpdateRes.order.orderStatus === 'Shipped', `Admin changed status to: ${statusUpdateRes.order.orderStatus}`);

    // Verify customer sees updated status immediately
    const customerOrderCheck = await fetch(`${BASE_URL}/orders/${createdOrderId}`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    }).then(r => r.json());
    assert(customerOrderCheck.order.orderStatus === 'Shipped', `Customer real-time visibility confirmed: Order is now "Shipped"`);

    // 13. Admin Inventory & Stock
    console.log('\n--- 13. Testing Admin Inventory Control ---');
    const invRes = await fetch(`${BASE_URL}/admin/inventory`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    }).then(r => r.json());
    assert(invRes.success && invRes.inventory.length >= 30, `Admin inventory report fetched with ${invRes.inventory.length} SKUs`);

    console.log('\n====================================================');
    console.log(`  E2E TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Test execution failed with error:', error);
    process.exit(1);
  }
}

runTests();
