export interface ConsentData {
  totalHours: string;
  bankName: string;
  accountNum: string;
  accountOwner: string;
  totalAmount: string;
  netAmount: string;
  signYear: string;
  signMonth: string;
  signDay: string;
  ssn: string;
  address: string;
  contact: string;
  affiliation: string;
  name: string;
}

export type ConsentField = keyof ConsentData;

export interface SignatureRow {
  name: string;
  parking: string;
}
