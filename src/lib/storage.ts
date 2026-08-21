import { Account, AssetHolding, RecurringPlan, AccumulationLog, HoldingHistoryPoint, ExchangeRates } from '@/types';
import { DEFAULT_EXCHANGE_RATES, INITIAL_ACCOUNTS, INITIAL_HOLDINGS, INITIAL_RECURRING_PLANS } from './constants';
import { generateInitialHoldingHistories } from './historyGenerator';

const STORAGE_KEYS = {
  ACCOUNTS: 'jasan_accounts_v1',
  HOLDINGS: 'jasan_holdings_v1',
  RECURRING: 'jasan_recurring_v1',
  LOGS: 'jasan_accum_logs_v1',
  HISTORY: 'jasan_history_points_v1',
  RATES: 'jasan_rates_v1',
};

export interface ExportData {
  version: string;
  exportedAt: string;
  accounts: Account[];
  holdings: AssetHolding[];
  recurringPlans: RecurringPlan[];
  accumulationLogs?: AccumulationLog[];
  historyPoints?: HoldingHistoryPoint[];
  exchangeRates: ExchangeRates;
}

export function loadSavedAccounts(): Account[] {
  if (typeof window === 'undefined') return INITIAL_ACCOUNTS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (!data) return INITIAL_ACCOUNTS;
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load accounts:', e);
    return INITIAL_ACCOUNTS;
  }
}

export function saveAccounts(accounts: Account[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save accounts:', e);
  }
}

export function loadSavedHoldings(): AssetHolding[] {
  if (typeof window === 'undefined') return INITIAL_HOLDINGS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HOLDINGS);
    if (!data) return INITIAL_HOLDINGS;
    const parsed: AssetHolding[] = JSON.parse(data);
    
    return parsed.map((p) => {
      const init = INITIAL_HOLDINGS.find((h) => h.id === p.id);
      if (init) {
        return {
          ...p,
          fundCode: p.fundCode || init.fundCode,
          units: p.units || init.units,
          latestNavPrice: p.latestNavPrice || init.latestNavPrice,
          dailyChangePct: p.dailyChangePct !== undefined ? p.dailyChangePct : init.dailyChangePct,
        };
      }
      return p;
    });
  } catch (e) {
    console.error('Failed to load holdings:', e);
    return INITIAL_HOLDINGS;
  }
}

export function saveHoldings(holdings: AssetHolding[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.HOLDINGS, JSON.stringify(holdings));
  } catch (e) {
    console.error('Failed to save holdings:', e);
  }
}

export function loadSavedRecurringPlans(): RecurringPlan[] {
  if (typeof window === 'undefined') return INITIAL_RECURRING_PLANS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECURRING);
    if (!data) return INITIAL_RECURRING_PLANS;
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load recurring plans:', e);
    return INITIAL_RECURRING_PLANS;
  }
}

export function saveRecurringPlans(plans: RecurringPlan[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(plans));
  } catch (e) {
    console.error('Failed to save recurring plans:', e);
  }
}

export function loadSavedAccumulationLogs(): AccumulationLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load accumulation logs:', e);
    return [];
  }
}

export function saveAccumulationLogs(logs: AccumulationLog[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save accumulation logs:', e);
  }
}

export function loadSavedHistoryPoints(holdings: AssetHolding[] = INITIAL_HOLDINGS): HoldingHistoryPoint[] {
  if (typeof window === 'undefined') return generateInitialHoldingHistories(holdings);
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!data) return generateInitialHoldingHistories(holdings);
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load history points:', e);
    return generateInitialHoldingHistories(holdings);
  }
}

export function saveHistoryPoints(points: HoldingHistoryPoint[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(points));
  } catch (e) {
    console.error('Failed to save history points:', e);
  }
}

export function loadSavedRates(): ExchangeRates {
  if (typeof window === 'undefined') return DEFAULT_EXCHANGE_RATES;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RATES);
    if (!data) return DEFAULT_EXCHANGE_RATES;
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load rates:', e);
    return DEFAULT_EXCHANGE_RATES;
  }
}

export function saveRates(rates: ExchangeRates): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.RATES, JSON.stringify(rates));
  } catch (e) {
    console.error('Failed to save rates:', e);
  }
}

export function exportToJson(
  accounts: Account[],
  holdings: AssetHolding[],
  recurringPlans: RecurringPlan[],
  exchangeRates: ExchangeRates,
  accumulationLogs?: AccumulationLog[],
  historyPoints?: HoldingHistoryPoint[]
): void {
  const exportData: ExportData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    accounts,
    holdings,
    recurringPlans,
    accumulationLogs,
    historyPoints,
    exchangeRates,
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jasan_portfolio_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToCsv(holdings: AssetHolding[], accounts: Account[]): void {
  const headers = [
    '종목명',
    '계좌명',
    '카테고리',
    '통화',
    '환헤지',
    '투자원금',
    '매수환율',
    '현재평가액',
    '공시기준가',
    '전일비(%)',
    '메모',
  ];

  const rows = holdings.map((h) => {
    const acc = accounts.find((a) => a.id === h.accountId);
    return [
      `"${h.name.replace(/"/g, '""')}"`,
      `"${(acc?.name || '').replace(/"/g, '""')}"`,
      `"${h.category}"`,
      h.baseCurrency,
      h.hasFxHedge ? '헤지있음' : '헤지없음',
      h.purchaseAmountJpy,
      h.purchaseFxRate,
      h.currentValJpy,
      h.latestNavPrice || '-',
      h.dailyChangePct !== undefined ? `${h.dailyChangePct}%` : '-',
      `"${(h.notes || '').replace(/"/g, '""')}"`,
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  link.href = url;
  link.download = `jasan_holdings_${dateStr}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
