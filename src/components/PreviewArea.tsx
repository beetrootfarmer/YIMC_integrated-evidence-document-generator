import styled from 'styled-components';
import type {
  ConsentData,
  ConsentField,
  DocKey,
  DocTab,
  ImagesState,
  PrintSelection,
  SignatureRow,
  UploadFormatsState,
} from '../types';
import { DOC_CONFIGS } from '../config/docConfigs';
import { ConsentPage, SignaturePage, SingleImagePage, PhotoDocumentPage } from './documents';

const PreviewAreaContainer = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.gray200};

  @media print {
    display: block !important;
    padding: 0 !important;
    margin: 0 !important;
    background: white !important;
    overflow: visible !important;
  }
`;

const PdfContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: fit-content;

  @media print {
    display: block !important;
    gap: 0 !important;
  }
`;

const SINGLE_IMAGE_KEYS: DocKey[] = ['consentScan', 'resume', 'idCard', 'bankbook', 'signatureScan'];
const PHOTO_DOC_KEYS: DocKey[] = ['snack', 'lecture', 'material'];

interface PreviewAreaProps {
  documentOrder: DocKey[];
  activeTab: DocTab;
  printSelection: PrintSelection;
  courseName: string;
  date: string;
  time: string;
  location: string;
  consentData: ConsentData;
  handleConsentChange: (field: ConsentField, value: string) => void;
  attendeeCount: string;
  setAttendeeCount: (v: string) => void;
  extraColumnLabel: string;
  setExtraColumnLabel: (v: string) => void;
  signatureData: SignatureRow[];
  handleSigChange: (index: number, field: keyof SignatureRow, value: string) => void;
  images: ImagesState;
  uploadFormats: UploadFormatsState;
}

export const PreviewArea = ({
  documentOrder,
  activeTab,
  printSelection,
  courseName,
  date,
  time,
  location,
  consentData,
  handleConsentChange,
  attendeeCount,
  setAttendeeCount,
  extraColumnLabel,
  setExtraColumnLabel,
  signatureData,
  handleSigChange,
  images,
  uploadFormats,
}: PreviewAreaProps) => (
  <PreviewAreaContainer>
    <PdfContentWrapper>
      {documentOrder.map((key) => {
        if (DOC_CONFIGS[key].tab !== activeTab || !printSelection[key]) return null;
        const previewId = `preview-${key}`;

        if (key === 'consent') {
          return (
            <ConsentPage
              key={key}
              id={previewId}
              courseName={courseName}
              date={date}
              time={time}
              consentData={consentData}
              handleChange={handleConsentChange}
            />
          );
        }

        if (key === 'signature') {
          return (
            <SignaturePage
              key={key}
              id={previewId}
              courseName={courseName}
              date={date}
              time={time}
              attendeeCount={attendeeCount}
              setAttendeeCount={setAttendeeCount}
              extraColumnLabel={extraColumnLabel}
              setExtraColumnLabel={setExtraColumnLabel}
              signatureData={signatureData}
              handleSigChange={handleSigChange}
            />
          );
        }

        if (SINGLE_IMAGE_KEYS.includes(key)) {
          return (
            <SingleImagePage
              key={key}
              id={previewId}
              type={key as Exclude<DocKey, 'consent' | 'signature'>}
              title={DOC_CONFIGS[key].name}
              images={images}
              isFullPageOverride
            />
          );
        }

        if (PHOTO_DOC_KEYS.includes(key)) {
          // Only lecture photos uploaded as a PDF render as full-page scans;
          // snack/material always use the fixed photo grid, even from a PDF source.
          if (key === 'lecture' && uploadFormats[key] === 'pdf') {
            return (
              <SingleImagePage
                key={key}
                id={previewId}
                type={key}
                title={DOC_CONFIGS[key].name}
                images={images}
                isFullPageOverride
              />
            );
          }
          return (
            <PhotoDocumentPage
              key={key}
              id={previewId}
              type={key}
              courseName={courseName}
              date={date}
              time={time}
              location={location}
              images={images}
            />
          );
        }

        return null;
      })}
    </PdfContentWrapper>
  </PreviewAreaContainer>
);
