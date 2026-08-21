'use client';

import React from 'react';
import { AssetHolding, HoldingHistoryPoint } from '@/types';
import { HoldingPerformanceHistory } from '@/components/HoldingPerformanceHistory';
import { Language } from '@/lib/i18n';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  holdings: AssetHolding[];
  historyPoints: HoldingHistoryPoint[];
  lang?: Language;
  isMasked?: boolean;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  holdings,
  historyPoints,
  lang = 'ko',
  isMasked = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-6xl my-auto">
        <HoldingPerformanceHistory
          holdings={holdings}
          historyPoints={historyPoints}
          isModal={true}
          onCloseModal={onClose}
          lang={lang}
          isMasked={isMasked}
        />
      </div>
    </div>
  );
};
