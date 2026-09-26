import { prisma } from '../config/db.js';
import { commodityRepository } from '../repositories/commodity.repository.js';
import { locationRepository } from '../repositories/location.repository.js';
import { isValidDateFormat, parseDateSafe } from '../utils/dateUtils.js';

export interface RawMandiRecord {
  commodity: string;
  state: string;
  district: string;
  market: string;
  date: string; // YYYY-MM-DD
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit?: string;
}

export interface IngestionResult {
  totalProcessed: number;
  inserted: number;
  updated: number;
  rejected: number;
  reasons: string[];
  importLogId: string;
}

export class DataImportService {
  /**
   * Name normalization map for AGMARKNET variations
   */
  private normalizeCommodityName(raw: string): string {
    const cleaned = raw.trim().toLowerCase();
    if (cleaned.includes('tomato')) return 'Tomato';
    if (cleaned.includes('onion')) return 'Onion';
    if (cleaned.includes('potato')) return 'Potato';
    if (cleaned.includes('rice') || cleaned.includes('paddy')) return 'Rice (Paddy)';
    if (cleaned.includes('wheat')) return 'Wheat';
    if (cleaned.includes('chilli') || cleaned.includes('chili')) return 'Green Chilli';
    if (cleaned.includes('maize') || cleaned.includes('corn')) return 'Maize';
    return raw.trim();
  }

  private normalizeMarketName(raw: string): string {
    const cleaned = raw.trim().toLowerCase();
    if (cleaned.includes('koyambedu')) return 'Koyambedu';
    if (cleaned.includes('mattuthavani') || cleaned.includes('madurai')) return 'Madurai';
    if (cleaned.includes('coimbatore') || cleaned.includes('mgr')) return 'Coimbatore';
    if (cleaned.includes('salem') || cleaned.includes('shevapet')) return 'Salem';
    if (cleaned.includes('ottanchatram') || cleaned.includes('dindigul')) return 'Ottanchatram (Dindigul)';
    if (cleaned.includes('gandhi') || cleaned.includes('tiruchirappalli') || cleaned.includes('trichy'))
      return 'Tiruchirappalli';
    if (cleaned.includes('thanjavur')) return 'Thanjavur';
    if (cleaned.includes('kolar')) return 'Kolar';
    if (cleaned.includes('yeshwanthpur')) return 'Yeshwanthpur';
    if (cleaned.includes('lasalgaon')) return 'Lasalgaon';
    if (cleaned.includes('pune') || cleaned.includes('gultekdi')) return 'Pune (Gultekdi)';
    return raw.trim();
  }

  /**
   * Ingest and validate a batch of mandi price records
   */
  async ingestMandiBatch(
    records: RawMandiRecord[],
    sourceName = 'AGMARKNET (DMI)',
    filename = 'batch_feed.json'
  ): Promise<IngestionResult> {
    // 1. Get or create Data Source
    let dataSource = await prisma.dataSource.findFirst({
      where: { name: { contains: 'AGMARKNET', mode: 'insensitive' } },
    });

    if (!dataSource) {
      dataSource = await prisma.dataSource.create({
        data: {
          name: sourceName,
          provider: 'Directorate of Marketing & Inspection, GoI',
          url: 'https://agmarknet.gov.in',
        },
      });
    }

    let inserted = 0;
    let updated = 0;
    let rejected = 0;
    const reasons: string[] = [];

    for (const raw of records) {
      // Step A: Validation rules
      if (!raw.commodity || !raw.market || !raw.date) {
        rejected++;
        reasons.push(`Record missing required fields: ${JSON.stringify(raw)}`);
        continue;
      }

      if (!isValidDateFormat(raw.date)) {
        rejected++;
        reasons.push(`Invalid date format for record: ${raw.date}`);
        continue;
      }

      if (raw.minPrice < 0 || raw.maxPrice < 0 || raw.modalPrice < 0) {
        rejected++;
        reasons.push(`Negative price encountered for ${raw.commodity} in ${raw.market}`);
        continue;
      }

      // Check minPrice <= modalPrice <= maxPrice where applicable
      if (raw.minPrice > raw.maxPrice || raw.modalPrice < raw.minPrice || raw.modalPrice > raw.maxPrice) {
        // Correct minor inversion or log warning
        const sorted = [raw.minPrice, raw.modalPrice, raw.maxPrice].sort((a, b) => a - b);
        raw.minPrice = sorted[0];
        raw.modalPrice = sorted[1];
        raw.maxPrice = sorted[2];
      }

      // Step B: Normalization
      const normCommodity = this.normalizeCommodityName(raw.commodity);
      const normMarket = this.normalizeMarketName(raw.market);

      // Step C: Entity Resolution
      const commodity = await commodityRepository.findByIdOrCode(normCommodity);
      if (!commodity) {
        rejected++;
        reasons.push(`Unknown commodity: ${normCommodity}`);
        continue;
      }

      const market = await locationRepository.findMarketByIdOrName(normMarket);
      if (!market) {
        rejected++;
        reasons.push(`Unknown market: ${normMarket}`);
        continue;
      }

      const parsedDate = parseDateSafe(raw.date);

      // Step D: Insert or Update (upsert)
      try {
        await prisma.marketPrice.upsert({
          where: {
            commodityId_marketId_date: {
              commodityId: commodity.id,
              marketId: market.id,
              date: parsedDate,
            },
          },
          create: {
            commodityId: commodity.id,
            marketId: market.id,
            date: parsedDate,
            minPrice: raw.minPrice,
            maxPrice: raw.maxPrice,
            modalPrice: raw.modalPrice,
            unit: raw.unit || commodity.defaultUnit,
            sourceId: dataSource.id,
          },
          update: {
            minPrice: raw.minPrice,
            maxPrice: raw.maxPrice,
            modalPrice: raw.modalPrice,
            unit: raw.unit || commodity.defaultUnit,
            sourceId: dataSource.id,
          },
        });
        inserted++;
      } catch (err: any) {
        rejected++;
        reasons.push(`Database error on upsert: ${err.message}`);
      }
    }

    // Step E: Create Import Audit Log
    const importLog = await prisma.priceImportLog.create({
      data: {
        sourceId: dataSource.id,
        filename,
        recordsImported: inserted + updated,
        status: rejected === 0 ? 'SUCCESS' : inserted > 0 ? 'PARTIAL' : 'FAILED',
        errors: reasons.length > 0 ? reasons.slice(0, 10).join('; ') : null,
      },
    });

    // Update data source lastUpdated
    await prisma.dataSource.update({
      where: { id: dataSource.id },
      data: { lastUpdated: new Date() },
    });

    return {
      totalProcessed: records.length,
      inserted,
      updated,
      rejected,
      reasons: reasons.slice(0, 10),
      importLogId: importLog.id,
    };
  }
}

export const dataImportService = new DataImportService();
