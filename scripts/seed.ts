// PHRONESIS seed script — populates the database with an elite fleet
// Run with: bun run scripts/seed.ts
import { db } from '../src/lib/db';

async function main() {
  console.log('🌱 Seeding PHRONESIS database...');

  // Idempotent: wipe existing data first
  await db.booking.deleteMany();
  await db.carImage.deleteMany();
  await db.car.deleteMany();
  await db.category.deleteMany();
  await db.brand.deleteMany();
  await db.siteSettings.deleteMany();
  console.log('  ✓ Cleared existing data');

  // ---------- Categories ----------
  const sports    = await db.category.create({ data: { name: 'Sports',    slug: 'sports',    description: 'Track-bred performance machines' } });
  const luxury    = await db.category.create({ data: { name: 'Luxury',    slug: 'luxury',    description: 'Hand-crafted grand tourers' } });
  const suv       = await db.category.create({ data: { name: 'SUV',       slug: 'suv',       description: 'Commanding presence, supreme comfort' } });
  const hyper     = await db.category.create({ data: { name: 'Hypercar',  slug: 'hypercar',  description: 'The absolute pinnacle of automotive engineering' } });
  const convert   = await db.category.create({ data: { name: 'Convertible', slug: 'convertible', description: 'Open-top freedom under the Al Ain sun' } });

  // ---------- Brands ----------
  const lamborghini = await db.brand.create({ data: { name: 'Lamborghini', slug: 'lamborghini' } });
  const rollsroyce  = await db.brand.create({ data: { name: 'Rolls-Royce', slug: 'rolls-royce' } });
  const bentley     = await db.brand.create({ data: { name: 'Bentley',     slug: 'bentley' } });
  const ferrari     = await db.brand.create({ data: { name: 'Ferrari',     slug: 'ferrari' } });
  const mclaren     = await db.brand.create({ data: { name: 'McLaren',     slug: 'mclaren' } });
  const mercedes    = await db.brand.create({ data: { name: 'Mercedes-Maybach', slug: 'mercedes-maybach' } });
  const rover       = await db.brand.create({ data: { name: 'Range Rover', slug: 'range-rover' } });
  const porsche     = await db.brand.create({ data: { name: 'Porsche',     slug: 'porsche' } });

  // ---------- Cars ----------
  const cars = [
    {
      slug: 'lamborghini-huracan-evo',
      brand: lamborghini,
      model: 'Huracán EVO',
      year: 2024,
      category: sports,
      priceDaily: 2800, priceWeekly: 16800, priceMonthly: 65000,
      engine: '5.2L V10', power: '631 HP', topSpeed: '325 km/h', acceleration: '2.9s (0-100)',
      transmission: '7-speed DCT', seats: 2, fuelType: 'Petrol', drivetrain: 'AWD',
      tagline: 'Naturally aspirated V10 fury, sharpened for the street.',
      description: 'The Huracán EVO is the definitive expression of Lamborghini engineering — a naturally aspirated 5.2-litre V10 paired with rear-wheel steering and LDVI vehicle dynamics. Every input is translated into instant, telepathic response. Available in Al Ain with full insurance, 24/7 delivery, and zero deposit for verified guests.',
      features: ['Naturally Aspirated V10', 'Rear-Wheel Steering', 'LDVI Brain', 'Carbon Ceramic Brakes', 'Apple CarPlay', 'Alcantara Interior'],
      color: 'Arancio Borealis',
      available: true, featured: true,
      mileageLimit: '250 km/day', deposit: 'AED 5,000 refundable',
      heroImage: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1600&q=85',
      images: [
        'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1600&q=85',
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=85',
        'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1600&q=85',
      ],
    },
    {
      slug: 'rolls-royce-ghost',
      brand: rollsroyce,
      model: 'Ghost',
      year: 2024,
      category: luxury,
      priceDaily: 3500, priceWeekly: 21000, priceMonthly: 80000,
      engine: '6.75L V12', power: '563 HP', topSpeed: '250 km/h', acceleration: '4.8s (0-100)',
      transmission: '8-speed ZF', seats: 4, fuelType: 'Petrol', drivetrain: 'AWD',
      tagline: 'Whisper-quiet opulence, engineered around you.',
      description: 'The Ghost distills Rolls-Royce luxury into its purest form — a 6.75-litre V12 with satellite-aided transmission, Planar suspension system, and a cabin insulated to near silence. Hand-stitched leather, real wood veneer, and the Starlight Headliner create a sanctuary on wheels. Delivered to your hotel or residence anywhere in the UAE.',
      features: ['Starlight Headliner', 'Planar Suspension', 'Bespoke Audio', 'Massage Seats', 'Whisper-Quiet Cabin', 'Satellite-Aided Transmission'],
      color: 'Arctic White',
      available: true, featured: true,
      mileageLimit: '300 km/day', deposit: 'AED 7,500 refundable',
      heroImage: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=1600&q=85',
      images: [
        'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=1600&q=85',
        'https://images.unsplash.com/photo-1614026480209-9bc5b9d6e8d9?w=1600&q=85',
        'https://images.unsplash.com/photo-1583836863538-91e9f97a8d76?w=1600&q=85',
      ],
    },
    {
      slug: 'bentley-continental-gt',
      brand: bentley,
      model: 'Continental GT Speed',
      year: 2024,
      category: luxury,
      priceDaily: 2700, priceWeekly: 16200, priceMonthly: 60000,
      engine: '6.0L W12', power: '650 HP', topSpeed: '335 km/h', acceleration: '3.5s (0-100)',
      transmission: '8-speed DCT', seats: 4, fuelType: 'Petrol', drivetrain: 'AWD',
      tagline: 'The grand tourer, perfected.',
      description: 'The Continental GT Speed blends British craftsmanship with devastating performance. A 6.0-litre W12 sends 650 horsepower to all four wheels, while the rotating Bentley display toggles between elegant walnut veneer, three analogue dials, and a 12.3-inch touchscreen. A grand tourer for those who refuse to compromise.',
      features: ['Rotating Bentley Display', 'Diamond Quilted Leather', 'Naim Audio', 'Air Suspension', 'All-Wheel Steering', 'Carbon Ceramic Brakes'],
      color: 'Glacier White',
      available: true, featured: true,
      mileageLimit: '300 km/day', deposit: 'AED 5,000 refundable',
      heroImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1600&q=85',
      images: [
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1600&q=85',
        'https://images.unsplash.com/photo-1606152421811-aa9143a350e1?w=1600&q=85',
        'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=1600&q=85',
      ],
    },
    {
      slug: 'ferrari-roma',
      brand: ferrari,
      model: 'Roma',
      year: 2024,
      category: sports,
      priceDaily: 3200, priceWeekly: 19200, priceMonthly: 72000,
      engine: '3.9L V8 Turbo', power: '612 HP', topSpeed: '320 km/h', acceleration: '3.4s (0-100)',
      transmission: '8-speed DCT', seats: 4, fuelType: 'Petrol', drivetrain: 'RWD',
      tagline: 'La Nuova Dolce Vita — Roman beauty, Maranello soul.',
      description: 'The Ferrari Roma is a contemporary GT with timeless proportions — a long bonnet, fastback roofline, and a 620-horsepower twin-turbo V8. The cockpit is split into two distinct zones for driver and passenger. Dual-cockpit architecture, full digital interface, and that unmistakable Maranello exhaust note.',
      features: ['Twin-Turbo V8', 'Dual-Cockpit Architecture', 'Side-Slip Control 6.0', 'Burmester Audio', 'Carbon Fibre Steering Wheel', 'Race Mode'],
      color: 'Rosso Corsa',
      available: true, featured: true,
      mileageLimit: '250 km/day', deposit: 'AED 7,500 refundable',
      heroImage: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1600&q=85',
      images: [
        'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1600&q=85',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600&q=85',
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1600&q=85',
      ],
    },
    {
      slug: 'mclaren-720s',
      brand: mclaren,
      model: '720S Spider',
      year: 2024,
      category: hyper,
      priceDaily: 4500, priceWeekly: 27000, priceMonthly: 100000,
      engine: '4.0L V8 Twin-Turbo', power: '710 HP', topSpeed: '341 km/h', acceleration: '2.9s (0-100)',
      transmission: '7-speed SSG', seats: 2, fuelType: 'Petrol', drivetrain: 'RWD',
      tagline: 'A supercar without compromise — open-top or closed.',
      description: 'The McLaren 720S Spider is built around a carbon fibre MonoCage II-S, delivering hypercar performance with retractable-roof freedom. 710 horsepower, 7,500 rpm redline, and active aerodynamics that shift the car\'s centre of pressure in real time. One of the most rewarding driving experiences money can rent.',
      features: ['Carbon MonoCage II-S', 'Active Aerodynamics', 'ProActive Chassis Control II', 'Retractable Hardtop (11s)', 'Electrochromic Roof', 'Track Telemetry'],
      color: 'Papaya Spark',
      available: true, featured: true,
      mileageLimit: '200 km/day', deposit: 'AED 10,000 refundable',
      heroImage: 'https://images.unsplash.com/photo-1583836863538-91e9f97a8d76?w=1600&q=85',
      images: [
        'https://images.unsplash.com/photo-1583836863538-91e9f97a8d76?w=1600&q=85',
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=85',
        'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1600&q=85',
      ],
    },
    {
      slug: 'mercedes-maybach-s680',
      brand: mercedes,
      model: 'Maybach S 680 4MATIC',
      year: 2024,
      category: luxury,
      priceDaily: 2400, priceWeekly: 14400, priceMonthly: 55000,
      engine: '6.0L V12 Biturbo', power: '612 HP', topSpeed: '250 km/h', acceleration: '4.5s (0-100)',
      transmission: '9G-Tronic', seats: 4, fuelType: 'Petrol', drivetrain: 'AWD',
      tagline: 'The chauffeured flagship, reimagined.',
      description: 'The Mercedes-Maybach S 680 is the pinnacle of the S-Class lineage — a 6.0-litre V12 biturbo, executive rear seats with massage, heating and ventilation, a Burmester 4D surround system, and the world\'s quietest cabin at speed. Includes a dedicated chauffeur option for Al Ain, Abu Dhabi, and Dubai engagements.',
      features: ['Executive Rear Seats', 'Burmester 4D Audio', 'Magic Body Control', 'Chauffeur Available', 'Rear Refrigerator', 'Manufaktur Nappa Leather'],
      color: 'Obsidian Black',
      available: true, featured: false,
      mileageLimit: '300 km/day', deposit: 'AED 5,000 refundable',
      heroImage: 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=1600&q=85',
      images: [
        'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=1600&q=85',
        'https://images.unsplash.com/photo-1606152421811-aa9143a350e1?w=1600&q=85',
        'https://images.unsplash.com/photo-1614026480209-9bc5b9d6e8d9?w=1600&q=85',
      ],
    },
    {
      slug: 'range-rover-autobiography',
      brand: rover,
      model: 'Range Rover Autobiography',
      year: 2024,
      category: suv,
      priceDaily: 1900, priceWeekly: 11400, priceMonthly: 45000,
      engine: '4.4L V8 Twin-Turbo', power: '523 HP', topSpeed: '242 km/h', acceleration: '4.6s (0-100)',
      transmission: '8-speed Auto', seats: 5, fuelType: 'Petrol', drivetrain: 'AWD',
      tagline: 'Unrivalled refinement, on road or off.',
      description: 'The Range Rover Autobiography is the most luxurious SUV ever built by Land Rover — a 523-horsepower V8, executive rear seats with 24-way adjustment, Meridian signature sound system, and a silent, calm cabin. Equally at home on Sheikh Zayed Road or a desert retreat.',
      features: ['Executive Class Rear Seats', 'Meridian Signature Audio', 'Cabin Air Purification Pro', 'Air Suspension', 'Terrain Response 2', 'Panoramic Roof'],
      color: 'Santorini Black',
      available: true, featured: false,
      mileageLimit: '300 km/day', deposit: 'AED 4,000 refundable',
      heroImage: 'https://images.unsplash.com/photo-1606152421811-aa9143a350e1?w=1600&q=85',
      images: [
        'https://images.unsplash.com/photo-1606152421811-aa9143a350e1?w=1600&q=85',
        'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=1600&q=85',
        'https://images.unsplash.com/photo-1614026480209-9bc5b9d6e8d9?w=1600&q=85',
      ],
    },
    {
      slug: 'porsche-911-turbo-s',
      brand: porsche,
      model: '911 Turbo S',
      year: 2024,
      category: sports,
      priceDaily: 3000, priceWeekly: 18000, priceMonthly: 68000,
      engine: '3.7L Flat-6 Twin-Turbo', power: '640 HP', topSpeed: '330 km/h', acceleration: '2.7s (0-100)',
      transmission: '8-speed PDK', seats: 4, fuelType: 'Petrol', drivetrain: 'AWD',
      tagline: 'The everyday supercar, perfected.',
      description: 'The 911 Turbo S is the apex of the 911 lineage — 640 horsepower, 800 Nm of torque, launch control, and a 0-100 sprint of just 2.7 seconds. Yet it remains as livable in Tuesday morning traffic as it is devastating on the weekend. The benchmark by which all other sports cars are measured.',
      features: ['640 HP Flat-6', 'Sport Chrono Package', 'PASM Suspension', 'Ceramic Brakes', 'Burmester Audio', 'Launch Control'],
      color: 'GT Silver',
      available: true, featured: true,
      mileageLimit: '250 km/day', deposit: 'AED 6,000 refundable',
      heroImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=85',
      images: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=85',
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=85',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600&q=85',
      ],
    },
  ];

  for (const c of cars) {
    const car = await db.car.create({
      data: {
        slug: c.slug,
        brandId: c.brand.id,
        model: c.model,
        year: c.year,
        categoryId: c.category.id,
        priceDaily: c.priceDaily,
        priceWeekly: c.priceWeekly,
        priceMonthly: c.priceMonthly,
        engine: c.engine,
        power: c.power,
        topSpeed: c.topSpeed,
        acceleration: c.acceleration,
        transmission: c.transmission,
        seats: c.seats,
        fuelType: c.fuelType,
        drivetrain: c.drivetrain,
        tagline: c.tagline,
        description: c.description,
        features: JSON.stringify(c.features),
        color: c.color,
        available: c.available,
        featured: c.featured,
        mileageLimit: c.mileageLimit,
        deposit: c.deposit,
        heroImage: c.heroImage,
        images: { create: c.images.map((url, i) => ({ url, order: i, caption: `${c.model} view ${i+1}` })) },
      },
    });
    console.log(`  ✓ ${c.brand.name} ${c.model} (${car.id})`);
  }

  // ---------- Site Settings ----------
  await db.siteSettings.create({
    data: {
      brandName: 'PHRONESIS',
      tagline: 'Luxury Car Atelier — Al Ain',
      phone: '+971561669766',
      whatsapp: '+971561669766',
      email: 'concierge@phronesis.ae',
      address: 'Sheikh Zayed Bin Sultan Street, Al Ain, UAE',
      instagram: 'https://instagram.com',
      adminPassword: 'phronesis2024',
      heroHeadline: 'The Art of Arrival',
      heroSubtext: "Al Ain's atelier of extraordinary automobiles — curated for those who understand that how you arrive matters.",
      aboutText: "Phronesis — from the Greek for practical wisdom — was founded on a simple premise: that the experience of renting an extraordinary automobile should be as refined as the automobile itself. From our atelier in the Garden City of Al Ain, we serve a discerning clientele across the UAE who understand that true luxury is not about logos or price tags, but about the quality of attention, the seamlessness of service, and the calibre of the machines we curate. Every car in our collection is hand-selected, manufacturer-maintained, and delivered with concierge care — 24 hours a day, seven days a week — to Al Ain, Abu Dhabi, Dubai, and beyond.",
    },
  });

  console.log('✅ Seed complete.');
  console.log('   Admin login: /#/admin  |  password: phronesis2024');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
