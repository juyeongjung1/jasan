'use client';

import React from 'react';
import { PortfolioSummary } from '@/types';
import { formatPercent } from '@/lib/calculations';
import { Language, DICTIONARY, formatMaskedCurrency } from '@/lib/i18n';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface SummaryCardsProps {
  summary: PortfolioSummary;
  lang?: Language;
  isMasked?: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  summary,
  lang = 'ko',
  isMasked = true,
}) => {
  const t = DICTIONARY[lang];
  const isGainPositive = summary.totalGainLossJpy >= 0;
  const isFxGainPositive = summary.fxGainJpy >= 0;
  const isStockGainPositive = summary.assetGrowthGainJpy >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Current Value */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-blue-500/50 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {t.totalAssets}
          </span>
          <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatMaskedCurrency(summary.totalCurrentValJpy, isMasked)}
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span>{t.totalPrincipal}:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {formatMaskedCurrency(summary.totalPurchaseJpy, isMasked)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Total Gain / Loss */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {t.totalGain}
          </span>
          <div
            className={`p-2 rounded-xl ${
              isGainPositive
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
            }`}
          >
            {isGainPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          </div>
        </div>
        <div className="mt-3">
          <div
            className={`text-2xl font-extrabold tracking-tight flex items-center gap-1 ${
              isGainPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {isGainPositive ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
            <span>{formatMaskedCurrency(summary.totalGainLossJpy, isMasked, true)}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isGainPositive
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
              }`}
            >
              {formatPercent(summary.totalGainLossPercent, true)} (수익률)
            </span>
          </div>
        </div>
      </div>

      {/* 3. FX Gain Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-amber-500/50 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {t.fxGain}
          </span>
          <div className="p-2 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-amber-600 dark:text-amber-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div
            className={`text-2xl font-extrabold tracking-tight ${
              isFxGainPositive
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatMaskedCurrency(summary.fxGainJpy + summary.synergyGainJpy, isMasked, true)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            해외 자산 {summary.foreignAssetsCount}개 종목 환노출
          </div>
        </div>
      </div>

      {/* 4. Underlying Asset Growth Gain */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-purple-500/50 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {t.stockGrowth}
          </span>
          <div className="p-2 bg-purple-50 dark:bg-purple-950/50 rounded-xl text-purple-600 dark:text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div
            className={`text-2xl font-extrabold tracking-tight ${
              isStockGainPositive
                ? 'text-purple-600 dark:text-purple-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatMaskedCurrency(summary.assetGrowthGainJpy, isMasked, true)}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            <Calendar className="w-3 h-3" />
            <span>{t.monthlyInvest}: {formatMaskedCurrency(summary.monthlyTotalInvestmentJpy, isMasked)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
