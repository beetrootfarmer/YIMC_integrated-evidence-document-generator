import styled from 'styled-components';
import type { ImagesState, UploadDocKey } from '../../types';
import { PdfPage } from '../../styles/shared';
import { FULL_PAGE_OVERRIDE_KEYS } from '../../config/docConfigs';

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const EmptyPlaceholder = styled.div`
  flex: 1;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.gray50};

  p {
    color: ${({ theme }) => theme.colors.gray400};
  }
`;

const ImageFrame = styled.div<{ $bordered: boolean }>`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  ${({ $bordered, theme }) =>
    $bordered
      ? `border: 1px solid ${theme.colors.gray300}; padding: 0.5rem; background: ${theme.colors.gray50};`
      : ''}

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

interface SingleImagePageProps {
  id: string;
  type: UploadDocKey;
  title: string;
  images: ImagesState;
  isFullPageOverride?: boolean;
}

export const SingleImagePage = ({ id, type, title, images, isFullPageOverride }: SingleImagePageProps) => {
  const currentImages = images[type];
  const isFullPage = isFullPageOverride || FULL_PAGE_OVERRIDE_KEYS.includes(type);

  if (currentImages.length === 0) {
    return (
      <PdfPage id={id} $padding="20mm">
        <Title>{title}</Title>
        <EmptyPlaceholder>
          <p>이미지가 첨부되지 않았습니다.</p>
        </EmptyPlaceholder>
      </PdfPage>
    );
  }

  return (
    <>
      {currentImages.map((imgSrc, idx) => (
        <PdfPage
          key={`${type}-${idx}`}
          id={idx === 0 ? id : undefined}
          $padding={isFullPage ? '0' : '20mm'}
        >
          {!isFullPage && (
            <Title>
              {title} {currentImages.length > 1 ? `(${idx + 1}/${currentImages.length})` : ''}
            </Title>
          )}
          <ImageFrame $bordered={!isFullPage}>
            <img src={imgSrc} alt={`${title} ${idx + 1}`} />
          </ImageFrame>
        </PdfPage>
      ))}
    </>
  );
};
