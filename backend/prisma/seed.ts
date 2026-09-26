import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting AgriLink database seeding...');

  // 1. Clean existing records
  await prisma.priceAlert.deleteMany();
  await prisma.marketPrice.deleteMany();
  await prisma.priceImportLog.deleteMany();
  await prisma.mSP.deleteMany();
  await prisma.market.deleteMany();
  await prisma.district.deleteMany();
  await prisma.state.deleteMany();
  await prisma.commodity.deleteMany();
  await prisma.dataSource.deleteMany();
  await prisma.user.deleteMany();

  // 2. Data Sources
  const agmarknetSource = await prisma.dataSource.create({
    data: {
      name: 'AGMARKNET (DMI)',
      provider: 'Directorate of Marketing & Inspection, Ministry of Agriculture & Farmers Welfare, GoI',
      url: 'https://agmarknet.gov.in',
      lastUpdated: new Date('2026-09-26T06:00:00Z'),
    },
  });

  const ogdSource = await prisma.dataSource.create({
    data: {
      name: 'Open Government Data (OGD) Platform',
      provider: 'National Informatics Centre (NIC) / Government of India',
      url: 'https://data.gov.in',
      lastUpdated: new Date('2026-09-25T18:30:00Z'),
    },
  });

  // 3. States
  const tn = await prisma.state.create({
    data: {
      name: 'Tamil Nadu',
      code: 'TN',
    },
  });

  const ka = await prisma.state.create({
    data: {
      name: 'Karnataka',
      code: 'KA',
    },
  });

  const mh = await prisma.state.create({
    data: {
      name: 'Maharashtra',
      code: 'MH',
    },
  });

  // 4. Districts
  // Tamil Nadu Districts
  const dChennai = await prisma.district.create({ data: { name: 'Chennai', stateId: tn.id } });
  const dMadurai = await prisma.district.create({ data: { name: 'Madurai', stateId: tn.id } });
  const dCoimbatore = await prisma.district.create({ data: { name: 'Coimbatore', stateId: tn.id } });
  const dSalem = await prisma.district.create({ data: { name: 'Salem', stateId: tn.id } });
  const dDindigul = await prisma.district.create({ data: { name: 'Dindigul', stateId: tn.id } });
  const dTiruchirappalli = await prisma.district.create({ data: { name: 'Tiruchirappalli', stateId: tn.id } });
  const dThanjavur = await prisma.district.create({ data: { name: 'Thanjavur', stateId: tn.id } });

  // Karnataka Districts
  const dBengaluru = await prisma.district.create({ data: { name: 'Bengaluru Urban', stateId: ka.id } });
  const dKolar = await prisma.district.create({ data: { name: 'Kolar', stateId: ka.id } });

  // Maharashtra Districts
  const dPune = await prisma.district.create({ data: { name: 'Pune', stateId: mh.id } });
  const dNashik = await prisma.district.create({ data: { name: 'Nashik', stateId: mh.id } });

  // 5. Markets (APMCs)
  const mKoyambedu = await prisma.market.create({
    data: {
      name: 'Koyambedu',
      code: 'TN_KOY',
      districtId: dChennai.id,
      address: 'Koyambedu Wholesale Market Complex, Chennai, Tamil Nadu 600092',
      latitude: 13.0694,
      longitude: 80.1948,
    },
  });

  const mMadurai = await prisma.market.create({
    data: {
      name: 'Madurai',
      code: 'TN_MAD',
      districtId: dMadurai.id,
      address: 'Mattuthavani Central Market, Madurai, Tamil Nadu 625007',
      latitude: 9.9482,
      longitude: 78.1569,
    },
  });

  const mCoimbatore = await prisma.market.create({
    data: {
      name: 'Coimbatore',
      code: 'TN_CBE',
      districtId: dCoimbatore.id,
      address: 'M.G.R. Wholesale Market, Saibaba Colony, Coimbatore, Tamil Nadu 641011',
      latitude: 11.0264,
      longitude: 76.9458,
    },
  });

  const mSalem = await prisma.market.create({
    data: {
      name: 'Salem',
      code: 'TN_SLM',
      districtId: dSalem.id,
      address: 'Shevapet APMC Market Yard, Salem, Tamil Nadu 636002',
      latitude: 11.6538,
      longitude: 78.1460,
    },
  });

  const mOttanchatram = await prisma.market.create({
    data: {
      name: 'Ottanchatram (Dindigul)',
      code: 'TN_OTT',
      districtId: dDindigul.id,
      address: 'Ottanchatram Vegetable Market, Dindigul, Tamil Nadu 624619',
      latitude: 10.4952,
      longitude: 77.7471,
    },
  });

  const mTiruchirappalli = await prisma.market.create({
    data: {
      name: 'Tiruchirappalli',
      code: 'TN_TRY',
      districtId: dTiruchirappalli.id,
      address: 'Gandhi Market, Tiruchirappalli, Tamil Nadu 620008',
      latitude: 10.8267,
      longitude: 78.6974,
    },
  });

  const mThanjavur = await prisma.market.create({
    data: {
      name: 'Thanjavur',
      code: 'TN_TNJ',
      districtId: dThanjavur.id,
      address: 'Thanjavur Regulated Market, Thanjavur, Tamil Nadu 613001',
      latitude: 10.7870,
      longitude: 79.1378,
    },
  });

  const mKolar = await prisma.market.create({
    data: {
      name: 'Kolar',
      code: 'KA_KOL',
      districtId: dKolar.id,
      address: 'APMC Market Yard, Kolar, Karnataka 563101',
      latitude: 13.1367,
      longitude: 78.1292,
    },
  });

  const mYeshwanthpur = await prisma.market.create({
    data: {
      name: 'Yeshwanthpur',
      code: 'KA_YES',
      districtId: dBengaluru.id,
      address: 'APMC Yard, Yeshwanthpur, Bengaluru, Karnataka 560022',
      latitude: 13.0238,
      longitude: 77.5501,
    },
  });

  const mPune = await prisma.market.create({
    data: {
      name: 'Pune (Gultekdi)',
      code: 'MH_PUN',
      districtId: dPune.id,
      address: 'Gultekdi Market Yard, Pune, Maharashtra 411037',
      latitude: 18.4900,
      longitude: 73.8647,
    },
  });

  const mLasalgaon = await prisma.market.create({
    data: {
      name: 'Lasalgaon',
      code: 'MH_LAS',
      districtId: dNashik.id,
      address: 'Lasalgaon APMC Market (Asia largest onion market), Nashik, Maharashtra 422306',
      latitude: 20.1472,
      longitude: 74.2285,
    },
  });

  // 6. Commodities
  const cTomato = await prisma.commodity.create({
    data: {
      name: 'Tomato',
      code: 'tomato',
      category: 'VEGETABLES',
      defaultUnit: '₹/kg',
      icon: '🍅',
      isMspCovered: false,
    },
  });

  const cOnion = await prisma.commodity.create({
    data: {
      name: 'Onion',
      code: 'onion',
      category: 'VEGETABLES',
      defaultUnit: '₹/kg',
      icon: '🧅',
      isMspCovered: false,
    },
  });

  const cPotato = await prisma.commodity.create({
    data: {
      name: 'Potato',
      code: 'potato',
      category: 'VEGETABLES',
      defaultUnit: '₹/kg',
      icon: '🥔',
      isMspCovered: false,
    },
  });

  const cRice = await prisma.commodity.create({
    data: {
      name: 'Rice (Paddy)',
      code: 'rice',
      category: 'GRAINS',
      defaultUnit: '₹/quintal',
      icon: '🌾',
      isMspCovered: true,
    },
  });

  const cWheat = await prisma.commodity.create({
    data: {
      name: 'Wheat',
      code: 'wheat',
      category: 'GRAINS',
      defaultUnit: '₹/quintal',
      icon: '🌾',
      isMspCovered: true,
    },
  });

  const cChilli = await prisma.commodity.create({
    data: {
      name: 'Green Chilli',
      code: 'green_chilli',
      category: 'VEGETABLES',
      defaultUnit: '₹/kg',
      icon: '🌶️',
      isMspCovered: false,
    },
  });

  const cMaize = await prisma.commodity.create({
    data: {
      name: 'Maize',
      code: 'maize',
      category: 'GRAINS',
      defaultUnit: '₹/quintal',
      icon: '🌽',
      isMspCovered: true,
    },
  });

  // 7. MSP Records
  await prisma.mSP.createMany({
    data: [
      {
        commodityId: cRice.id,
        season: 'Kharif',
        year: 2026,
        price: 2300,
        unit: '₹/quintal',
        source: 'Commission for Agricultural Costs and Prices (CACP), Ministry of Agriculture',
      },
      {
        commodityId: cWheat.id,
        season: 'Rabi',
        year: 2026,
        price: 2425,
        unit: '₹/quintal',
        source: 'Commission for Agricultural Costs and Prices (CACP), Ministry of Agriculture',
      },
      {
        commodityId: cMaize.id,
        season: 'Kharif',
        year: 2026,
        price: 2225,
        unit: '₹/quintal',
        source: 'Commission for Agricultural Costs and Prices (CACP), Ministry of Agriculture',
      },
    ],
  });

  // 8. Generate Realistic Daily Market Price History (Aug 1, 2026 to Sep 26, 2026 - 57 days)
  console.log('Generating realistic daily market prices across APMCs...');

  interface MarketPriceConfig {
    commodityId: string;
    marketId: string;
    basePrice: number;
    volatility: number;
    unit: string;
    trendBias: number; // positive = upward, negative = downward
  }

  const priceConfigs: MarketPriceConfig[] = [
    // Tomato (₹/kg)
    { commodityId: cTomato.id, marketId: mKoyambedu.id, basePrice: 28, volatility: 4, unit: '₹/kg', trendBias: 0.12 },
    { commodityId: cTomato.id, marketId: mMadurai.id, basePrice: 25, volatility: 3.5, unit: '₹/kg', trendBias: 0.08 },
    { commodityId: cTomato.id, marketId: mCoimbatore.id, basePrice: 27, volatility: 3.8, unit: '₹/kg', trendBias: 0.10 },
    { commodityId: cTomato.id, marketId: mSalem.id, basePrice: 24, volatility: 3.2, unit: '₹/kg', trendBias: 0.05 },
    { commodityId: cTomato.id, marketId: mOttanchatram.id, basePrice: 23, volatility: 3.0, unit: '₹/kg', trendBias: 0.07 },
    { commodityId: cTomato.id, marketId: mKolar.id, basePrice: 22, volatility: 3.5, unit: '₹/kg', trendBias: 0.09 },

    // Onion (₹/kg)
    { commodityId: cOnion.id, marketId: mKoyambedu.id, basePrice: 38, volatility: 5, unit: '₹/kg', trendBias: 0.15 },
    { commodityId: cOnion.id, marketId: mMadurai.id, basePrice: 35, volatility: 4.5, unit: '₹/kg', trendBias: 0.12 },
    { commodityId: cOnion.id, marketId: mCoimbatore.id, basePrice: 37, volatility: 4.8, unit: '₹/kg', trendBias: 0.14 },
    { commodityId: cOnion.id, marketId: mSalem.id, basePrice: 34, volatility: 4.0, unit: '₹/kg', trendBias: 0.11 },
    { commodityId: cOnion.id, marketId: mLasalgaon.id, basePrice: 29, volatility: 4.2, unit: '₹/kg', trendBias: 0.18 },
    { commodityId: cOnion.id, marketId: mPune.id, basePrice: 32, volatility: 4.5, unit: '₹/kg', trendBias: 0.16 },

    // Potato (₹/kg)
    { commodityId: cPotato.id, marketId: mKoyambedu.id, basePrice: 26, volatility: 2.2, unit: '₹/kg', trendBias: -0.04 },
    { commodityId: cPotato.id, marketId: mMadurai.id, basePrice: 24, volatility: 2.0, unit: '₹/kg', trendBias: -0.03 },
    { commodityId: cPotato.id, marketId: mSalem.id, basePrice: 23, volatility: 1.8, unit: '₹/kg', trendBias: -0.02 },
    { commodityId: cPotato.id, marketId: mYeshwanthpur.id, basePrice: 25, volatility: 2.1, unit: '₹/kg', trendBias: -0.03 },

    // Rice (Paddy) (₹/quintal)
    { commodityId: cRice.id, marketId: mThanjavur.id, basePrice: 2350, volatility: 80, unit: '₹/quintal', trendBias: 2.5 },
    { commodityId: cRice.id, marketId: mTiruchirappalli.id, basePrice: 2380, volatility: 75, unit: '₹/quintal', trendBias: 2.8 },
    { commodityId: cRice.id, marketId: mMadurai.id, basePrice: 2420, volatility: 90, unit: '₹/quintal', trendBias: 3.1 },

    // Wheat (₹/quintal)
    { commodityId: cWheat.id, marketId: mYeshwanthpur.id, basePrice: 2550, volatility: 70, unit: '₹/quintal', trendBias: 1.8 },
    { commodityId: cWheat.id, marketId: mPune.id, basePrice: 2480, volatility: 65, unit: '₹/quintal', trendBias: 1.5 },

    // Green Chilli (₹/kg)
    { commodityId: cChilli.id, marketId: mKoyambedu.id, basePrice: 52, volatility: 8, unit: '₹/kg', trendBias: 0.2 },
    { commodityId: cChilli.id, marketId: mOttanchatram.id, basePrice: 46, volatility: 7, unit: '₹/kg', trendBias: 0.18 },

    // Maize (₹/quintal)
    { commodityId: cMaize.id, marketId: mSalem.id, basePrice: 2280, volatility: 50, unit: '₹/quintal', trendBias: 1.2 },
    { commodityId: cMaize.id, marketId: mKolar.id, basePrice: 2240, volatility: 55, unit: '₹/quintal', trendBias: 1.0 },
  ];

  const startDate = new Date('2026-08-01T00:00:00Z');
  const endDate = new Date('2026-09-26T00:00:00Z');
  const dayMs = 24 * 60 * 60 * 1000;
  const totalDays = Math.round((endDate.getTime() - startDate.getTime()) / dayMs) + 1;

  const marketPriceRecords: Array<{
    commodityId: string;
    marketId: string;
    date: Date;
    minPrice: number;
    maxPrice: number;
    modalPrice: number;
    unit: string;
    sourceId: string;
  }> = [];

  for (const cfg of priceConfigs) {
    let currentModal = cfg.basePrice;

    for (let d = 0; d < totalDays; d++) {
      const curDate = new Date(startDate.getTime() + d * dayMs);

      // Deterministic pseudo-random seasonal wave + random walk
      const sineWave = Math.sin((d / 7) * Math.PI) * (cfg.volatility * 0.4);
      const walk = (Math.sin(d * 17.3 + cfg.basePrice) * cfg.volatility * 0.3) + cfg.trendBias;
      
      currentModal = Math.max(
        cfg.basePrice * 0.6,
        Math.min(cfg.basePrice * 1.6, currentModal + walk + sineWave * 0.1)
      );

      const roundedModal = Number(currentModal.toFixed(1));
      const spread = cfg.volatility * 0.7;
      const minPrice = Number(Math.max(1, (roundedModal - spread * (0.8 + Math.abs(Math.sin(d)) * 0.4))).toFixed(1));
      const maxPrice = Number((roundedModal + spread * (0.8 + Math.abs(Math.cos(d)) * 0.4)).toFixed(1));

      marketPriceRecords.push({
        commodityId: cfg.commodityId,
        marketId: cfg.marketId,
        date: curDate,
        minPrice,
        maxPrice,
        modalPrice: roundedModal,
        unit: cfg.unit,
        sourceId: agmarknetSource.id,
      });
    }
  }

  // Insert market prices in chunks to optimize
  const chunkSize = 200;
  for (let i = 0; i < marketPriceRecords.length; i += chunkSize) {
    const chunk = marketPriceRecords.slice(i, i + chunkSize);
    await prisma.marketPrice.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }

  console.log(`✅ Seeded ${marketPriceRecords.length} historical market price records.`);

  // 9. Sample User
  const demoUser = await prisma.user.create({
    data: {
      name: 'Senthil Kumar',
      email: 'senthil.farmer@agrilink.in',
      phone: '+91 98765 43210',
      role: 'FARMER',
      preferredLanguage: 'ta',
    },
  });

  // 10. Sample Alerts
  await prisma.priceAlert.createMany({
    data: [
      {
        userId: demoUser.id,
        commodityId: cTomato.id,
        marketId: mKoyambedu.id,
        targetPrice: 32.0,
        condition: 'ABOVE',
        status: 'ACTIVE',
        notes: 'Target selling threshold for Koyambedu Tomato',
      },
      {
        userId: demoUser.id,
        commodityId: cOnion.id,
        marketId: mOttanchatram.id,
        targetPrice: 30.0,
        condition: 'BELOW',
        status: 'ACTIVE',
        notes: 'Procurement alert when onion price drops',
      },
      {
        userId: demoUser.id,
        commodityId: cPotato.id,
        marketId: mMadurai.id,
        targetPrice: 22.0,
        condition: 'BELOW',
        status: 'TRIGGERED',
        triggeredAt: new Date('2026-09-22T08:30:00Z'),
        notes: 'Price reached lower historical tier',
      },
    ],
  });

  // 11. Sample Data Import Log
  await prisma.priceImportLog.create({
    data: {
      sourceId: agmarknetSource.id,
      filename: 'agmarknet_daily_feed_20260926.json',
      recordsImported: marketPriceRecords.length,
      status: 'SUCCESS',
      errors: null,
    },
  });

  console.log('🎉 AgriLink database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
