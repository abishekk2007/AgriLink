import { prisma } from './prisma';
import { logger } from '../utils/logger';

export async function seedDatabase() {
  logger.info('Starting AgriLink database seeding process...');

  try {
    // 1. Seed Crops
    const crops = [
      { name: 'Tomato', category: 'Vegetable' },
      { name: 'Onion', category: 'Vegetable' },
      { name: 'Potato', category: 'Tuber' },
      { name: 'Wheat', category: 'Cereal' },
      { name: 'Rice', category: 'Cereal' },
      { name: 'Cotton', category: 'Fiber' },
    ];

    for (const crop of crops) {
      await prisma.crop.upsert({
        where: { name: crop.name },
        update: {},
        create: crop,
      });
    }
    logger.info(`Seeded ${crops.length} crops.`);

    // 2. Seed Markets
    const markets = [
      { name: 'Koyambedu', state: 'Tamil Nadu', district: 'Chennai' },
      { name: 'Madurai', state: 'Tamil Nadu', district: 'Madurai' },
      { name: 'Lasalgaon', state: 'Maharashtra', district: 'Nashik' },
      { name: 'Yeshwanthpur', state: 'Karnataka', district: 'Bengaluru' },
      { name: 'Khanna', state: 'Punjab', district: 'Ludhiana' },
      { name: 'Sahibabad', state: 'Uttar Pradesh', district: 'Ghaziabad' },
    ];

    for (const market of markets) {
      await prisma.market.upsert({
        where: {
          name_state_district: {
            name: market.name,
            state: market.state,
            district: market.district,
          },
        },
        update: {},
        create: market,
      });
    }
    logger.info(`Seeded ${markets.length} markets.`);

    // 3. Seed Sample Market Prices
    const samplePrices = [
      {
        date: '2026-09-25',
        state: 'Tamil Nadu',
        district: 'Chennai',
        market: 'Koyambedu',
        commodity: 'Tomato',
        minPrice: 32,
        maxPrice: 46,
        modalPrice: 40,
        arrivalQuantity: 120,
      },
      {
        date: '2026-09-25',
        state: 'Tamil Nadu',
        district: 'Madurai',
        market: 'Madurai',
        commodity: 'Tomato',
        minPrice: 30,
        maxPrice: 42,
        modalPrice: 36,
        arrivalQuantity: 85,
      },
      {
        date: '2026-09-25',
        state: 'Maharashtra',
        district: 'Nashik',
        market: 'Lasalgaon',
        commodity: 'Onion',
        minPrice: 28,
        maxPrice: 34,
        modalPrice: 31,
        arrivalQuantity: 310,
      },
      {
        date: '2026-09-25',
        state: 'Punjab',
        district: 'Ludhiana',
        market: 'Khanna',
        commodity: 'Wheat',
        minPrice: 22.75,
        maxPrice: 24.5,
        modalPrice: 23.6,
        arrivalQuantity: 500,
      },
    ];

    for (const price of samplePrices) {
      await prisma.marketPrice.create({
        data: price,
      });
    }
    logger.info(`Seeded ${samplePrices.length} market price entries.`);

    // 4. Seed Initial Sample Alert
    await prisma.alert.create({
      data: {
        crop: 'Tomato',
        market: 'Koyambedu',
        targetPrice: 40,
      },
    });
    logger.info('Seeded sample price alert.');

    logger.info('Database seeding completed successfully!');
  } catch (error: any) {
    logger.error(`Database seeding failed: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

// Auto-run if executed directly
if (require.main === module) {
  seedDatabase();
}
