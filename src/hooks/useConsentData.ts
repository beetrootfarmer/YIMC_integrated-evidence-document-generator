import { useEffect, useState } from 'react';
import type { ConsentData, ConsentField } from '../types';

const DEFAULT_CONSENT_DATA: ConsentData = {
  totalHours: '3',
  bankName: 'SC제일은행',
  accountNum: '632-20-150364',
  accountOwner: '박 세 인',
  totalAmount: '310,000',
  netAmount: '282,720',
  signYear: '2026',
  signMonth: '5',
  signDay: '8',
  ssn: '',
  address: '수원시 권선구 권선로 694번길 25',
  contact: '010-3477-2932',
  affiliation: '아이디어플 대표',
  name: '박 세 인',
};

export const useConsentData = (date: string, time: string) => {
  const [consentData, setConsentData] = useState<ConsentData>(DEFAULT_CONSENT_DATA);

  // Keep total hours / signing date in sync with the basic-info date & time fields.
  useEffect(() => {
    const timeMatch = time.match(/(\d{1,2}):(\d{2})\s*[~-]\s*(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      const diff =
        parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 60 - (parseInt(timeMatch[1]) + parseInt(timeMatch[2]) / 60);
      setConsentData((prev) => ({
        ...prev,
        totalHours: Number.isInteger(diff) ? diff.toString() : diff.toFixed(1),
      }));
    }
    const dateMatch = date.match(/(\d{4})[^\d]+(\d{1,2})[^\d]+(\d{1,2})/);
    if (dateMatch) {
      setConsentData((prev) => ({
        ...prev,
        signYear: dateMatch[1],
        signMonth: dateMatch[2].replace(/^0+/, ''),
        signDay: dateMatch[3].replace(/^0+/, ''),
      }));
    }
  }, [time, date]);

  const handleConsentChange = (field: ConsentField, value: string) => {
    setConsentData((prev) => {
      const updated: ConsentData = { ...prev, [field]: value };
      // Gross amount changes drive the auto-computed net (after 8.8% withholding) amount.
      if (field === 'totalAmount') {
        const gross = Number(value.replace(/,/g, '')) || 0;
        const net = Math.ceil(gross * 0.912);
        updated.netAmount = net.toLocaleString();
      }
      return updated;
    });
  };

  return { consentData, setConsentData, handleConsentChange };
};
