import { Account, AssetHolding, RecurringPlan, AssetCategory, Currency, PaymentMethod } from '@/types';

export const CATEGORY_CONFIG: Record<
  AssetCategory,
  { label: string; color: string; defaultCurrency: Currency; isForeign: boolean }
> = {
  foreign_equity_fund: {
    label: '해외 주식형 펀드 (FANG+/Z테크/S&P500 등)',
    color: '#3B82F6', // Blue
    defaultCurrency: 'USD',
    isForeign: true,
  },
  foreign_bond_fund: {
    label: '해외 채권형 펀드 (미국채 20년 등)',
    color: '#6366F1', // Indigo
    defaultCurrency: 'USD',
    isForeign: true,
  },
  domestic_equity: {
    label: '국내 주식',
    color: '#10B981', // Emerald
    defaultCurrency: 'JPY',
    isForeign: false,
  },
  domestic_fund: {
    label: '국내 펀드',
    color: '#14B8A6', // Teal
    defaultCurrency: 'JPY',
    isForeign: false,
  },
  crypto: {
    label: '가상자산 (암호화폐)',
    color: '#F59E0B', // Amber
    defaultCurrency: 'USD',
    isForeign: true,
  },
  cash_jpy: {
    label: '현금 및 대기자금 (엔화/원화)',
    color: '#6B7280', // Gray
    defaultCurrency: 'JPY',
    isForeign: false,
  },
  cash_foreign: {
    label: '외화 예수금·MMF',
    color: '#8B5CF6', // Purple
    defaultCurrency: 'USD',
    isForeign: true,
  },
  other: {
    label: '기타 자산',
    color: '#EC4899', // Pink
    defaultCurrency: 'JPY',
    isForeign: false,
  },
};

export const CURRENCY_CONFIG: Record<Currency, { label: string; symbol: string; color: string }> = {
  JPY: { label: '일본 엔 (JPY)', symbol: '¥', color: '#10B981' },
  USD: { label: '미국 달러 (USD)', symbol: '$', color: '#3B82F6' },
  EUR: { label: '유로 (EUR)', symbol: '€', color: '#8B5CF6' },
  GBP: { label: '영국 파운드 (GBP)', symbol: '£', color: '#EC4899' },
  AUD: { label: '호주 달러 (AUD)', symbol: 'A$', color: '#F59E0B' },
  OTHER: { label: '기타 통화', symbol: '¤', color: '#6B7280' },
};

export const PAYMENT_METHOD_CONFIG: Record<PaymentMethod, { label: string }> = {
  credit_card: { label: '신용카드 적립' },
  bank_transfer: { label: '급여 공제 / 계좌 자동이체' },
  balance: { label: '증권 계좌 예수금 자동 출금' },
  other: { label: '기타' },
};

export const DEFAULT_EXCHANGE_RATES = {
  USD: 153.5,
  EUR: 165.2,
  GBP: 195.8,
  AUD: 98.4,
  lastUpdated: new Date().toISOString(),
  isCustom: false,
};

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc_john_rakuten',
    name: '존의 라쿠텐 증권 계좌',
    type: 'brokerage',
    color: '#BE185D',
    notes: '특정계좌 / 구 NISA / 적립 NISA',
  },
  {
    id: 'acc_miki',
    name: '미키의 계좌 (가족)',
    type: 'brokerage',
    color: '#8B5CF6',
    notes: '가족 통합 관리 계좌',
  },
  {
    id: 'acc_john_dc',
    name: '존의 확정기여형 연금 (401k)',
    type: 'brokerage',
    color: '#059669',
    notes: '퇴직연금 플랜',
  },
  {
    id: 'acc_kids',
    name: '자녀 증권 계좌 (어린이 NISA)',
    type: 'brokerage',
    color: '#F59E0B',
    notes: '주니어 NISA 및 대기자금',
  },
];

