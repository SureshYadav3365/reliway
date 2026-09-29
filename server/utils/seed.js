const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: __dirname + '/../../.env' });
dotenv.config();

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Payment = require('../models/Payment');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    console.log('Connected to MongoDB for Seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Coupon.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Payment.deleteMany();

    console.log('Cleared existing data.');

    // 1. Create Admin & Sample Users
    const adminUser = await User.create({
      name: process.env.ADMIN_NAME || 'ShopEase Administrator',
      phone: process.env.ADMIN_PHONE || '9999999999',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin',
      isActive: true,
      addresses: [
        {
          fullName: 'ShopEase Headquarters',
          phone: '9999999999',
          house: 'Suite 404, Tech Park',
          street: 'Outer Ring Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560103',
          isDefault: true
        }
      ]
    });

    const customer1 = await User.create({
      name: 'Aarav Sharma',
      phone: '9876543210',
      password: 'Password@123',
      role: 'customer',
      isActive: true,
      addresses: [
        {
          fullName: 'Aarav Sharma',
          phone: '9876543210',
          house: 'Flat 302, Sunrise Towers',
          street: 'Indiranagar 100ft Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          isDefault: true
        }
      ]
    });

    const customer2 = await User.create({
      name: 'Priya Patel',
      phone: '9123456780',
      password: 'Password@123',
      role: 'customer',
      isActive: true,
      addresses: [
        {
          fullName: 'Priya Patel',
          phone: '9123456780',
          house: 'B-14, Greenview Residency',
          street: 'Linking Road, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050',
          isDefault: true
        }
      ]
    });

    console.log('Seeded Users: 1 Admin, 2 Customers.');

    // 2. Create 7 Categories
    const categoriesData = [
      {
        name: 'Electronics',
        description: 'Smartphones, Audio, Wearables, Laptops and high-tech smart gadgets.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        isActive: true
      },
      {
        name: 'Fashion',
        description: 'Trendy clothing, stylish apparel, streetwear and formal outfits.',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
        isActive: true
      },
      {
        name: 'Shoes',
        description: 'Athletic sneakers, running trainers, formal leather shoes and boots.',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
        isActive: true
      },
      {
        name: 'Home',
        description: 'Modern furniture, ambient lighting, kitchenware and home decor.',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
        isActive: true
      },
      {
        name: 'Beauty',
        description: 'Skincare essentials, fragrances, grooming and wellness products.',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
        isActive: true
      },
      {
        name: 'Grocery',
        description: 'Organic foods, beverages, artisan coffees and pantry essentials.',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        isActive: true
      },
      {
        name: 'Accessories',
        description: 'Luxury watches, leather backpacks, sunglasses and premium wallets.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
        isActive: true
      }
    ];

    const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const categoriesDataWithSlug = categoriesData.map(c => ({
      ...c,
      slug: slugify(c.name)
    }));

    const categories = await Category.insertMany(categoriesDataWithSlug);
    const catMap = {};
    categories.forEach(c => { catMap[c.name] = c._id; });

    console.log('Seeded 7 Categories.');

    // 3. Create at least 32 Products with rich details
    const productsData = [
      // Electronics (6 items)
      {
        name: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
        sku: 'ELEC-SNY-001',
        description: 'Industry-leading noise cancellation optimized with two processors and 8 microphones. Enjoy crystal-clear hands-free calling, up to 30-hour battery life with quick charging, and ultra-comfortable lightweight design.',
        category: catMap['Electronics'],
        brand: 'Sony',
        price: 29990,
        discountPrice: 24990,
        stock: 35,
        sold: 142,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.8,
        numReviews: 24,
        isFeatured: true,
        isTrending: true,
        isBestSeller: true,
        isNewArrival: false,
        specifications: [
          { key: 'Driver Unit', value: '30mm Carbon Fiber' },
          { key: 'Battery Life', value: '30 Hours ANC On' },
          { key: 'Connectivity', value: 'Bluetooth 5.2, LDAC, 3.5mm' },
          { key: 'Weight', value: '250g' }
        ],
        variants: [
          { name: 'Color', options: ['Midnight Black', 'Silver Grey', 'Midnight Blue'] }
        ]
      },
      {
        name: 'Apple iPad Air 11-inch M2 Chip',
        sku: 'ELEC-APL-002',
        description: 'Supercharged by the blazing-fast Apple M2 chip. Features a breathtaking 11-inch Liquid Retina display, landscape 12MP front camera with Center Stage, and Wi-Fi 6E connectivity for ultra-fast performance.',
        category: catMap['Electronics'],
        brand: 'Apple',
        price: 59900,
        discountPrice: 54900,
        stock: 22,
        sold: 89,
        images: [
          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.9,
        numReviews: 18,
        isFeatured: true,
        isTrending: true,
        isBestSeller: false,
        isNewArrival: true,
        specifications: [
          { key: 'Processor', value: 'Apple M2 (8-core CPU, 10-core GPU)' },
          { key: 'Display', value: '11-inch Liquid Retina True Tone' },
          { key: 'Storage', value: '128GB / 256GB' },
          { key: 'Battery', value: 'Up to 10 hours' }
        ],
        variants: [
          { name: 'Storage', options: ['128GB', '256GB'] },
          { name: 'Color', options: ['Space Grey', 'Starlight', 'Blue'] }
        ]
      },
      {
        name: 'Logitech MX Master 3S Wireless Performance Mouse',
        sku: 'ELEC-LOG-003',
        description: 'An iconic master rebuilt for ultimate ergonomics and silent clicks. MagSpeed electromagnetic scrolling delivers 90% more speed and 87% more precision. 8000 DPI sensor tracks anywhere including glass.',
        category: catMap['Electronics'],
        brand: 'Logitech',
        price: 10995,
        discountPrice: 8995,
        stock: 48,
        sold: 210,
        images: [
          'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.7,
        numReviews: 32,
        isFeatured: false,
        isTrending: true,
        isBestSeller: true,
        isNewArrival: false,
        specifications: [
          { key: 'Sensor DPI', value: '200 to 8000 DPI' },
          { key: 'Battery', value: 'Up to 70 days rechargeable' },
          { key: 'Buttons', value: '7 programmable buttons' }
        ],
        variants: [
          { name: 'Color', options: ['Graphite', 'Pale Grey'] }
        ]
      },
      {
        name: 'Samsung Galaxy Watch 6 Classic 43mm',
        sku: 'ELEC-SAM-004',
        description: 'Featuring a rotating physical bezel, Sapphire Crystal glass, advanced sleep coaching, body composition analysis, and ECG tracking right on your wrist.',
        category: catMap['Electronics'],
        brand: 'Samsung',
        price: 36999,
        discountPrice: 28999,
        stock: 18,
        sold: 64,
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.6,
        numReviews: 14,
        isFeatured: false,
        isTrending: false,
        isBestSeller: false,
        isNewArrival: true,
        specifications: [
          { key: 'Bezel', value: 'Physical Rotating Stainless Steel' },
          { key: 'Water Resistance', value: '5ATM + IP68' },
          { key: 'Display', value: 'Super AMOLED 1.3"' }
        ],
        variants: [
          { name: 'Color', options: ['Black', 'Silver'] }
        ]
      },
      {
        name: 'Bose SoundLink Flex Bluetooth Portable Speaker',
        sku: 'ELEC-BOS-005',
        description: 'Engineered to deliver clear, deep sound wherever you go. IP67 waterproof and dustproof rating, rugged silicone body, and PositionIQ technology that automatically optimizes orientation.',
        category: catMap['Electronics'],
        brand: 'Bose',
        price: 15900,
        discountPrice: 12900,
        stock: 25,
        sold: 95,
        images: [
          'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.8,
        numReviews: 19,
        isFeatured: true,
        isTrending: false,
        isBestSeller: false,
        isNewArrival: false,
        specifications: [
          { key: 'Battery Life', value: 'Up to 12 Hours' },
          { key: 'Durability', value: 'IP67 Waterproof & Floats' },
          { key: 'Connectivity', value: 'Bluetooth 4.2' }
        ],
        variants: [
          { name: 'Color', options: ['Stone Blue', 'Black', 'Carmine Red'] }
        ]
      },
      {
        name: 'Keychron K2 Pro Mechanical Wireless Keyboard',
        sku: 'ELEC-KEY-006',
        description: 'Custom QMK/VIA wireless mechanical keyboard with hot-swappable switches, double-shot PBT keycaps, sound-absorbing foam, and Mac/Windows layout switch.',
        category: catMap['Electronics'],
        brand: 'Keychron',
        price: 9999,
        discountPrice: 8499,
        stock: 15,
        sold: 78,
        images: [
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.7,
        numReviews: 22,
        isFeatured: false,
        isTrending: true,
        isBestSeller: false,
        isNewArrival: true,
        specifications: [
          { key: 'Switches', value: 'Gateron G Pro Red / Brown' },
          { key: 'Connectivity', value: 'Bluetooth 5.1 & Type-C' },
          { key: 'Backlight', value: 'RGB Backlit 22 Types' }
        ],
        variants: [
          { name: 'Switch Type', options: ['Red Linear', 'Brown Tactile', 'Blue Clicky'] }
        ]
      },

      // Fashion (5 items)
      {
        name: 'Premium Wool Blend Double-Breasted Overcoat',
        sku: 'FASH-COAT-001',
        description: 'Tailored from heavyweight Italian wool blend with structured notched lapels, horn buttons, satin interior lining, and functional ticket pockets.',
        category: catMap['Fashion'],
        brand: 'Zara Men',
        price: 12990,
        discountPrice: 9990,
        stock: 20,
        sold: 52,
        images: [
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.7,
        numReviews: 16,
        isFeatured: true,
        isTrending: true,
        isBestSeller: false,
        isNewArrival: true,
        specifications: [
          { key: 'Material', value: '70% Wool, 30% Cashmere Blend' },
          { key: 'Fit', value: 'Relaxed Tailored Fit' },
          { key: 'Care', value: 'Dry Clean Only' }
        ],
        variants: [
          { name: 'Size', options: ['S', 'M', 'L', 'XL'] },
          { name: 'Color', options: ['Camel Tan', 'Charcoal', 'Navy'] }
        ]
      },
      {
        name: 'Heavyweight Oversized Organic Cotton Hoodie',
        sku: 'FASH-HOD-002',
        description: 'Crafted from 480 GSM French terry cotton with brushed interior for supreme comfort. Double-layered hood, dropped shoulders, and subtle ribbed trims.',
        category: catMap['Fashion'],
        brand: 'Urban Stitch',
        price: 3499,
        discountPrice: 2499,
        stock: 60,
        sold: 198,
        images: [
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.8,
        numReviews: 45,
        isFeatured: false,
        isTrending: true,
        isBestSeller: true,
        isNewArrival: false,
        specifications: [
          { key: 'GSM', value: '480 GSM French Terry' },
          { key: 'Material', value: '100% GOTS Organic Cotton' }
        ],
        variants: [
          { name: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
          { name: 'Color', options: ['Washed Black', 'Oatmeal Heather', 'Sage Green'] }
        ]
      },
      {
        name: 'Selvedge Denim Slim Tapered Jeans',
        sku: 'FASH-JNS-003',
        description: '14oz Japanese raw selvedge denim woven on traditional shuttle looms. Develops personalized honeycomb and whiskering fades over time.',
        category: catMap['Fashion'],
        brand: 'Levis Premium',
        price: 5999,
        discountPrice: 4799,
        stock: 35,
        sold: 110,
        images: [
          'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.6,
        numReviews: 29,
        isFeatured: false,
        isTrending: false,
        isBestSeller: true,
        isNewArrival: false,
        specifications: [
          { key: 'Weight', value: '14oz Selvedge Denim' },
          { key: 'Closure', value: 'Button Fly with Copper Rivets' }
        ],
        variants: [
          { name: 'Waist', options: ['30', '32', '34', '36'] }
        ]
      },
      {
        name: 'Silk Blend Floral Wrap Midi Dress',
        sku: 'FASH-DRS-004',
        description: 'Effortless femininity meets elegance. Features ruffled hemlines, an adjustable waist tie, bishop sleeves, and a flattering V-neck cut.',
        category: catMap['Fashion'],
        brand: 'Mango',
        price: 4999,
        discountPrice: 3899,
        stock: 28,
        sold: 74,
        images: [
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.8,
        numReviews: 21,
        isFeatured: true,
        isTrending: true,
        isBestSeller: false,
        isNewArrival: true,
        specifications: [
          { key: 'Fabric', value: 'Mulberry Silk & Viscose Blend' },
          { key: 'Length', value: 'Midi (Below Knee)' }
        ],
        variants: [
          { name: 'Size', options: ['XS', 'S', 'M', 'L'] }
        ]
      },
      {
        name: 'Classic Linen Button-Down Shirt',
        sku: 'FASH-SHT-005',
        description: 'Woven from pure European flax linen that gets softer with every wash. Lightweight, breathable, and essential for warm weather.',
        category: catMap['Fashion'],
        brand: 'Ralph & Co',
        price: 3299,
        discountPrice: 2299,
        stock: 42,
        sold: 130,
        images: [
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.5,
        numReviews: 17,
        isFeatured: false,
        isTrending: false,
        isBestSeller: false,
        isNewArrival: false,
        specifications: [
          { key: 'Material', value: '100% Normandy Flax Linen' },
          { key: 'Collar', value: 'Button-Down Casual Collar' }
        ],
        variants: [
          { name: 'Size', options: ['M', 'L', 'XL'] },
          { name: 'Color', options: ['Sky Blue', 'Crisp White', 'Olive'] }
        ]
      },

      // Shoes (5 items)
      {
        name: 'Nike Air Zoom Pegasus 40 Running Shoes',
        sku: 'SHOE-NKE-001',
        description: 'A responsive ride for every run. Two Zoom Air units and React foam midsole deliver energy return, while engineered mesh upper provides breathability.',
        category: catMap['Shoes'],
        brand: 'Nike',
        price: 11495,
        discountPrice: 8995,
        stock: 30,
        sold: 230,
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.9,
        numReviews: 54,
        isFeatured: true,
        isTrending: true,
        isBestSeller: true,
        isNewArrival: false,
        specifications: [
          { key: 'Cushioning', value: 'Dual Zoom Air + React Foam' },
          { key: 'Drop', value: '10mm' },
          { key: 'Weight', value: '285g (Men 9)' }
        ],
        variants: [
          { name: 'Size (UK)', options: ['7', '8', '9', '10', '11'] },
          { name: 'Color', options: ['Varsity Red / White', 'Triple Black'] }
        ]
      },
      {
        name: 'Adidas Ultraboost Light Performance Trainers',
        sku: 'SHOE-ADI-002',
        description: 'Experience epic energy return with Light BOOST material, our lightest BOOST foam ever. Continental Better Rubber outsole delivers maximum grip on wet surfaces.',
        category: catMap['Shoes'],
        brand: 'Adidas',
        price: 17999,
        discountPrice: 13999,
        stock: 22,
        sold: 140,
        images: [
          'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.8,
        numReviews: 38,
        isFeatured: true,
        isTrending: true,
        isBestSeller: false,
        isNewArrival: true,
        specifications: [
          { key: 'Midsole', value: 'Ultralight BOOST System' },
          { key: 'Upper', value: 'Primeknit+ Textile Upper' }
        ],
        variants: [
          { name: 'Size (UK)', options: ['8', '9', '10', '11'] }
        ]
      },
      {
        name: 'Handcrafted Goodyear Welted Chelsea Boots',
        sku: 'SHOE-CHL-003',
        description: 'Full-grain Italian calfskin leather with elastic side gussets, stacked leather heel, and a durable Vibram rubber outsole. Built to last a lifetime.',
        category: catMap['Shoes'],
        brand: 'Thursday Boot Co',
        price: 16500,
        discountPrice: 14200,
        stock: 14,
        sold: 62,
        images: [
          'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.9,
        numReviews: 19,
        isFeatured: false,
        isTrending: false,
        isBestSeller: false,
        isNewArrival: true,
        specifications: [
          { key: 'Construction', value: 'Goodyear Welt 360 Degree' },
          { key: 'Leather', value: 'Full-grain French Calfskin' }
        ],
        variants: [
          { name: 'Size (UK)', options: ['7', '8', '9', '10'] },
          { name: 'Color', options: ['Cacao Brown', 'Matte Black'] }
        ]
      },
      {
        name: 'New Balance 574 Core Classic Sneakers',
        sku: 'SHOE-NB-004',
        description: 'The most iconic New Balance shoe of all time. ENCAP midsole cushioning combines lightweight foam with a durable polyurethane rim for all-day support.',
        category: catMap['Shoes'],
        brand: 'New Balance',
        price: 7999,
        discountPrice: 6299,
        stock: 40,
        sold: 175,
        images: [
          'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.7,
        numReviews: 31,
        isFeatured: false,
        isTrending: true,
        isBestSeller: true,
        isNewArrival: false,
        specifications: [
          { key: 'Midsole', value: 'ENCAP Technology' },
          { key: 'Upper', value: 'Suede and Mesh Upper' }
        ],
        variants: [
          { name: 'Size (UK)', options: ['7', '8', '9', '10'] },
          { name: 'Color', options: ['Grey / White', 'Navy Blue'] }
        ]
      },
      {
        name: 'Puma RS-X Efekt Retro Chunky Trainers',
        sku: 'SHOE-PUM-005',
        description: 'Futuristic-retro silhouette featuring bold color-blocking, angular overlays, PU midsole, and Running System cushioning tech.',
        category: catMap['Shoes'],
        brand: 'Puma',
        price: 8999,
        discountPrice: 5999,
        stock: 25,
        sold: 88,
        images: [
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.6,
        numReviews: 22,
        isFeatured: false,
        isTrending: false,
        isBestSeller: false,
        isNewArrival: false,
        specifications: [
          { key: 'Cushioning', value: 'Puma Running System' },
          { key: 'Sole', value: 'Rubber High Abrasion' }
        ],
        variants: [
          { name: 'Size (UK)', options: ['8', '9', '10'] }
        ]
      },

      // Home (4 items)
      {
        name: 'Minimalist Nordic Solid Oak Bedside Lamp',
        sku: 'HOME-LMP-001',
        description: 'Warm ambient lighting housed in hand-turned FSC certified solid white oak base with frosted glass globe. Features step-less touch dimming.',
        category: catMap['Home'],
        brand: 'Nordic Lumina',
        price: 4499,
        discountPrice: 3299,
        stock: 35,
        sold: 82,
        images: [
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.8,
        numReviews: 26,
        isFeatured: true,
        isTrending: false,
        isBestSeller: true,
        isNewArrival: false,
        specifications: [
          { key: 'Base Material', value: 'Solid White Oak' },
          { key: 'Bulb', value: 'Dimmable G9 Warm LED (Included)' },
          { key: 'Power', value: 'USB-C Rechargeable + Plug' }
        ],
        variants: []
      },
      {
        name: 'Ergonomic Breathable Mesh Office Chair',
        sku: 'HOME-CHR-002',
        description: 'Engineered for 12+ hour sitting comfort. Includes 3D dynamic lumbar support, 4D adjustable armrests, synchronized tilt mechanism and aluminum base.',
        category: catMap['Home'],
        brand: 'ErgoComfort',
        price: 18999,
        discountPrice: 14999,
        stock: 12,
        sold: 63,
        images: [
          'https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.9,
        numReviews: 33,
        isFeatured: true,
        isTrending: true,
        isBestSeller: false,
        isNewArrival: true,
        specifications: [
          { key: 'Weight Capacity', value: '150 kg' },
          { key: 'Mechanism', value: 'Wire-controlled Synchro-Tilt' },
          { key: 'Gas Lift', value: 'Class 4 Heavy Duty' }
        ],
        variants: [
          { name: 'Color', options: ['Onyx Black', 'Cool Grey'] }
        ]
      },
      {
        name: 'Stoneware Ceramic 16-Piece Dinnerware Set',
        sku: 'HOME-DNW-003',
        description: 'Matte reactive glaze finish makes every single plate unique. Microwave, oven, and dishwasher safe. Service for 4 including bowls and mugs.',
        category: catMap['Home'],
        brand: 'Clay & Co',
        price: 6999,
        discountPrice: 4999,
        stock: 20,
        sold: 45,
        images: [
          'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.7,
        numReviews: 15,
        isFeatured: false,
        isTrending: false,
        isBestSeller: false,
        isNewArrival: false,
        specifications: [
          { key: 'Pieces', value: '16 (4 Dinner, 4 Salad, 4 Bowls, 4 Mugs)' },
          { key: 'Finish', value: 'Matte Reactive Glaze' }
        ],
        variants: [
          { name: 'Color', options: ['Speckled Ivory', 'Midnight Slate'] }
        ]
      },
      {
        name: 'Pure French Flax Linen King Duvet Cover Set',
        sku: 'HOME-BED-004',
        description: 'Pre-washed for sublime softness and lived-in texture. Naturally thermoregulating for cool summer nights and cozy winter sleep.',
        category: catMap['Home'],
        brand: 'Loom & Thread',
        price: 8999,
        discountPrice: 6999,
        stock: 18,
        sold: 50,
        images: [
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.8,
        numReviews: 21,
        isFeatured: false,
        isTrending: true,
        isBestSeller: false,
        isNewArrival: true,
        specifications: [
          { key: 'Material', value: '100% French Flax' },
          { key: 'Includes', value: '1 Duvet Cover + 2 Pillow Shams' }
        ],
        variants: [
          { name: 'Color', options: ['Terracotta', 'Natural Flax', 'Sage'] }
        ]
      },

      // Beauty (4 items)
      {
        name: 'Advanced Hyaluronic Acid Hydrating Serum 50ml',
        sku: 'BEAU-HYA-001',
        description: 'Triple molecular weight hyaluronic acid penetrates deep into epidermal layers. Plumps skin, smooths fine lines, and boosts radiance instantly.',
        category: catMap['Beauty'],
        brand: 'GlowLab Botanicals',
        price: 1899,
        discountPrice: 1399,
        stock: 65,
        sold: 310,
        images: [
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.9,
        numReviews: 64,
        isFeatured: true,
        isTrending: true,
        isBestSeller: true,
        isNewArrival: false,
        specifications: [
          { key: 'Volume', value: '50 ml' },
          { key: 'Skin Type', value: 'All Skin Types, Sensitive Safe' },
          { key: 'Key Ingredients', value: 'Multi-weight Hyaluronic Acid, Vitamin B5' }
        ],
        variants: []
      },
      {
        name: 'Maison Oud & Bergamot Eau De Parfum 100ml',
        sku: 'BEAU-PRF-002',
        description: 'An alluring oriental composition blending crisp Calabrian bergamot with smoky dark cedar and precious agarwood oud essence.',
        category: catMap['Beauty'],
        brand: 'Atelier Artisan',
        price: 8500,
        discountPrice: 6800,
        stock: 20,
        sold: 84,
        images: [
          'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.8,
        numReviews: 28,
        isFeatured: false,
        isTrending: false,
        isBestSeller: false,
        isNewArrival: true,
        specifications: [
          { key: 'Concentration', value: 'Eau de Parfum (20% Essential Oils)' },
          { key: 'Longevity', value: '8-10 Hours' }
        ],
        variants: []
      },
      {
        name: 'Botanical Ceramide Barrier Repair Cream 100g',
        sku: 'BEAU-CRM-003',
        description: 'Formulated with 5 essential skin-identical ceramides, squalane, and colloidal oat to replenish moisture barriers and heal dry redness.',
        category: catMap['Beauty'],
        brand: 'DermaSense',
        price: 1499,
        discountPrice: 1149,
        stock: 55,
        sold: 190,
        images: [
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.7,
        numReviews: 40,
        isFeatured: false,
        isTrending: true,
        isBestSeller: true,
        isNewArrival: false,
        specifications: [
          { key: 'Volume', value: '100 g' },
          { key: 'Texture', value: 'Velvety Rich Cream' }
        ],
        variants: []
      },
      {
        name: 'Rose Quartz Facial Sculpting Gua Sha & Roller Set',
        sku: 'BEAU-GUA-004',
        description: 'Carved from 100% genuine Grade-A natural Brazilian rose quartz. Aids lymphatic drainage, eases muscle tension, and improves blood circulation.',
        category: catMap['Beauty'],
        brand: 'GlowLab Botanicals',
        price: 1999,
        discountPrice: 1299,
        stock: 40,
        sold: 115,
        images: [
          'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.6,
        numReviews: 24,
        isFeatured: false,
        isTrending: false,
        isBestSeller: false,
        isNewArrival: false,
        specifications: [
          { key: 'Stone', value: '100% Genuine Natural Rose Quartz' },
          { key: 'Set Includes', value: 'Dual-Ended Roller + Heart Gua Sha' }
        ],
        variants: []
      },

      // Grocery (4 items)
      {
        name: 'Organic Single Origin Arabica Coffee Beans 500g',
        sku: 'GROC-COF-001',
        description: 'Shade-grown in the misty highlands of Coorg. Medium roast bursting with notes of dark chocolate, toasted hazelnut, and citrus blossom.',
        category: catMap['Grocery'],
        brand: 'Blue Peak Roasters',
        price: 799,
        discountPrice: 649,
        stock: 80,
        sold: 280,
        images: [
          'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.9,
        numReviews: 52,
        isFeatured: true,
        isTrending: true,
        isBestSeller: true,
        isNewArrival: false,
        specifications: [
          { key: 'Roast Level', value: 'Medium Roast' },
          { key: 'Origin', value: 'Coorg, Western Ghats' },
          { key: 'Altitude', value: '1350m MSL' }
        ],
        variants: [
          { name: 'Grind', options: ['Whole Beans', 'French Press', 'Moka Pot', 'Espresso'] }
        ]
      },
      {
        name: 'Raw Cold-Pressed Extra Virgin Olive Oil 1 Litre',
        sku: 'GROC-OIL-002',
        description: 'First cold extraction of hand-picked Koroneiki olives within 6 hours of harvest. Rich in polyphenols and antioxidants with peppery finish.',
        category: catMap['Grocery'],
        brand: 'Olea Valley',
        price: 1899,
        discountPrice: 1549,
        stock: 45,
        sold: 140,
        images: [
          'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.8,
        numReviews: 31,
        isFeatured: false,
        isTrending: false,
        isBestSeller: false,
        isNewArrival: true,
        specifications: [
          { key: 'Acidity', value: '< 0.3%' },
          { key: 'Packaging', value: 'UV-Protected Dark Glass Bottle' }
        ],
        variants: []
      },
      {
        name: 'Wild Forest Raw Organic Honey 500g',
        sku: 'GROC-HNY-003',
        description: 'Unpasteurized and unfiltered raw honey sustainably gathered by tribal cooperatives from deep Nilgiri flora. Retains all active pollen and enzymes.',
        category: catMap['Grocery'],
        brand: 'PureNectar',
        price: 650,
        discountPrice: 499,
        stock: 70,
        sold: 220,
        images: [
          'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.8,
        numReviews: 36,
        isFeatured: false,
        isTrending: true,
        isBestSeller: true,
        isNewArrival: false,
        specifications: [
          { key: 'Certification', value: 'India Organic, USDA Organic' },
          { key: 'Weight', value: '500 grams' }
        ],
        variants: []
      },
      {
        name: 'Artisanal Himalayan Pink Salt Ceramic Grinder 200g',
        sku: 'GROC-SLT-004',
        description: 'Unrefined mineral rock salt hand-mined from pristine ancient seabed deposits. Comes in an adjustable ceramic burr grinder.',
        category: catMap['Grocery'],
        brand: 'SpiceRoots',
        price: 499,
        discountPrice: 349,
        stock: 50,
        sold: 95,
        images: [
          'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.7,
        numReviews: 18,
        isFeatured: false,
        isTrending: false,
        isBestSeller: false,
        isNewArrival: false,
        specifications: [
          { key: 'Grinder Mechanism', value: 'High Performance Ceramic Core' },
          { key: 'Minerals', value: '84 Trace Minerals' }
        ],
        variants: []
      },

      // Accessories (4 items)
      {
        name: 'Full Grain Leather Weekender Travel Duffle Bag',
        sku: 'ACCS-BAG-001',
        description: 'Handcrafted from 2.2mm thick vegetable-tanned pull-up leather with solid antique brass hardware, YKK Excella zippers, and waterproof shoe compartment.',
        category: catMap['Accessories'],
        brand: 'Kodiak Craft',
        price: 14999,
        discountPrice: 11999,
        stock: 18,
        sold: 72,
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.9,
        numReviews: 35,
        isFeatured: true,
        isTrending: true,
        isBestSeller: true,
        isNewArrival: false,
        specifications: [
          { key: 'Capacity', value: '45 Litres (Cabin Size Compliant)' },
          { key: 'Leather', value: 'Full-Grain Vegetable Tanned' },
          { key: 'Weight', value: '1.9 kg' }
        ],
        variants: [
          { name: 'Color', options: ['Vintage Cognac', 'Dark Chocolate'] }
        ]
      },
      {
        name: 'Sapphire Crystal Automatic Chronograph Watch',
        sku: 'ACCS-WTC-002',
        description: 'Exquisite horology featuring a Seiko VK64 Meca-Quartz movement, scratch-resistant sapphire crystal with anti-reflective coating, and 316L stainless case.',
        category: catMap['Accessories'],
        brand: 'Kronos Heritage',
        price: 21990,
        discountPrice: 17490,
        stock: 10,
        sold: 48,
        images: [
          'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.8,
        numReviews: 22,
        isFeatured: true,
        isTrending: false,
        isBestSeller: false,
        isNewArrival: true,
        specifications: [
          { key: 'Movement', value: 'Hybrid Meca-Quartz Chronograph' },
          { key: 'Glass', value: 'Double Domed Sapphire Crystal' },
          { key: 'Water Resistance', value: '100m / 10 ATM' }
        ],
        variants: [
          { name: 'Dial', options: ['Panda White', 'Sunburst Blue'] }
        ]
      },
      {
        name: 'Polarized Aviator Sunglasses Titanium Frame',
        sku: 'ACCS-SGL-003',
        description: 'Ultra-lightweight titanium frame weighing only 18 grams with 100% UV400 polarized crystal lenses that eliminate blinding glare.',
        category: catMap['Accessories'],
        brand: 'AeroVue',
        price: 4999,
        discountPrice: 3799,
        stock: 30,
        sold: 110,
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.7,
        numReviews: 29,
        isFeatured: false,
        isTrending: true,
        isBestSeller: false,
        isNewArrival: false,
        specifications: [
          { key: 'Frame', value: 'Aerospace Grade Titanium' },
          { key: 'Lens', value: 'Polarized TAC UV400' }
        ],
        variants: [
          { name: 'Lens Tint', options: ['Classic Green G-15', 'Smoke Black', 'Warm Amber'] }
        ]
      },
      {
        name: 'RFID Blocking Slim Minimalist Carbon Fiber Wallet',
        sku: 'ACCS-WLT-004',
        description: 'Engineered from genuine 3K carbon fiber weaves with an integrated money clip and quick-draw notch. Holds up to 12 cards without stretching.',
        category: catMap['Accessories'],
        brand: 'RidgeCraft',
        price: 2499,
        discountPrice: 1799,
        stock: 50,
        sold: 165,
        images: [
          'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.8,
        numReviews: 44,
        isFeatured: false,
        isTrending: false,
        isBestSeller: true,
        isNewArrival: false,
        specifications: [
          { key: 'Material', value: 'Matte 3K Carbon Fiber Plate' },
          { key: 'Security', value: 'Military Grade RFID Shielding' }
        ],
        variants: []
      }
    ];

    const productsDataWithSlug = productsData.map(p => ({
      ...p,
      slug: slugify(p.name) + '-' + Math.floor(1000 + Math.random() * 9000)
    }));

    const products = await Product.insertMany(productsDataWithSlug);
    console.log(`Seeded ${products.length} Products successfully.`);

    // 4. Create Coupons
    const couponsData = [
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 500,
        maxDiscount: 1000,
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        usageLimit: 500,
        usedCount: 28,
        isActive: true
      },
      {
        code: 'FESTIVE20',
        discountType: 'percentage',
        discountValue: 20,
        minOrderValue: 2000,
        maxDiscount: 2500,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        usageLimit: 300,
        usedCount: 42,
        isActive: true
      },
      {
        code: 'SAVE500',
        discountType: 'fixed',
        discountValue: 500,
        minOrderValue: 3000,
        maxDiscount: 500,
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        usageLimit: 200,
        usedCount: 15,
        isActive: true
      },
      {
        code: 'FLAT100',
        discountType: 'fixed',
        discountValue: 100,
        minOrderValue: 500,
        maxDiscount: 100,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        usageLimit: 1000,
        usedCount: 120,
        isActive: true
      }
    ];

    await Coupon.insertMany(couponsData);
    console.log('Seeded 4 Coupons.');

    // 5. Create Sample Orders for customer1
    const p1 = products[0]; // Sony headphones
    const p2 = products[6]; // Nike sneakers
    const p3 = products[16]; // Arabica coffee

    const sampleOrder1 = await Order.create({
      orderId: 'SE-982411-4821',
      user: customer1._id,
      orderItems: [
        {
          product: p1._id,
          name: p1.name,
          image: p1.images[0],
          price: p1.discountPrice || p1.price,
          quantity: 1,
          variant: 'Midnight Black'
        }
      ],
      shippingAddress: customer1.addresses[0],
      paymentMethod: 'online',
      paymentStatus: 'paid',
      orderStatus: 'Delivered',
      itemsPrice: 24990,
      discountAmount: 1000,
      deliveryCharge: 0,
      taxPrice: 1199,
      totalPrice: 25189,
      couponCode: 'WELCOME10',
      transactionId: 'TXN-982411-4821-ONL',
      statusHistory: [
        { status: 'Confirmed', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), comment: 'Order confirmed and paid' },
        { status: 'Processing', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), comment: 'Packed and ready for dispatch' },
        { status: 'Shipped', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), comment: 'Handed over to Bluedart Courier' },
        { status: 'Out for Delivery', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), comment: 'Agent out for delivery' },
        { status: 'Delivered', date: new Date(), comment: 'Delivered to recipient safely' }
      ]
    });

    await Payment.create({
      order: sampleOrder1._id,
      orderId: sampleOrder1.orderId,
      user: customer1._id,
      amount: sampleOrder1.totalPrice,
      paymentMethod: 'online',
      paymentStatus: 'paid',
      transactionId: 'TXN-982411-4821-ONL'
    });

    const sampleOrder2 = await Order.create({
      orderId: 'SE-983192-5912',
      user: customer1._id,
      orderItems: [
        {
          product: p2._id,
          name: p2.name,
          image: p2.images[0],
          price: p2.discountPrice || p2.price,
          quantity: 1,
          variant: '9'
        },
        {
          product: p3._id,
          name: p3.name,
          image: p3.images[0],
          price: p3.discountPrice || p3.price,
          quantity: 2,
          variant: 'French Press'
        }
      ],
      shippingAddress: customer1.addresses[0],
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'Shipped',
      itemsPrice: 10293,
      discountAmount: 500,
      deliveryCharge: 0,
      taxPrice: 489,
      totalPrice: 10282,
      couponCode: 'SAVE500',
      statusHistory: [
        { status: 'Confirmed', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), comment: 'Cash on delivery order confirmed' },
        { status: 'Processing', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), comment: 'Items packaged' },
        { status: 'Shipped', date: new Date(), comment: 'In transit to destination hub' }
      ]
    });

    await Payment.create({
      order: sampleOrder2._id,
      orderId: sampleOrder2.orderId,
      user: customer1._id,
      amount: sampleOrder2.totalPrice,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      transactionId: 'TXN-983192-5912-COD'
    });

    console.log('Seeded 2 Sample Orders with tracking timelines and payments.');

    // 6. Create Sample Reviews
    await Review.create([
      {
        product: p1._id,
        user: customer1._id,
        userName: customer1.name,
        rating: 5,
        comment: 'Absolutely phenomenal soundstage and the noise cancellation creates absolute silence on flights. Highly recommended!',
        isApproved: true
      },
      {
        product: p2._id,
        user: customer1._id,
        userName: customer1.name,
        rating: 5,
        comment: 'Best running shoes I have owned. Super comfortable cushioning for 10k morning jogs.',
        isApproved: true
      },
      {
        product: p3._id,
        user: customer2._id,
        userName: customer2.name,
        rating: 5,
        comment: 'Freshly roasted aroma fills the entire kitchen every morning. Excellent medium roast profile.',
        isApproved: true
      }
    ]);

    console.log('Seeded Sample Reviews.');

    // 7. Seed Wishlist and Cart for customer1
    await Wishlist.create({
      user: customer1._id,
      products: [products[1]._id, products[10]._id]
    });

    await Cart.create({
      user: customer1._id,
      items: [
        {
          product: products[2]._id,
          variant: 'Graphite',
          quantity: 1,
          price: products[2].discountPrice || products[2].price,
          isSavedForLater: false
        }
      ]
    });

    console.log('Seeded Initial Cart and Wishlist.');

    console.log('-------------------------------------------');
    console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Admin Login:');
    console.log(`Phone: ${process.env.ADMIN_PHONE || '9999999999'}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log('Customer Login:');
    console.log('Phone: 9876543210');
    console.log('Password: Password@123');
    console.log('-------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
