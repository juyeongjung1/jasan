import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface USStockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  relatedFunds: string[];
}

export interface MarketInsightSummary {
  updatedAt: string;
  usMarketSummary: {
    nasdaqChangePct: number;
    sp500ChangePct: number;
    us10yYield: number;
    us10yYieldChange: number;
    usdjpyChange: number;
  };
  keyDrivers: {
    title: string;
    impact: 'positive' | 'negative' | 'neutral';
    category: 'earnings' | 'macro' | 'fx' | 'tech';
    description: string;
    affectedFunds: string[];
  }[];
  majorStocks: USStockData[];
}

export async function GET() {
  try {
    const majorStocks: USStockData[] = [
      {
        symbol: 'NVDA',
        name: '엔비디아 (NVIDIA)',
        price: 128.5,
        change: -2.3,
        changePct: -1.76,
        relatedFunds: ['FANG+', 'Z테크20', '레바나스', 'S&P500'],
      },
      {
        symbol: 'AAPL',
        name: '애플 (Apple)',
        price: 224.8,
        change: 1.1,
        changePct: 0.49,
        relatedFunds: ['FANG+', '레바나스', 'S&P500', '외국주식인덱스'],
      },
      {
        symbol: 'MSFT',
        name: '마이크로소프트 (Microsoft)',
        price: 442.1,
        change: -1.8,
        changePct: -0.41,
        relatedFunds: ['FANG+', 'Z테크20', '레바나스', 'S&P500', '외국주식인덱스'],
      },
      {
        symbol: 'GOOGL',
        name: '알파벳 (Google)',
        price: 178.2,
        change: -0.9,
        changePct: -0.5,
        relatedFunds: ['FANG+', 'Z테크20', '레바나스', 'S&P500'],
      },
      {
        symbol: 'AMZN',
        name: '아마존 (Amazon)',
        price: 182.4,
        change: 0.6,
        changePct: 0.33,
        relatedFunds: ['FANG+', 'Z테크20', '레바나스', 'S&P500'],
      },
      {
        symbol: 'META',
        name: '메타 (Meta)',
        price: 528.0,
        change: -4.5,
        changePct: -0.85,
        relatedFunds: ['FANG+', 'Z테크20', '레바나스', 'S&P500'],
      },
      {
        symbol: 'TSLA',
        name: '테슬라 (Tesla)',
        price: 215.3,
        change: 3.2,
        changePct: 1.51,
        relatedFunds: ['FANG+', '레바나스', 'S&P500'],
      },
      {
        symbol: 'AVGO',
        name: '브로드컴 (Broadcom)',
        price: 165.2,
        change: -2.1,
        changePct: -1.26,
        relatedFunds: ['FANG+', 'Z테크20', '레바나스', 'S&P500'],
      },
    ];

    const marketInsights: MarketInsightSummary = {
      updatedAt: new Date().toISOString(),
      usMarketSummary: {
        nasdaqChangePct: -0.45,
        sp500ChangePct: -0.22,
        us10yYield: 3.88,
        us10yYieldChange: -0.03,
        usdjpyChange: -0.35,
      },
      keyDrivers: [
        {
          title: '미국 반도체·AI 관련주 단기 차익 실현 매물 출회',
          impact: 'negative',
          category: 'tech',
          description:
            '전날 밤 미국 시장에서 엔비디아(-1.76%)와 브로드컴(-1.26%) 등 반도체 주도주가 조정을 받으며, 익일 반영되는 FANG+ 및 Z테크20의 기준가 하락 요인으로 작용했습니다.',
          affectedFunds: ['iFreeNext FANG+', 'Z테크20', '레바나스'],
        },
        {
          title: '엔/달러 환율의 소폭 강세(환율 요인)',
          impact: 'negative',
          category: 'fx',
          description:
            '환율이 전일 대비 소폭 하락(엔고/원고)함에 따라, 환헤지가 없는 해외 주식형 펀드에 약 -0.2%~-0.3%의 기준가 하락 압력이 발생했습니다.',
          affectedFunds: ['iFreeNext FANG+', 'Z테크20', 'S&P500', '외국주식인덱스'],
        },
        {
          title: '애플·테슬라 및 가치주의 견조한 방어 효과',
          impact: 'positive',
          category: 'tech',
          description:
            '반도체가 조정을 받는 동안 테슬라(+1.51%), 애플(+0.49%) 등 대형 우량주가 하방을 지지하며 S&P500 및 광범위 인덱스의 낙폭을 제한하는 쿠션 역할을 수행했습니다.',
          affectedFunds: ['eMAXIS Slim S&P500', '도쿄해상 외국주식'],
        },
        {
          title: '미국 10년물 국채 금리 안정에 따른 채권 자산 방어',
          impact: 'positive',
          category: 'macro',
          description:
            '미국 10년물 국채 금리가 3.88%로 안정세를 보이며 미국채 20년물 펀드가 주식 리스크에 대한 훌륭한 분산 방어 효과를 발휘했습니다.',
          affectedFunds: ['iShares 미국채 20년 환헤지'],
        },
      ],
      majorStocks,
    };

    return NextResponse.json({
      success: true,
      insights: marketInsights,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch market insights' },
      { status: 500 }
    );
  }
}
