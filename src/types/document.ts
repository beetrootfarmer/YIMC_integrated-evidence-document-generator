export type DocTab = 'before' | 'after';

export type DocKey =
  | 'consent'
  | 'signature'
  | 'consentScan'
  | 'resume'
  | 'idCard'
  | 'bankbook'
  | 'signatureScan'
  | 'snack'
  | 'lecture'
  | 'material';

// Doc keys that support image/PDF uploads (have a `max` count).
export type UploadDocKey = Exclude<DocKey, 'consent' | 'signature'>;

export interface DocConfig {
  name: string;
  tab: DocTab;
  needsBasicInfo?: boolean;
  needsExcel?: boolean;
  max?: number;
}

export type DocConfigMap = Record<DocKey, DocConfig>;
