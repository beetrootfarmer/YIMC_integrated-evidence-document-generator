import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import styled from 'styled-components';
import type { DocConfig, ImagesState, UploadDocKey, UploadFormat } from '../types';
import { PDF_SUPPORTED_KEYS, FULL_PAGE_OVERRIDE_KEYS } from '../config/docConfigs';
import { UploadIcon, XIcon } from './icons';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: border-color 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.blue300};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.gray700};
`;

const PdfBadge = styled.span`
  color: ${({ theme }) => theme.colors.blue500};
  font-size: 0.75rem;
  margin-left: 0.25rem;
`;

const CountRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CountText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray500};
`;

const ClearButton = styled.button`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.red500};
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  background: ${({ theme }) => theme.colors.red50};
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.red700};
    background: ${({ theme }) => theme.colors.red100};
  }
`;

const DropZone = styled.div<{ $isDragOver: boolean }>`
  width: 100%;
  border: 2px dashed ${({ theme, $isDragOver }) => ($isDragOver ? theme.colors.blue500 : theme.colors.gray300)};
  background: ${({ theme, $isDragOver }) => ($isDragOver ? theme.colors.blue50 : 'transparent')};
  border-radius: 0.5rem;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s;
  margin-bottom: 0.5rem;

  &:hover {
    background: ${({ theme, $isDragOver }) => ($isDragOver ? theme.colors.blue50 : theme.colors.gray50)};
  }
`;

const HintText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
`;

const ImageGrid = styled.div<{ $twoColumns: boolean }>`
  display: grid;
  grid-template-columns: ${({ $twoColumns }) => ($twoColumns ? 'repeat(2, 1fr)' : '1fr')};
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ImageThumb = styled.div<{ $aspectRatio: string }>`
  position: relative;
  background: ${({ theme }) => theme.colors.gray200};
  border-radius: 0.25rem;
  overflow: hidden;
  aspect-ratio: ${({ $aspectRatio }) => $aspectRatio};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: ${({ theme }) => theme.colors.red500};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 9999px;
  padding: 0.25rem;
  display: flex;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.red600};
  }
`;

interface UploadSectionProps {
  type: UploadDocKey;
  config: DocConfig;
  images: ImagesState;
  handleFileUpload: (type: UploadDocKey, maxCount: number, files: File[]) => void;
  handleClearSectionImages: (type: UploadDocKey) => void;
  removeImage: (type: UploadDocKey, index: number) => void;
  uploadFormat: UploadFormat | undefined;
}

export const UploadSection = ({
  type,
  config,
  images,
  handleFileUpload,
  handleClearSectionImages,
  removeImage,
  uploadFormat,
}: UploadSectionProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isPdfSupported = PDF_SUPPORTED_KEYS.includes(type);

  const isPdfMode = uploadFormat === 'pdf';
  const maxCount = isPdfMode && type === 'lecture' ? 10 : (config.max ?? 0);
  const currentImages = images[type];

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(type, maxCount, Array.from(e.dataTransfer.files));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(type, maxCount, Array.from(e.target.files ?? []));
  };

  return (
    <Card>
      <Header>
        <Label>
          {config.name} {isPdfSupported && <PdfBadge>(PDF 지원)</PdfBadge>}
        </Label>
        <CountRow>
          <CountText>
            ({currentImages.length}/{maxCount}장)
          </CountText>
          {currentImages.length > 0 && (
            <ClearButton
              onClick={() => {
                handleClearSectionImages(type);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              삭제
            </ClearButton>
          )}
        </CountRow>
      </Header>

      {currentImages.length < maxCount && (
        <DropZone
          $isDragOver={isDragOver}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept={isPdfSupported ? 'image/*, application/pdf' : 'image/*'}
            multiple={maxCount > 1}
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleInputChange}
          />
          <UploadIcon size={20} style={{ marginBottom: '0.25rem', color: isDragOver ? '#3b82f6' : '#9ca3af' }} />
          <HintText>클릭하거나 파일을 끌어다 놓으세요</HintText>
        </DropZone>
      )}

      {currentImages.length > 0 && (
        <ImageGrid $twoColumns={maxCount > 2}>
          {currentImages.map((src, idx) => (
            <ImageThumb
              key={idx}
              $aspectRatio={FULL_PAGE_OVERRIDE_KEYS.includes(type) || ['resume', 'idCard', 'bankbook'].includes(type) || isPdfMode ? '1/1.4' : '16/9'}
            >
              <img src={src} alt="미리보기" />
              <RemoveButton onClick={() => removeImage(type, idx)}>
                <XIcon size={12} />
              </RemoveButton>
            </ImageThumb>
          ))}
        </ImageGrid>
      )}
    </Card>
  );
};
