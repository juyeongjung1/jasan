'use client';

import React, { useState } from 'react';
import { Account, AssetHolding, AssetCategory } from '@/types';
import { HoldingAnalysis, formatCurrencyJpy, formatPercent } from '@/lib/calculations';
import { CATEGORY_CONFIG, CURRENCY_CONFIG } from '@/lib/constants';
import { Language, DICTIONARY, formatMaskedCurrency } from '@/lib/i18n';
import {
  ListFilter,
  Plus,
  Edit2,
  Trash2,
  Globe,
  Repeat,
  Info,
  Radio,
} from 'lucide-react';

interface HoldingsTableProps {
  analyzedHoldings: HoldingAnalysis[];
  accounts: Account[];
  onOpenAddModal: () => void;
  onEditHolding: (holding: AssetHolding) => void;
  onDeleteHolding: (id: string) => void;
  lang?: Language;
  isMasked?: boolean;
}

export const HoldingsTable: React.FC<HoldingsTableProps> = ({
  analyzedHoldings,
  accounts,
  onOpenAddModal,
  onEditHolding,
  onDeleteHolding,
  lang = 'ko',
  isMasked = true,
}) => {
  const t = DICTIONARY[lang];
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredHoldings = analyzedHoldings.filter((item) => {
    if (selectedAccount !== 'all' && item.holding.accountId !== selectedAccount) {
      return false;
    }
    if (selectedCategory !== 'all' && item.holding.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Table Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {t.tableTitle}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              ({filteredHoldings.length} {lang === 'ko' ? '개 종목' : '銘柄'})
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.tableSubtitle}
          </p>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Account Filter */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <ListFilter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="bg-transparent border-none text-slate-700 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">{lang === 'ko' ? '전체 계좌' : '全ての口座'}</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent border-none text-slate-700 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">{lang === 'ko' ? '전체 자산 카테고리' : '全ての資産種別'}</option>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          {/* Add Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addBtn}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold bg-slate-50/50 dark:bg-slate-800/30">
              <th className="py-3 px-3">{t.colName}</th>
              <th className="py-3 px-3">{t.colAccount}</th>
              <th className="py-3 px-3 text-right">{t.colPrincipal}</th>
              <th className="py-3 px-3 text-right">{t.colFxRate}</th>
              <th className="py-3 px-3 text-right">{t.colValNav}</th>
              <th className="py-3 px-3 text-right">{t.colGain}</th>
              <th className="py-3 px-3 text-right bg-amber-50/40 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300">
                {t.colBreakdown}
              </th>
              <th className="py-3 px-3 text-center">{t.colActions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredHoldings.map((item) => {
              const { holding, account, gainLossJpy, gainLossPercent, isForeignUnhedged, assetGrowthGainJpy, fxGainJpy, synergyGainJpy } = item;
              const catConfig = CATEGORY_CONFIG[holding.category] || CATEGORY_CONFIG.other;
              const isGainPositive = gainLossJpy >= 0;

              return (
                <tr
                  key={holding.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition group"
                >
                  {/* Name & Badges */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {holding.name}
                        </span>
                        {item.recurringPlan && item.recurringPlan.isActive && (
                          <span
                            className="inline-flex items-center gap-0.5 bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.5 rounded font-bold"
                            title={`매월 ${item.recurringPlan.dayOfMonth}일 정기 적립중`}
                          >
                            <Repeat className="w-2.5 h-2.5" />
                            {lang === 'ko' ? '적립' : '積立'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span
                          className="px-1.5 py-0.5 rounded font-medium"
                          style={{ backgroundColor: `${catConfig.color}15`, color: catConfig.color }}
                        >
                          {catConfig.label}
                        </span>
                        {holding.notes && <span className="truncate max-w-[200px]">{holding.notes}</span>}
                      </div>
                    </div>
                  </td>

                  {/* Account */}
                  <td className="py-3.5 px-3">
                    {account ? (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium"
                        style={{ backgroundColor: `${account.color}15`, color: account.color }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: account.color }} />
                        {account.name}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>

                  {/* Principal */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="font-semibold text-slate-700 dark:text-slate-300">
                      {formatMaskedCurrency(holding.purchaseAmountJpy, isMasked)}
                    </div>
                  </td>

                  {/* Purchase FX Rate */}
                  <td className="py-3.5 px-3 text-right">
                    {isForeignUnhedged ? (
                      <div>
                        <span className="text-slate-600 dark:text-slate-400 font-mono">
                          ¥{holding.purchaseFxRate.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-amber-500 font-semibold block">
                          ➔ ¥{item.currFxRate.toFixed(1)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">-</span>
                    )}
                  </td>

                  {/* Current Value & Official Price */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {formatMaskedCurrency(holding.currentValJpy, isMasked)}
                    </div>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      {holding.latestNavPrice && (
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded font-mono">
                          기준가 ¥{holding.latestNavPrice.toLocaleString()}
                        </span>
                      )}
                      {holding.dailyChangePct !== undefined && holding.dailyChangePct !== 0 && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            holding.dailyChangePct >= 0
                              ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60'
                              : 'text-rose-700 dark:text-rose-300 bg-rose-100/70 dark:bg-rose-950/60'
                          }`}
                        >
                          전일 {holding.dailyChangePct >= 0 ? '+' : ''}{holding.dailyChangePct}%
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Total Gain / Loss (率は常時明瞭に表示) */}
                  <td className="py-3.5 px-3 text-right">
                    <div
                      className={`font-bold text-xs ${
                        isGainPositive
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {formatMaskedCurrency(gainLossJpy, isMasked, true)}
                    </div>
                    <span
                      className={`text-[11px] font-bold block ${
                        isGainPositive ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {formatPercent(gainLossPercent, true)}
                    </span>
                  </td>

                  {/* FX Breakdown */}
                  <td className="py-3.5 px-3 text-right bg-amber-50/20 dark:bg-amber-950/10">
                    {isForeignUnhedged ? (
                      <div className="space-y-0.5 text-[10px]">
                        <div className="flex items-center justify-end gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                          <span>환율:</span>
                          <span>{formatMaskedCurrency(fxGainJpy + synergyGainJpy, isMasked, true)}</span>
                        </div>
                        <div className="flex items-center justify-end gap-1 text-purple-600 dark:text-purple-400 font-semibold">
                          <span>주가:</span>
                          <span>{formatMaskedCurrency(assetGrowthGainJpy, isMasked, true)}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[10px]">
                        {holding.category === 'cash_jpy' ? '무위험 현금' : '원화/엔화 자산'}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => onEditHolding(holding)}
                        className="p-1 text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                        title={lang === 'ko' ? '수정' : '編集'}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteHolding(holding.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                        title={lang === 'ko' ? '삭제' : '削除'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
