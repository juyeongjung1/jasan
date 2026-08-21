'use client';

import React, { useState } from 'react';
import { Account, AssetHolding, RecurringPlan, AccumulationLog } from '@/types';
import { Language, formatMaskedCurrency, translateHoldingName, translateAccountName } from '@/lib/i18n';
import {
  Calendar,
  Plus,
  CreditCard,
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  History,
  Info,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface RecurringPlanSectionProps {
  recurringPlans: RecurringPlan[];
  holdings: AssetHolding[];
  accounts: Account[];
  accumulationLogs: AccumulationLog[];
  onOpenAddModal: () => void;
  onEditPlan: (plan: RecurringPlan) => void;
  onToggleActive: (id: string) => void;
  onDeletePlan: (id: string) => void;
  onExecuteManual: (planId: string) => void;
  currentTotalValJpy: number;
  lang?: Language;
}

export const RecurringPlanSection: React.FC<RecurringPlanSectionProps> = ({
  recurringPlans,
  holdings,
  accounts,
  accumulationLogs,
  onOpenAddModal,
  onEditPlan,
  onToggleActive,
  onDeletePlan,
  onExecuteManual,
  currentTotalValJpy,
  lang = 'ko',
}) => {
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(5);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const activePlans = recurringPlans.filter((p) => p.isActive);
  const monthlyTotal = activePlans.reduce((sum, p) => sum + p.monthlyAmountJpy, 0);

  const today = new Date();
  const currentDay = today.getDate();
  const sortedDays = activePlans
    .map((p) => p.dayOfMonth)
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => a - b);

  let nextDay = sortedDays.find((d) => d >= currentDay);
  if (!nextDay && sortedDays.length > 0) {
    nextDay = sortedDays[0];
  }

  // 10年シミュレーションデータ（指数ベース・成長倍率 %）
  const simulationYears = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const monthlyRate = expectedReturnRate / 100 / 12;

  const simulationData = simulationYears.map((year) => {
    const totalMonths = year * 12;
    // 基準100からの成長倍率指数
    let futureValIndex = 100;
    for (let m = 1; m <= totalMonths; m++) {
      futureValIndex = (futureValIndex + 1.2) * (1 + monthlyRate);
    }
    const principalIndex = 100 + 1.2 * totalMonths;

    return {
      year: lang === 'ko' ? `${year}년 후` : `${year}年後`,
      futureValIndex: Math.round(futureValIndex),
      principalIndex: Math.round(principalIndex),
      growthPercent: Math.round(((futureValIndex - 100) / 100) * 100),
    };
  });

  const getHoldingName = (holdingId: string) => {
    const h = holdings.find((item) => item.id === holdingId);
    return h ? translateHoldingName(h.name, lang) : holdingId;
  };

  const getAccountName = (accountId: string) => {
    const a = accounts.find((item) => item.id === accountId);
    return a ? translateAccountName(a.name, lang) : accountId;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {lang === 'ko' ? '정기 적립 플랜 & 미래 복리 시뮬레이션' : '定期積立投資プラン & 将来資産シミュレーション'}
              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-0.5 rounded-full font-bold">
                {activePlans.length} {lang === 'ko' ? '개 플랜 가동중' : '件稼働中'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'ko'
                ? '매월 지정일마다 포트폴리오에 자동 가산 반영되는 적립 엔진'
                : '指定日を迎えると自動で資産へ加算反映されます'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {accumulationLogs.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition"
            >
              <History className="w-3.5 h-3.5" />
              <span>{lang === 'ko' ? `적립 이력 (${accumulationLogs.length})` : `積立履歴 (${accumulationLogs.length})`}</span>
            </button>
          )}

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'ko' ? '적립 플랜 추가' : '積立設定を追加'}</span>
          </button>
        </div>
      </div>

      {/* Auto-accumulation Info Banner */}
      <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/80 dark:border-emerald-900/40 flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-300">
        <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong>⚡ {lang === 'ko' ? '자동 적립 반영 기능 활성화' : '自動積立反映機能が有効です'}</strong>
          <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300/80 mt-0.5 leading-relaxed">
            {lang === 'ko'
              ? '매월 지정일(8일 등)이 지나면 자동으로 원금과 평가액에 적립이 가산 반영됩니다.'
              : '毎月の積立日を過ぎた状態でサイトを開くと、自動で元本と評価額に積立額が加算反映されます。'}
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {lang === 'ko' ? '가동 중인 적립 플랜' : '稼働中の積立設定'}
          </span>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {activePlans.length} {lang === 'ko' ? '건' : '件'}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 block font-semibold">
            {lang === 'ko' ? '모두 정상 자동 실행중' : '全プラン自動実行中'}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {lang === 'ko' ? '다음 자동 적립 예정일' : '次回積立予定日'}
          </span>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {nextDay ? (lang === 'ko' ? `매월 ${nextDay}일` : `毎月 ${nextDay}日`) : '-'}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {lang === 'ko' ? '휴일인 경우 익영업일 반영' : '休日の場合は翌営業日'}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {lang === 'ko' ? '적립 포트폴리오 비중' : '積立ポートフォリオ比率'}
          </span>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            FANG+ & Z테크20
          </div>
          <span className="text-[11px] text-indigo-500 font-semibold mt-0.5 block">
            {lang === 'ko' ? '미국 하이테크 인덱스 집중 분산' : '米国ハイテク集中積立'}
          </span>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {recurringPlans.map((plan) => {
          const holding = holdings.find((h) => h.id === plan.holdingId);
          return (
            <div
              key={plan.id}
              className={`p-4 rounded-xl border transition ${
                plan.isActive
                  ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                  : 'bg-slate-100/50 dark:bg-slate-900/50 border-slate-200/50 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">
                    {getHoldingName(plan.holdingId)}
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>{getAccountName(plan.accountId)}</span>
                    <span>•</span>
                    <span>{lang === 'ko' ? `매월 ${plan.dayOfMonth}일` : `毎月${plan.dayOfMonth}日`}</span>
                  </div>
                </div>

                <button
                  onClick={() => onToggleActive(plan.id)}
                  className={`p-1 rounded-lg ${
                    plan.isActive
                      ? 'text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950'
                      : 'text-slate-400 hover:bg-slate-200'
                  }`}
                  title={plan.isActive ? (lang === 'ko' ? '일시 정지' : '一時停止') : (lang === 'ko' ? '재개' : '再開')}
                >
                  {plan.isActive ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {plan.isActive ? (lang === 'ko' ? '● 자동 적립 활성' : '● 自動積立中') : (lang === 'ko' ? '○ 일시 정지' : '○ 停止中')}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onExecuteManual(plan.id)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{lang === 'ko' ? '수동 즉시 반영' : '今すぐ反映'}</span>
                  </button>
                  <button
                    onClick={() => onEditPlan(plan)}
                    className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium transition"
                  >
                    {lang === 'ko' ? '수정' : '編集'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 10-Year Compound Simulation (Percentages / Index Growth) */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {lang === 'ko' ? '10년 복리 자산 성장 시뮬레이션' : '10年間の複利資産成長シミュレーション'}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500">{lang === 'ko' ? '상정 연수익률:' : '想定年利:'}</span>
            {[3, 5, 7, 10, 15].map((rate) => (
              <button
                key={rate}
                onClick={() => setExpectedReturnRate(rate)}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition ${
                  expectedReturnRate === rate
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={simulationData}>
              <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(v) => `+${v - 100}%`} />
              <Tooltip
                formatter={(val: any, name: any) => {
                  if (name === 'futureValIndex') return [`+${val - 100}% 성장`, lang === 'ko' ? '자산 성장률' : '評価額成長'];
                  return [`+${val - 100}% 적립`, lang === 'ko' ? '투자 원금' : '投資元本'];
                }}
              />
              <Area
                type="monotone"
                dataKey="futureValIndex"
                stroke="#10B981"
                strokeWidth={3}
                fill="#10B981"
                fillOpacity={0.15}
                name="futureValIndex"
              />
              <Area
                type="monotone"
                dataKey="principalIndex"
                stroke="#64748B"
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="#64748B"
                fillOpacity={0.05}
                name="principalIndex"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
