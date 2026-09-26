'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sprout,
  User,
  BarChart3,
  Scale,
  Bell,
  Sparkles,
  Settings,
  LayoutDashboard,
  Menu,
  X,
  CheckCircle,
} from 'lucide-react';
import { Language } from '../types/market';
import { TRANSLATIONS } from '../utils/translations';
import { getAlerts, PriceAlert } from '../lib/api/alertApi';
import { MOCK_ALERTS } from '../lib/mock/marketData';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const pathname = usePathname();
  const t = TRANSLATIONS[currentLanguage];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);

  useEffect(() => {
    let isCancelled = false;
    getAlerts()
      .then((data) => {
        if (!isCancelled && data) setAlerts(data);
      })
      .catch(() => {
        if (!isCancelled) setAlerts(MOCK_ALERTS);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const triggeredCount = alerts.filter((a) => a.status === 'TRIGGERED').length;
  const activeCount = alerts.filter((a) => a.status === 'ACTIVE').length;

  const navLinks = [
    { href: '/', label: t.navDashboard, icon: LayoutDashboard },
    { href: '/market-prices', label: t.navMarketPrices, icon: BarChart3 },
    { href: '/compare', label: t.navCompareMarkets, icon: Scale },
    { href: '/alerts', label: t.navPriceAlerts, icon: Bell, badge: triggeredCount > 0 ? triggeredCount : undefined },
    { href: '/insights', label: t.navInsights, icon: Sparkles },
    { href: '/settings', label: t.navSettings, icon: Settings },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & College Project Credit */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 ring-4 ring-emerald-50 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 stroke-[2.3]" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-950 font-sans">
                  Agri<span className="text-emerald-700">Link</span>
                </span>
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-200">
                  Gov Mandi
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold tracking-wide">
                Team Alpha Nexus • Panimalar Eng. College
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/30'
                      : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-0.5 px-1.5 py-0.2 bg-amber-500 text-white text-[10px] font-extrabold rounded-full animate-bounce">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Notifications, Language Toggle, Farmer Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-xl text-slate-600 hover:text-emerald-900 hover:bg-emerald-50 transition-colors border border-slate-200"
                aria-label="Alert Notifications"
              >
                <Bell className="w-4 h-4" />
                {triggeredCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                    {triggeredCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Price Notifications
                    </span>
                    <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                      {activeCount} Active
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5 max-h-60 overflow-y-auto">
                    {alerts.slice(0, 3).map((a) => (
                      <div
                        key={a.id}
                        className={`p-2.5 rounded-xl border text-xs ${
                          a.status === 'TRIGGERED'
                            ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                            : 'bg-emerald-50/50 border-emerald-100 text-emerald-950'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>{a.commodity.name} • {a.market.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                            a.status === 'TRIGGERED' ? 'bg-rose-200 text-rose-800' : 'bg-emerald-200 text-emerald-800'
                          }`}>
                            {a.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Condition: {a.condition} ₹{a.targetPrice}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 text-center">
                    <Link
                      href="/alerts"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                    >
                      View All Alerts →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector Toggle */}
            <div
              className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold"
              role="group"
              aria-label="Language Selector"
            >
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  currentLanguage === 'en'
                    ? 'bg-white text-emerald-950 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-pressed={currentLanguage === 'en'}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('ta')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  currentLanguage === 'ta'
                    ? 'bg-white text-emerald-950 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-pressed={currentLanguage === 'ta'}
              >
                தமிழ்
              </button>
            </div>

            {/* Profile / Farmer User Area */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-black text-xs shadow-xs">
                SK
              </div>
              <div className="text-left text-xs leading-tight">
                <p className="font-extrabold text-slate-900">Senthil K.</p>
                <p className="text-[10px] text-emerald-700 font-bold">Farmer / Mandi</p>
              </div>
            </div>

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-700 text-white'
                      : 'text-slate-700 hover:bg-emerald-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
