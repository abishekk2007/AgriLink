'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Play,
  CheckCircle,
  AlertCircle,
  Trash2,
  Power,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  X,
  Loader2,
} from 'lucide-react';
import { Header } from '../../components/Header';
import { Language } from '../../types/market';
import { TRANSLATIONS, translateCommodity, translateMarket } from '../../utils/translations';
import {
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  checkAlerts,
  PriceAlert,
} from '../../lib/api/alertApi';
import { MOCK_ALERTS } from '../../lib/mock/marketData';

export default function PriceAlertsPage() {
  const [lang, setLang] = useState<Language>('en');
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [selectedTab, setSelectedTab] = useState<'ALL' | 'ACTIVE' | 'TRIGGERED' | 'DISABLED'>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [checkResult, setCheckResult] = useState<any | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newCommodity, setNewCommodity] = useState<string>('Tomato');
  const [newMarket, setNewMarket] = useState<string>('Koyambedu');
  const [newTargetPrice, setNewTargetPrice] = useState<number>(35);
  const [newCondition, setNewCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [newNotes, setNewNotes] = useState<string>('');
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);

  const t = TRANSLATIONS[lang];

  const fetchAlertsList = async () => {
    setIsLoading(true);
    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch (err) {
      console.warn('Alerts API fallback to mock:', err);
      setAlerts(MOCK_ALERTS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertsList();
  }, []);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      await createAlert({
        commodityId: newCommodity,
        marketId: newMarket,
        targetPrice: newTargetPrice,
        condition: newCondition,
        notes: newNotes,
      });
      setIsModalOpen(false);
      setNewNotes('');
      await fetchAlertsList();
    } catch (err: any) {
      alert(`Error creating alert: ${err.message}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleTriggerCheck = async () => {
    setIsChecking(true);
    setCheckResult(null);
    try {
      const result = await checkAlerts();
      setCheckResult(result);
      await fetchAlertsList();
    } catch (err: any) {
      alert(`Error running alert check: ${err.message}`);
    } finally {
      setIsChecking(false);
    }
  };

  const handleToggleStatus = async (item: PriceAlert) => {
    const nextStatus = item.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      await updateAlert(item.id, { status: nextStatus });
      await fetchAlertsList();
    } catch (err: any) {
      window.alert(`Error updating alert status: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this price alert?')) return;
    try {
      await deleteAlert(id);
      setAlerts(alerts.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(`Error deleting alert: ${err.message}`);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (selectedTab === 'ALL') return true;
    return a.status === selectedTab;
  });

  const activeCount = alerts.filter((a) => a.status === 'ACTIVE').length;
  const triggeredCount = alerts.filter((a) => a.status === 'TRIGGERED').length;
  const disabledCount = alerts.filter((a) => a.status === 'DISABLED').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header currentLanguage={lang} onLanguageChange={setLang} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <section aria-labelledby="alerts-title" className="mb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-2.5">
                <Bell className="w-3.5 h-3.5 text-amber-700" />
                <span>Deterministic Trigger Engine</span>
              </div>
              <h1 id="alerts-title" className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
                {t.alertsTitle}
              </h1>
              <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
                {t.alertsSubtitle}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleTriggerCheck}
                disabled={isChecking}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t.checkingAlerts}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.checkAlertsBtn}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.createAlertBtn}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Check Result Banner if available */}
        {checkResult && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <p className="font-bold">
                  Alert scan complete: Scanned {checkResult.checkedCount} active rules, triggered {checkResult.triggeredCount} threshold events.
                </p>
                {checkResult.triggeredCount > 0 && (
                  <p className="text-emerald-800 text-[11px] mt-0.5">
                    Triggered: {checkResult.triggered.map((t: any) => `${t.commodity} @ ${t.market} (₹${t.currentPrice})`).join(', ')}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCheckResult(null)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
          {[
            { id: 'ALL', label: 'All Alerts', count: alerts.length },
            { id: 'ACTIVE', label: t.activeAlerts, count: activeCount },
            { id: 'TRIGGERED', label: t.triggeredAlerts, count: triggeredCount },
            { id: 'DISABLED', label: t.disabledAlerts, count: disabledCount },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedTab === tab.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Alerts Grid */}
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">{t.noAlertsFound}</p>
            <p className="text-xs text-slate-400 mt-1">
              Click &quot;{t.createAlertBtn}&quot; to configure your first mandi price rule.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAlerts.map((alert) => {
              const isTriggered = alert.status === 'TRIGGERED';
              const isActive = alert.status === 'ACTIVE';

              return (
                <div
                  key={alert.id}
                  className={`bg-white rounded-2xl border p-5 transition-all shadow-xs ${
                    isTriggered
                      ? 'border-rose-300 bg-rose-50/20'
                      : isActive
                      ? 'border-slate-200 hover:border-emerald-300'
                      : 'border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 block">
                        {translateCommodity(alert.commodity.name, lang)}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {translateMarket(alert.market.name, lang)}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        isTriggered
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : isActive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">{t.condition}:</span>
                      <span className={`font-bold flex items-center gap-1 ${
                        alert.condition === 'ABOVE' ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {alert.condition === 'ABOVE' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {alert.condition}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">{t.targetPrice}:</span>
                      <span className="font-black text-slate-900 text-base">
                        ₹{alert.targetPrice}
                      </span>
                    </div>

                    {alert.notes && (
                      <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        &quot;{alert.notes}&quot;
                      </p>
                    )}

                    {isTriggered && alert.triggeredAt && (
                      <p className="text-[10px] text-rose-700 font-bold bg-rose-50 p-1.5 rounded-md">
                        Triggered on: {new Date(alert.triggeredAt).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(alert)}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                        isActive
                          ? 'text-slate-600 hover:text-slate-800 border-slate-200 hover:bg-slate-50'
                          : 'text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      <span>{isActive ? 'Disable' : 'Activate'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(alert.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                      title="Delete alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Create Alert */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-100">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                    <Bell className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {t.createAlertBtn}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAlert} className="space-y-4 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block mb-1">{t.crop}</label>
                  <select
                    value={newCommodity}
                    onChange={(e) => setNewCommodity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-white"
                  >
                    {['Tomato', 'Onion', 'Potato', 'Rice (Paddy)', 'Wheat', 'Green Chilli', 'Maize'].map((c) => (
                      <option key={c} value={c}>{translateCommodity(c, lang)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">{t.market}</label>
                  <select
                    value={newMarket}
                    onChange={(e) => setNewMarket(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-white"
                  >
                    {[
                      'Koyambedu',
                      'Madurai',
                      'Coimbatore',
                      'Salem',
                      'Ottanchatram (Dindigul)',
                      'Tiruchirappalli',
                      'Thanjavur',
                      'Kolar',
                      'Yeshwanthpur',
                      'Lasalgaon',
                      'Pune (Gultekdi)',
                    ].map((m) => (
                      <option key={m} value={m}>{translateMarket(m, lang)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">{t.condition}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewCondition('ABOVE')}
                      className={`p-2 rounded-xl border font-bold text-center ${
                        newCondition === 'ABOVE'
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {t.conditionAbove}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCondition('BELOW')}
                      className={`p-2 rounded-xl border font-bold text-center ${
                        newCondition === 'BELOW'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {t.conditionBelow}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-1">{t.targetPrice}</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={newTargetPrice}
                    onChange={(e) => setNewTargetPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-black text-slate-900"
                  />
                </div>

                <div>
                  <label className="block mb-1">Notes / Target Objective (Optional)</label>
                  <input
                    type="text"
                    maxLength={100}
                    placeholder="e.g. Selling threshold for harvest batch"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md shadow-emerald-700/20 disabled:opacity-60"
                  >
                    {formSubmitting ? 'Saving...' : 'Save Price Alert'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="font-bold text-slate-800">
            {t.footerRights}
          </p>
          <p className="max-w-2xl mx-auto text-[11px] leading-relaxed text-slate-500">
            {t.footerDisclaimer}
          </p>
        </div>
      </footer>
    </div>
  );
}