export const INITIAL_HOLDINGS: AssetHolding[] = [
  // 1. 존의 라쿠텐 증권 계좌
  {
    id: 'hold_john_1',
    accountId: 'acc_john_rakuten',
    name: 'iShares 미국채 20년 환헤지',
    category: 'foreign_bond_fund',
    baseCurrency: 'USD',
    hasFxHedge: true,
    purchaseAmountJpy: 286600,
    purchaseFxRate: 153.5,
    currentValJpy: 199600,
    fundCode: '2621.T',
    units: 200,
    latestNavPrice: 998,
    dailyChangeVal: -6,
    dailyChangePct: -0.6,
    notes: '환헤지 채권형 (-30.35%). 적립 없음',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'hold_john_2',
    accountId: 'acc_john_rakuten',
    name: '라쿠텐 레버리지 NASDAQ-100 (레바나스)',
    category: 'foreign_equity_fund',
    baseCurrency: 'USD',
    hasFxHedge: false,
    purchaseAmountJpy: 709930,
    purchaseFxRate: 115.0,
    currentValJpy: 1923404,
    fundCode: '9I31121B',
    units: 1205518,
    latestNavPrice: 15955,
    dailyChangeVal: -78,
    dailyChangePct: -0.49,
    notes: '5년간 적립 운용. 12월까지 타 자산으로 분할 전환중 (+170.82%)',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'hold_john_3',
    accountId: 'acc_john_rakuten',
    name: 'iFreeNext FANG+ 인덱스 (적립 NISA)',
    category: 'foreign_equity_fund',
    baseCurrency: 'USD',
    hasFxHedge: false,
    purchaseAmountJpy: 615000,
    purchaseFxRate: 140.0,
    currentValJpy: 747638,
    fundCode: '04311181',
    units: 76380,
    latestNavPrice: 97884,
    dailyChangeVal: -4,
    dailyChangePct: 0,
    notes: '매월 8일 정기 적립 (+21.56%)',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'hold_john_4',
    accountId: 'acc_john_rakuten',
    name: 'iFreePlus 글로벌 트렌드 Z테크20 (존 적립)',
    category: 'foreign_equity_fund',
    baseCurrency: 'USD',
    hasFxHedge: false,
    purchaseAmountJpy: 1651500,
    purchaseFxRate: 145.0,
    currentValJpy: 1903120,
    fundCode: '0431124C',
    units: 1319412,
    latestNavPrice: 14424,
    dailyChangeVal: -170,
    dailyChangePct: -1.16,
    notes: '매월 8일 정기 적립 (+15.23%)',
    updatedAt: new Date().toISOString(),
  },

  // 2. 미키의 계좌
  {
    id: 'hold_miki_1',
    accountId: 'acc_miki',
    name: 'iFreePlus 글로벌 트렌드 Z테크20 (미키 거치)',
    category: 'foreign_equity_fund',
    baseCurrency: 'USD',
    hasFxHedge: false,
    purchaseAmountJpy: 950000,
    purchaseFxRate: 143.0,
    currentValJpy: 1120883,
    fundCode: '0431124C',
    units: 777095,
    latestNavPrice: 14424,
    dailyChangeVal: -170,
    dailyChangePct: -1.16,
    notes: '일괄 매수 보유 (+17.98%)',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'hold_miki_2',
    accountId: 'acc_miki',
    name: 'eMAXIS Slim 미국주식 (S&P 500)',
    category: 'foreign_equity_fund',
    baseCurrency: 'USD',
    hasFxHedge: false,
    purchaseAmountJpy: 66000,
    purchaseFxRate: 110.0,
    currentValJpy: 154342,
    fundCode: '03311187',
    units: 45780,
    latestNavPrice: 33714,
    dailyChangeVal: -128,
    dailyChangePct: -0.38,
    notes: '장기 보유 (+133.85%)',
    updatedAt: new Date().toISOString(),
  },

  // 3. 존의 확정기여형 연금
  {
    id: 'hold_john_dc_1',
    accountId: 'acc_john_dc',
    name: '도쿄해상 셀렉션 외국주식 인덱스 (연금)',
    category: 'foreign_equity_fund',
    baseCurrency: 'USD',
    hasFxHedge: false,
    purchaseAmountJpy: 1806666,
    purchaseFxRate: 120.0,
    currentValJpy: 3052377,
    fundCode: '49313104',
    units: 412595,
    latestNavPrice: 73980,
    dailyChangeVal: -223,
    dailyChangePct: -0.3,
    notes: '매월 29일 급여 자동 공제 적립 (+68.95%)',
    updatedAt: new Date().toISOString(),
  },

  // 4. 자녀 계좌
  {
    id: 'hold_kids_1',
    accountId: 'acc_kids',
    name: '현금 대기자금 (엔화/원화)',
    category: 'cash_jpy',
    baseCurrency: 'JPY',
    hasFxHedge: false,
    purchaseAmountJpy: 1100000,
    purchaseFxRate: 1.0,
    currentValJpy: 1100000,
    dailyChangePct: 0,
    notes: '무위험 대기자금 및 쿠션 방어자산',
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_RECURRING_PLANS: RecurringPlan[] = [
  {
    id: 'plan_1',
    holdingId: 'hold_john_3',
    accountId: 'acc_john_rakuten',
    monthlyAmountJpy: 36000,
    dayOfMonth: 8,
    paymentMethod: 'credit_card',
    isActive: true,
    notes: '매월 8일 적립 NISA 카드 적립',
  },
  {
    id: 'plan_2',
    holdingId: 'hold_john_4',
    accountId: 'acc_john_rakuten',
    monthlyAmountJpy: 64000,
    dayOfMonth: 8,
    paymentMethod: 'credit_card',
    isActive: true,
    notes: '매월 8일 카드 적립',
  },
  {
    id: 'plan_3',
    holdingId: 'hold_john_dc_1',
    accountId: 'acc_john_dc',
    monthlyAmountJpy: 15000,
    dayOfMonth: 29,
    paymentMethod: 'bank_transfer',
    isActive: true,
    notes: '매월 29일 확정기여형 연금 급여 공제',
  },
];
