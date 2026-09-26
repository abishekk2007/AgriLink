import { alertService } from '../services/alert.service.js';
import { prisma } from '../config/db.js';

export async function runAlertCheckJob() {
  console.log('⏰ [Job: AlertChecker] Running active alert scan against mandi prices...');
  try {
    const summary = await alertService.checkAndTriggerAlerts();
    console.log(
      `✅ [Job: AlertChecker] Completed. Scanned ${summary.checkedCount} active alerts, triggered ${summary.triggeredCount}.`
    );
    if (summary.triggeredCount > 0) {
      console.log('🔔 Triggered alerts:', JSON.stringify(summary.triggered, null, 2));
    }
    return summary;
  } catch (error) {
    console.error('❌ [Job: AlertChecker] Failed to check alerts:', error);
    throw error;
  }
}

// Standalone execution support
if (process.argv[1]?.endsWith('alertChecker.ts') || process.argv[1]?.endsWith('alertChecker.js')) {
  runAlertCheckJob()
    .then(() => prisma.$disconnect())
    .catch((err) => {
      console.error(err);
      prisma.$disconnect();
      process.exit(1);
    });
}
