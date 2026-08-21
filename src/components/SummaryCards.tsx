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
  Globe,
  Sparkles,
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

  // 利益分解の寄与率計算 (%)
  const assetGrowth = Math.max(0, summary.assetGrowthGainJpy);
  const fxGain = Math.max(0, summary.fxGainJpy);
  const synergyGain = Math.max(0, summary.synergyGainJpy);
  const totalPositiveDecomp = Math.max(1, assetGrowth + fxGain + synergyGain);

  const assetGrowthPct = ((assetGrowth / totalPositiveDecomp) * 100).toFixed(1);
  const fxGainPct = ((fxGain / totalPositiveDecomp) * 100).toFixed(1);
  const synergyGainPct = ((synergyGain / totalPositiveDecomp) * 100).toFixed(1);
  const totalFxContributionPct = (((fxGain + synergyGain) / totalPositiveDecomp) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      {/* 4 Overview Metric Cards */}
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
                {formatPercent(summary.totalGainLossPercent, true)} ({lang === 'ko' ? '수익률' : '収益率'})
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
              {lang === 'ko' ? `해외 자산 ${summary.foreignAssetsCount}개 종목 환노출` : `海外資産 ${summary.foreignAssetsCount}銘柄為替連動`}
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
              <span>{t.monthlyInvest}: {activePlansText(lang)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FX Breakdown vs Asset Growth Insight Banner (% Basis for Portfolio Sharing) */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-indigo-700/50 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white tracking-wide">
                {lang === 'ko'
                  ? '환율 요인 vs 자산 성장 요인의 손익 분해 분석'
                  : '為替要因 vs 資産成長要因の損益分解分析'}
              </h2>
              <span className="bg-cyan-500/20 text-cyan-300 text-[11px] px-2 py-0.5 rounded-full border border-cyan-500/30">
                {lang === 'ko' ? '해외 펀드 특화' : '海外投信特化'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {lang === 'ko'
                ? '해외 투자신탁의 총수익을「원자산(주가) 자체의 성장」과「환율(외화 강세)에 의한 상승 효과」로 정밀 분해한 포트폴리오 분석입니다.'
                : '円建てで購入した海外投資信託の利益を、「原資産（株価）自体の成長」と「円安による押し上げ効果」に分解しています。'}
            </p>
          </div>

          {/* Quick Insight Badge (% based) */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 px-3.5 py-2 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-xs">
              <span className="text-slate-400">{lang === 'ko' ? '환율 요인의 기여도: ' : '為替（円安）の寄与度: '}</span>
              <span className="font-bold text-amber-300 text-sm">
                {totalFxContributionPct}%
              </span>
              <span className="text-slate-400 text-[11px] ml-1">
                ({lang === 'ko' ? '환차익+시너지' : '為替差+相乗'})
              </span>
            </div>
          </div>
        </div>

        {/* 3 Breakdown Blocks (% based) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-700/60">
          {/* 1. Asset Growth */}
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/40">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-slate-200">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                {lang === 'ko' ? '① 원자산 성장 요인 (주가)' : '① 原資産の成長要因 (株価等)'}
              </span>
              <span className="text-[10px] text-blue-300 font-medium">
                {lang === 'ko' ? '외화 가치 상승' : '外貨価値の上昇'}
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-white">
                {assetGrowthPct}% <span className="text-xs font-normal text-slate-400">{lang === 'ko' ? '기여' : '寄与'}</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              {lang === 'ko'
                ? '환율이 매수 시점과 동일하다고 가정한 경우의 순수 주가 상승 기여율'
                : '為替が購入時から変わらなかったと仮定した場合の株価上昇益'}
            </p>
          </div>

          {/* 2. FX Gain */}
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/40">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {lang === 'ko' ? '② 환율 변동 요인 (환율 차익)' : '② 為替変動要因 (円安/円高)'}
              </span>
              <span className="text-[10px] text-amber-300 font-medium">
                {lang === 'ko' ? '환율 차이' : '為替レート差'}
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-amber-300">
                {fxGainPct}% <span className="text-xs font-normal text-slate-400">{lang === 'ko' ? '기여' : '寄与'}</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              {lang === 'ko'
                ? '매수 환율 대비 현재 환율 상승에 따른 순수 환차익 기여율'
                : '購入時レートと現在レートの差による純粋な為替損益'}
            </p>
          </div>

          {/* 3. Synergy Effect */}
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/40">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-indigo-200">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                {lang === 'ko' ? '③ 시너지 요인 (주가 × 환율)' : '③ 相乗要因 (株高 × 円安)'}
              </span>
              <span className="text-[10px] text-indigo-300 font-medium">
                {lang === 'ko' ? '곱셈 효과' : '掛け算効果'}
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-indigo-200">
                {synergyGainPct}% <span className="text-xs font-normal text-slate-400">{lang === 'ko' ? '기여' : '寄与'}</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              {lang === 'ko'
                ? '증가한 외화 수익에 환율 상승이 곱해져 발생한 복합 시너지 기여율'
                : '増えた外貨建て利益に対して円安が乗算された追加効果'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function activePlansText(lang: Language): string {
  return lang === 'ko' ? '3개 플랜 자동 가동중' : '3件自動稼働中';
}
