import type { DocConfigMap, UploadDocKey } from '../types';

export const DOC_CONFIGS: DocConfigMap = {
  consent: { name: '계좌이체 승낙서', tab: 'before', needsBasicInfo: true },
  signature: { name: '서명부', tab: 'before', needsBasicInfo: true, needsExcel: true },
  consentScan: { name: '계좌이체 승낙서 스캔본', tab: 'after', max: 1 },
  resume: { name: '강사이력서', tab: 'after', max: 1 },
  idCard: { name: '신분증', tab: 'after', max: 1 },
  bankbook: { name: '통장사본', tab: 'after', max: 1 },
  signatureScan: { name: '서명부 스캔본', tab: 'after', max: 10 },
  snack: { name: '다과 증빙', tab: 'after', max: 2, needsBasicInfo: true },
  lecture: { name: '강의 사진 증빙', tab: 'after', max: 4, needsBasicInfo: true },
  material: { name: '강의 자료 증빙', tab: 'after', max: 4, needsBasicInfo: true },
};

export const DOC_KEYS = Object.keys(DOC_CONFIGS) as (keyof typeof DOC_CONFIGS)[];

// Doc keys that support image/PDF uploads (have a `max` defined).
export const UPLOAD_DOC_KEYS = DOC_KEYS.filter((key) => DOC_CONFIGS[key].max !== undefined) as UploadDocKey[];

export const PDF_SUPPORTED_KEYS: (keyof typeof DOC_CONFIGS)[] = [
  'lecture',
  'material',
  'resume',
  'idCard',
  'bankbook',
  'consentScan',
  'signatureScan',
];

export const FULL_PAGE_OVERRIDE_KEYS: (keyof typeof DOC_CONFIGS)[] = ['consentScan', 'signatureScan'];
