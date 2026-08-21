'use client';

import React from 'react';
import { CurrencyExposure, CategoryAllocation, AccountAllocation } from '@/types';
import { Language, DICTIONARY } from '@/lib/i18n';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieIcon, Globe, Layers, Building } from 'lucide-react';

interface AllocationsChartProps {
  currencyExposures: CurrencyExposure[];
  categoryAllocations: CategoryAllocation[];
  accountAllocations: AccountAllocation[];
  lang?: Language;
}

export const AllocationsChart: React.FC<AllocationsChartProps> = ({
  currencyExposures,
  categoryAllocations,
  accountAllocations,
  lang = 'ko',
}) => {
  const [activeTab, setActiveTab] = React.useState<'currency' | 'category' | 'account'>('currency');

  const getData = () => {
    switch (activeTab) {
      case 'currency':
        return currencyExposures.map((item) => ({
          name: lang === 'ko' ? (item.currency === 'USD' ? '미국 달러 (USD)' : '일본 엔 (JPY)') : item.label,
          value: item.percentage,
          color: item.color,
          percentage: item.percentage,
        }));
      case 'category':
        return categoryAllocations.map((item) => ({
          name: lang === 'ko' ? getCategoryKo(item.category) : item.label,
          value: item.percentage,
          color: item.color,
          percentage: item.percentage,
        }));
      case 'account':
        return accountAllocations.map((item) => ({
          name: item.name,
          value: item.percentage,
          color: item.color,
          percentage: item.percentage,
        }));
    }
  };

  const getCategoryKo = (category: string) => {
    switch (category) {
      case 'foreign_equity_fund': return '해외 주식형 펀드';
      case 'foreign_bond_fund': return '해외 채권형 펀드';
      case 'domestic_equity': return '국내 주식';
      case 'domestic_fund': return '국내 펀드';
      case 'crypto': return '가상자산';
      case 'cash_jpy': return '현금 (엔화/원화)';
      case 'cash_foreign': return '외화 예수금';
      default: return '기타 자산';
    }
  };

  const data = getData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl border border-slate-700 text-xs">
          <div className="font-bold">{d.name}</div>
          <div className="text-blue-400 font-extrabold text-sm mt-0.5">
            {d.percentage.toFixed(1)}% (비중)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400">
            <PieIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {lang === 'ko' ? '포트폴리오 자산 배분 비중' : 'ポートフォリオ資産配分比率'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'ko' ? '통화별 실질 노출도, 자산 유형 및 계좌별 구성 비율' : '実質通貨比率、資産種別、口座別の構成割合'}
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-0.5 text-xs">
          <button
            onClick={() => setActiveTab('currency')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'currency'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'ko' ? '통화별 노출' : '通貨別'}</span>
          </button>
          <button
            onClick={() => setActiveTab('category')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'category'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'ko' ? '자산 유형별' : '資産種別'}</span>
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'account'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>{lang === 'ko' ? '계좌별' : '口座別'}</span>
          </button>
        </div>
      </div>

      {/* Chart & Legend Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
        {/* Donut Chart */}
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown List (Percentages Only - No Raw JPY Amounts!) */}
        <div className="space-y-3">
          {activeTab === 'currency' && (
            <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-xl text-xs text-amber-900 dark:text-amber-300">
              <span className="font-bold">💡 {lang === 'ko' ? '실질 통화 노출이란?' : '実質通貨エクスポージャーとは？'}</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {lang === 'ko'
                  ? '엔화로 매수한 펀드(S&P 500, FANG+ 등)라도 원자산이 미국 주식이면 실질적으로 달러 자산에 해당합니다. 포트폴리오의 실질적인 환율 리스크 노출도를 보여줍니다.'
                  : '円建て購入の投資信託でも原資産が米国株であれば実質ドル資産です。'}
              </p>
            </div>
          )}

          <div className="space-y-2">
            {data.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
