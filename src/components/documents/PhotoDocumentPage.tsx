import styled from 'styled-components';
import type { ImagesState, UploadDocKey } from '../../types';
import { PdfPage } from '../../styles/shared';
import { DOC_CONFIGS } from '../../config/docConfigs';
import { ImageIcon } from '../icons';

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderBlock = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const CenterName = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const CourseHeading = styled.h2`
  font-size: 28px;
  font-weight: bold;
  line-height: 1.25;
  word-break: keep-all;
`;

const InfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 2px solid ${({ theme }) => theme.colors.black};
  margin-bottom: 1rem;
  font-size: 1.125rem;
`;

const InfoLabelCell = styled.td`
  border: 2px solid ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.gray100};
  font-weight: bold;
  padding: 0.5rem 1rem;
  width: 25%;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
`;

const InfoValueCell = styled.td`
  border: 2px solid ${({ theme }) => theme.colors.black};
  padding: 0.5rem 1rem;
  width: 75%;
  vertical-align: middle;
  font-weight: 500;
`;

const PhotoArea = styled.div`
  flex: 1;
  width: 100%;
  border: 2px solid ${({ theme }) => theme.colors.gray200};
  padding: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const EmptyState = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray300};
`;

const PhotoGrid = styled.div<{ $singleColumn: boolean }>`
  height: 100%;
  width: 100%;
  min-height: 0;
  gap: 0.5rem;
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: ${({ $singleColumn }) => ($singleColumn ? '1fr' : 'repeat(2, 1fr)')};
`;

const PhotoCell = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray100};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 0;
  padding: 0.25rem;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const EmptyCell = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray300};
  min-height: 0;
  font-size: 0.875rem;
`;

interface PhotoDocumentPageProps {
  id: string;
  type: UploadDocKey;
  courseName: string;
  date: string;
  time: string;
  location: string;
  images: ImagesState;
}

export const PhotoDocumentPage = ({ id, type, courseName, date, time, location, images }: PhotoDocumentPageProps) => {
  const config = DOC_CONFIGS[type];
  const currentImages = images[type];
  const max = config.max ?? 0;

  return (
    <PdfPage id={id} $padding="20mm">
      <Content>
        <HeaderBlock>
          <CenterName>용인특례시 미디어센터</CenterName>
          <CourseHeading>{type === 'lecture' ? courseName : `${courseName} - ${config.name}`}</CourseHeading>
        </HeaderBlock>

        <InfoTable>
          <tbody>
            <tr>
              <InfoLabelCell>일 시</InfoLabelCell>
              <InfoValueCell>{`${date}  ${time}`}</InfoValueCell>
            </tr>
            <tr>
              <InfoLabelCell>장 소</InfoLabelCell>
              <InfoValueCell>{location}</InfoValueCell>
            </tr>
          </tbody>
        </InfoTable>

        <PhotoArea>
          {currentImages.length === 0 ? (
            <EmptyState>
              <ImageIcon size={64} style={{ marginBottom: '0.5rem' }} />
              <p>사진이 이곳에 표시됩니다 ({max}장)</p>
            </EmptyState>
          ) : (
            <PhotoGrid $singleColumn={type === 'snack'}>
              {currentImages.map((src, idx) => (
                <PhotoCell key={idx}>
                  <img src={src} alt="" />
                </PhotoCell>
              ))}
              {Array.from({ length: max - currentImages.length }).map((_, idx) => (
                <EmptyCell key={`empty-${idx}`}>
                  <span>사진 없음</span>
                </EmptyCell>
              ))}
            </PhotoGrid>
          )}
        </PhotoArea>
      </Content>
    </PdfPage>
  );
};
