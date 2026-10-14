import styled from 'styled-components';
import type { SignatureRow } from '../../types';
import { PdfPage, PdfInput, EditableValue, PdfTable, PdfTh, PdfTd } from '../../styles/shared';

const Title = styled.h1`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.75rem;
`;

const InfoBlock = styled.div`
  font-size: 15px;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: bold;
`;

const InfoRow = styled.p`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const PhotoNotice = styled.p`
  margin: 0 0 0.25rem;
  font-size: 9pt;
  line-height: 1.2;
  text-align: right;
  color: #1d4ed8;
`;

interface SignaturePageProps {
  id: string;
  courseName: string;
  date: string;
  time: string;
  attendeeCount: string;
  setAttendeeCount: (value: string) => void;
  extraColumnLabel: string;
  setExtraColumnLabel: (value: string) => void;
  signatureData: SignatureRow[];
  handleSigChange: (index: number, field: keyof SignatureRow, value: string) => void;
}

export const SignaturePage = ({
  id,
  courseName,
  date,
  time,
  attendeeCount,
  setAttendeeCount,
  extraColumnLabel,
  setExtraColumnLabel,
  signatureData,
  handleSigChange,
}: SignaturePageProps) => {
  const chunks: SignatureRow[][] = [];
  for (let i = 0; i < signatureData.length; i += 20) chunks.push(signatureData.slice(i, i + 20));

  return (
    <>
      {chunks.map((chunk, pageIndex) => (
        <PdfPage key={pageIndex} id={pageIndex === 0 ? id : undefined} $padding="12mm 20mm" $font="serif">
          <Title>
            '{courseName}' 수강생 서 명 부 {chunks.length > 1 ? `(${pageIndex + 1}/${chunks.length})` : ''}
          </Title>
          <InfoBlock>
            <InfoRow>
              1. 교 육 명 : <EditableValue>{courseName}</EditableValue>
            </InfoRow>
            <InfoRow>
              2. 일 시 : <EditableValue>{date}</EditableValue>
            </InfoRow>
            <InfoRow>
              3. 교육시간 : <EditableValue>( {time} )</EditableValue>
            </InfoRow>
            <InfoRow>
              4. 참 석 자 수 :{' '}
              <PdfInput
                type="text"
                style={{ width: '3rem', textAlign: 'center', color: '#1d4ed8' }}
                value={attendeeCount}
                onChange={(e) => setAttendeeCount(e.target.value)}
              />
              명
            </InfoRow>
          </InfoBlock>

          <PhotoNotice>수업 중 증빙용 사진 촬영이 있습니다.</PhotoNotice>

          <PdfTable style={{ fontSize: '14px', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ height: '10mm' }}>
                <PdfTh style={{ width: '12%' }}>번호</PdfTh>
                <PdfTh style={{ width: '35%' }}>성명</PdfTh>
                <PdfTh style={{ width: '30%' }}>서명(인)</PdfTh>
                <PdfTh style={{ width: '23%' }}>
                  <PdfInput
                    type="text"
                    style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', color: '#1d4ed8' }}
                    value={extraColumnLabel}
                    onChange={(e) => setExtraColumnLabel(e.target.value)}
                  />
                </PdfTh>
              </tr>
            </thead>
            <tbody>
              {chunk.map((row, i) => {
                const globalIndex = pageIndex * 20 + i;
                return (
                  <tr key={globalIndex} style={{ height: '10.5mm' }}>
                    <PdfTd>{globalIndex + 1}</PdfTd>
                    <PdfTd>
                      <PdfInput
                        type="text"
                        style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', color: '#1d4ed8' }}
                        value={row.name}
                        onChange={(e) => handleSigChange(globalIndex, 'name', e.target.value)}
                      />
                    </PdfTd>
                    <PdfTd />
                    <PdfTd>
                      <PdfInput
                        type="text"
                        style={{ width: '100%', textAlign: 'center', color: '#1d4ed8' }}
                        value={row.parking}
                        onChange={(e) => handleSigChange(globalIndex, 'parking', e.target.value)}
                      />
                    </PdfTd>
                  </tr>
                );
              })}
            </tbody>
          </PdfTable>
        </PdfPage>
      ))}
    </>
  );
};
