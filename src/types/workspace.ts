import type { DocKey, UploadDocKey } from './document';
import type { ConsentData, SignatureRow } from './formData';

export type UploadFormat = 'pdf' | 'image';

export type ImagesState = Record<UploadDocKey, string[]>;
export type UploadFormatsState = Partial<Record<UploadDocKey, UploadFormat>>;
export type PrintSelection = Record<DocKey, boolean>;

export interface WorkspaceData {
  courseName: string;
  date: string;
  time: string;
  location: string;
  consentData: ConsentData;
  attendeeCount: string;
  extraColumnLabel?: string;
  signatureData: SignatureRow[];
  documentOrder: DocKey[];
  printSelection: PrintSelection;
  images: ImagesState;
}
