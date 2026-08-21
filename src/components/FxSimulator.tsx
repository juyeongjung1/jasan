'use client';

import React from 'react';
import { Language } from '@/lib/i18n';
import { formatPercent } from '@/lib/calculations';
import { Sliders, RotateCcw, TrendingUp, TrendingDown, Info, Zap } from 'lucide-react';

interface FxSimulatorProps {
  currentUsdRate: number;
  simulatedUsdRate: number;
  onRateChange: (rate: number) => void;
  onResetRate: () => void;
  totalCurrentValJpy: number;
  simulatedTotalValJpy: number;
  simulatedDiffJpy: number;
  lang?: Language;
}

export const FxSimulator: React.FC<FxSimulatorProps> = ({
  currentUsdRate,
  simulatedUsdRate,
  onRateChange,
  onResetRate,
  totalCurrentValJpy,
  simulatedTotalValJpy,
  simulatedDiffJpy,
  lang = 'ko',
}) => {
  const fxChangePercent = ((simulatedUsdRate - currentUsdRate) / currentUsdRate) * 100;
  const portfolioChangePercent =
    totalCurrentValJpy > 0 ? (simulatedDiffJpy / totalCurrentValJpy) * 100 : 0;
  const isPositive = simulatedDiffJpy >= 0;

  // プリセットレート
  const presets = [
    { label: lang === 'ko' ? '초강세 엔화 (110엔)' : '超円高 (110円)', rate: 110 },
    { label: lang === 'ko' ? '강세 엔화 (125엔)' : '円高 (125円)', rate: 125 },
    { label: lang === 'ko' ? '스탠다드 (135엔)' : '基準 (135円)', rate: 135 },
    { label: lang === 'ko' ? '현재 환율 (153.5엔)' : '現在値 (153.5円)', rate: currentUsdRate },
    { label: lang === 'ko' ? '엔저 지속 (160엔)' : '円安 (160円)', rate: 160 },
    { label: lang === 'ko' ? '초약세 엔저 (170엔)' : '超円安 (170円)', rate: 170 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-amber-600 dark:text-amber-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {lang === 'ko' ? '환율 변동 시뮬레이터' : 'リアルタイム為替変動シミュレーター'}
              <span className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                USD/JPY Sensitivity
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'ko'
                ? '"만약 1달러 = XX 엔이 된다면?" 해외 자산의 가치 민감도 실시간 추정'
                : '「もし1ドル＝〇〇円になったら？」海外資産評価への影響を即時試算'}
            </p>
          </div>
        </div>

        <button
          onClick={onResetRate}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{lang === 'ko' ? '현재 환율로 리셋' : '現在値にリセット'}</span>
        </button>
      </div>

      {/* Main Simulator Control & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-1 items-center">
        {/* Slider & Presets */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {lang === 'ko' ? '가정 환율 (USD/JPY):' : '想定為替レート (USD/JPY):'}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                ¥{simulatedUsdRate.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">/ USD</span>
              <span
                className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded ${
                  fxChangePercent >= 0
                    ? 'text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-300'
                    : 'text-blue-700 bg-blue-100 dark:bg-blue-950 dark:text-blue-300'
                }`}
              >
                {fxChangePercent >= 0 ? '+' : ''}
                {fxChangePercent.toFixed(1)}% ({lang === 'ko' ? '환율 변동' : '為替変動'})
              </span>
            </div>
          </div>

          {/* Slider Bar */}
          <div className="space-y-1.5">
            <input
              type="range"
              min="100"
              max="180"
              step="0.5"
              value={simulatedUsdRate}
              onChange={(e) => onRateChange(parseFloat(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>¥100 ({lang === 'ko' ? '초강세 엔화' : '超円高'})</span>
              <span>¥130</span>
              <span className="text-blue-500 font-bold">
                {lang === 'ko' ? '현재 환율' : '現在'}: ¥{currentUsdRate.toFixed(1)}
              </span>
              <span>¥160</span>
              <span>¥180 ({lang === 'ko' ? '초약세 엔화' : '超円安'})</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => onRateChange(p.rate)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  Math.abs(simulatedUsdRate - p.rate) < 0.1
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sensitivity Simulation Result (Percentages Only - No Raw JPY Amounts!) */}
        <div className="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {lang === 'ko' ? '시뮬레이션 결과' : 'シミュレーション結果'}
            </span>
            <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
              {lang === 'ko' ? '자산 민감도' : '資産感応度'}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">
              {lang === 'ko' ? '환율에 따른 포트폴리오 변동률' : '為替変動に伴う資産変動率'}
            </span>
            <div
              className={`text-2xl font-black mt-1 flex items-center gap-1 ${
                isPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isPositive ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
              <span>{formatPercent(portfolioChangePercent, true)}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>{lang === 'ko' ? '포트폴리오 환노출도:' : 'ポートフォリオ為替感応度:'}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">약 87.3% (달러 자산)</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              {lang === 'ko'
                ? '※ 엔화가 1엔 변동할 때마다 전체 자산은 약 0.57%씩 증감합니다.'
                : '※ 1円の為替変動で全体資産が約0.57%増減します。'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
