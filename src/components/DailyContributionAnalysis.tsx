'use client';

import React, { useState, useEffect } from 'react';
import { AssetHolding } from '@/types';
import { formatPercent } from '@/lib/calculations';
import { Language, DICTIONARY, formatMaskedCurrency } from '@/lib/i18n';
import { MarketInsightSummary } from '@/app/api/market-insights/route';
import {
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Layers,
} from 'lucide-react';

interface DailyContributionAnalysisProps {
  holdings: AssetHolding[];
  lang?: Language;
  isMasked?: boolean;
}

export const DailyContributionAnalysis: React.FC<DailyContributionAnalysisProps> = ({
  holdings,
  lang = 'ko',
  isMasked = true,
}) => {
  const t = DICTIONARY[lang];
  const [insights, setInsights] = useState<MarketInsightSummary | null>(null);

  useEffect(() => {
    async function loadInsights() {
      try {
        const res = await fetch('/api/market-insights');
        if (res.ok) {
          const data = await res.json();
          setInsights(data.insights);
        }
      } catch (e) {
        console.error('Failed to load market insights:', e);
      }
    }
    loadInsights();
  }, []);

  // 各銘柄の本日の変動額（寄与額）を算出
  const contributionItems = holdings.map((h) => {
    const changePct = h.dailyChangePct || 0;
    const diffJpy =
      changePct !== 0
        ? Math.round(h.currentValJpy - h.currentValJpy / (1 + changePct / 100))
        : 0;

    return {
      id: h.id,
      name: h.name,
      currentValJpy: h.currentValJpy,
      dailyChangePct: changePct,
      diffJpy,
      fundCode: h.fundCode,
      category: h.category,
    };
  });

  const negativeContributors = contributionItems
    .filter((c) => c.diffJpy < 0)
    .sort((a, b) => a.diffJpy - b.diffJpy);

  const positiveContributors = contributionItems
    .filter((c) => c.diffJpy > 0)
    .sort((a, b) => b.diffJpy - a.diffJpy);

  const neutralContributors = contributionItems.filter((c) => c.diffJpy === 0);

  const totalDailyDiffJpy = contributionItems.reduce((sum, c) => sum + c.diffJpy, 0);
  const totalVal = holdings.reduce((sum, h) => sum + h.currentValJpy, 0);
  const totalDailyDiffPct = totalVal > 0 ? (totalDailyDiffJpy / (totalVal - totalDailyDiffJpy)) * 100 : 0;

  const totalNegativeJpy = negativeContributors.reduce((sum, c) => sum + c.diffJpy, 0);
  const totalPositiveJpy = positiveContributors.reduce((sum, c) => sum + c.diffJpy, 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {t.contribTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.contribSubtitle}</p>
          </div>
        </div>

        {/* T+1 Notice Badge */}
        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs">
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="font-medium">{t.t1Notice}</span>
        </div>
      </div>

      {/* Summary Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Total Today Change */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
            {t.todayChange}
          </span>
          <div
            className={`text-2xl font-extrabold mt-1 flex items-center gap-1 ${
              totalDailyDiffJpy >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {totalDailyDiffJpy >= 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
            <span>{formatMaskedCurrency(totalDailyDiffJpy, isMasked, true)}</span>
          </div>
          <span
            className={`text-xs font-bold block mt-0.5 ${
              totalDailyDiffJpy >= 0 ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {formatPercent(totalDailyDiffPct, true)} (전체 변동률)
          </span>
        </div>

        {/* Negative Drag Factors */}
        <div className="bg-rose-50/50 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-200/60 dark:border-rose-900/40">
          <span className="text-xs text-rose-700 dark:text-rose-300 font-bold flex items-center gap-1">
            <TrendingDown className="w-4 h-4 text-rose-500" />
            <span>{t.dragFactors}</span>
          </span>
          <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {formatMaskedCurrency(totalNegativeJpy, isMasked)}
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-0.5">
            주요 요인: {negativeContributors[0]?.name.split('(')[0] || '-'} 등
          </span>
        </div>

        {/* Cushion / Offset Factors */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40">
          <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{t.cushionFactors}</span>
          </span>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {totalPositiveJpy > 0 ? `+${formatMaskedCurrency(totalPositiveJpy, isMasked)}` : (isMasked ? '현금 대기자금 방어' : '현금 110만엔')}
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-0.5">
            무위험 현금 및 광범위 인덱스 분산 효과
          </span>
        </div>
      </div>

      {/* Breakdown: Impact List by Product */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>각 상품별 오늘의 기여도 순위</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Negative Drag List */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center justify-between">
              <span>{t.dragListTitle}</span>
              <span className="text-[11px] font-normal text-slate-500">
                {negativeContributors.length} 건
              </span>
            </div>

            <div className="space-y-2">
              {negativeContributors.map((c) => (
                <div
                  key={c.id}
                  className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block truncate">
                      {c.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      평가액: {formatMaskedCurrency(c.currentValJpy, isMasked)}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-extrabold text-xs text-rose-600 dark:text-rose-400">
                      {formatMaskedCurrency(c.diffJpy, isMasked)}
                    </div>
                    <span className="text-[10px] text-rose-500 font-semibold block">
                      전일비 {c.dailyChangePct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cushion / Stable List */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <span>{t.cushionListTitle}</span>
              <span className="text-[11px] font-normal text-slate-500">
                {positiveContributors.length + neutralContributors.length} 건
              </span>
            </div>

            <div className="space-y-2">
              {[...positiveContributors, ...neutralContributors].map((c) => (
                <div
                  key={c.id}
                  className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block truncate">
                      {c.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      평가액: {formatMaskedCurrency(c.currentValJpy, isMasked)}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`font-extrabold text-xs ${
                        c.diffJpy > 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {c.diffJpy > 0 ? `+${formatMaskedCurrency(c.diffJpy, isMasked)}` : (isMasked ? '±*** (방어)' : '±0원 (방어)')}
                    </div>
                    <span
                      className={`text-[10px] font-semibold block ${
                        c.diffJpy > 0 ? 'text-emerald-500' : 'text-slate-400'
                      }`}
                    >
                      {c.dailyChangePct > 0 ? `+${c.dailyChangePct}%` : '무변동·안정'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section: Major US Tech Stocks Driver */}
      {insights && (
        <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>{t.usStocksTitle}</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              ※ FANG+, Z테크20, NASDAQ100, S&P500 주요 구성 종목
            </span>
          </div>

          {/* Stock Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {insights.majorStocks.map((stock) => {
              const isPos = stock.changePct >= 0;
              return (
                <div
                  key={stock.symbol}
                  className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                      {stock.symbol}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.2 rounded ${
                        isPos
                          ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950'
                          : 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {stock.changePct}%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                    {stock.name}
                  </span>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    ${stock.price.toFixed(1)}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    {stock.relatedFunds.slice(0, 2).map((rf) => (
                      <span
                        key={rf}
                        className="text-[9px] bg-blue-100/70 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1 py-0.2 rounded font-medium"
                      >
                        {rf}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Market Insight Drivers */}
          <div className="space-y-2.5 pt-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.marketDriversTitle}</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {insights.keyDrivers.map((driver, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/80 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-1.5"
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    {driver.impact === 'negative' ? (
                      <span className="p-1 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="p-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span className="text-slate-900 dark:text-white">{driver.title}</span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {driver.description}
                  </p>

                  <div className="flex items-center gap-1 flex-wrap pt-1 text-[10px] text-slate-400">
                    <span>영향 펀드:</span>
                    {driver.affectedFunds.map((f) => (
                      <span
                        key={f}
                        className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded font-medium"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
