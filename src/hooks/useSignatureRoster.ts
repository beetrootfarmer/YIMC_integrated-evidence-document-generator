import { useState } from 'react';
import * as XLSX from 'xlsx';
import type { SignatureRow } from '../types';

const createEmptyRows = (count: number): SignatureRow[] =>
  Array(count)
    .fill(null)
    .map(() => ({ name: '', parking: '' }));

const parseCSV = (str: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (inQuotes) {
      if (c === '"' && str[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        cell += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(cell.trim());
      cell = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && str[i + 1] === '\n') i++;
      row.push(cell.trim());
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += c;
    }
  }
  if (cell || row.length) {
    row.push(cell.trim());
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c !== ''));
};

export const useSignatureRoster = (showMessage: (msg: string) => void) => {
  const [attendeeCount, setAttendeeCount] = useState('');
  const [extraColumnLabel, setExtraColumnLabel] = useState('주차번호');
  const [signatureData, setSignatureData] = useState<SignatureRow[]>(createEmptyRows(20));

  const handleSigChange = (index: number, field: keyof SignatureRow, value: string) => {
    setSignatureData((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleExcelFile = (file: File | undefined | null) => {
    if (!file) return;
    const isCSV = file.name.toLowerCase().endsWith('.csv');
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        let json: unknown[][] = [];

        if (isCSV) {
          json = parseCSV(evt.target?.result as string);
        } else {
          const view = new Uint8Array(evt.target?.result as ArrayBuffer);
          if ((view[0] === 0x50 && view[1] === 0x4b) || (view[0] === 0xd0 && view[1] === 0xcf)) {
            const wb = XLSX.read(evt.target?.result, { type: 'array', codepage: 949 });
            json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
          }
        }

        if (!json.length) return showMessage('데이터가 없습니다.');

        const extractedNames: string[] = [];
        for (let i = 1; i < json.length; i++) {
          const row = json[i];
          if (!Array.isArray(row)) continue;
          const name = row[3];
          const status = row[14];
          if (status && String(status).includes('취소')) continue;
          if (name) {
            const clean = String(name)
              .replace(/^"|"$/g, '')
              .trim();
            if (clean && clean !== '신청자' && clean !== '성명') extractedNames.push(clean);
          }
        }

        if (extractedNames.length > 0) {
          const totalRows = Math.max(20, Math.ceil(extractedNames.length / 20) * 20);
          setSignatureData(
            Array(totalRows)
              .fill(null)
              .map((_, i) => ({ name: extractedNames[i] || '', parking: '' })),
          );
          setAttendeeCount(String(extractedNames.length));
          showMessage(`총 ${extractedNames.length}명의 명단이 입력되었습니다.`);
        } else {
          showMessage('유효한 이름 데이터를 찾을 수 없습니다.');
        }
      } catch {
        showMessage('오류가 발생했습니다.');
      }
    };

    if (isCSV) reader.readAsText(file, 'utf-8');
    else reader.readAsArrayBuffer(file);
  };

  return {
    attendeeCount,
    setAttendeeCount,
    extraColumnLabel,
    setExtraColumnLabel,
    signatureData, 
    setSignatureData,
    handleSigChange,
    handleExcelFile,
  };
};
