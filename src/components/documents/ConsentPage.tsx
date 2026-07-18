import styled from 'styled-components';
import type { ConsentData, ConsentField } from '../../types';
import { PdfPage, PdfInput, EditableValue, PdfTable, PdfTd } from '../../styles/shared';

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const IntroParagraph = styled.p`
  margin-bottom: 1rem;
  line-height: 1.625;
  font-size: 15px;
`;

const FieldBlock = styled.div`
  margin-bottom: 1.25rem;
  font-size: 15px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FieldRow = styled.p`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
`;

const SignDateRow = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: bold;
`;

const InfoList = styled.div`
  font-size: 15px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InfoRow = styled.p`
  display: flex;
  align-items: center;
  margin: 0;
`;

const NameRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 1rem;
  font-weight: bold;
  font-size: 1.125rem;
`;

const PrivacySection = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.black};
  padding-top: 1.25rem;
  margin-top: 1rem;
`;

const PrivacyTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.75rem;
`;

const PrivacyList = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray800};
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1.25rem;
`;

const PrivacyConsentText = styled.p`
  text-align: center;
  font-weight: bold;
  margin-bottom: 1rem;
  font-size: 15px;
`;

interface ConsentPageProps {
  id: string;
  courseName: string;
  date: string;
  time: string;
  consentData: ConsentData;
  handleChange: (field: ConsentField, value: string) => void;
}

export const ConsentPage = ({ id, courseName, date, time, consentData, handleChange }: ConsentPageProps) => (
  <PdfPage id={id} $padding="15mm 20mm" $justify="between" $font="serif">
    <div>
      <Title>용인시 미디어센터 강의료 예금계좌 이체승낙서</Title>
      <IntroParagraph>
        용인시 미디어센터의 &lt;<EditableValue style={{ fontWeight: 'bold' }}>{courseName}</EditableValue>
        &gt;에 따른 강의비를 아래 계좌로 이체하여 수령함을 승낙합니다.
      </IntroParagraph>
      <FieldBlock>
        <FieldRow>
          1. 강 의 일 시:{' '}
          <EditableValue>
            {date} ( {time} )
          </EditableValue>
        </FieldRow>
        <FieldRow>
          2. 총강의시간 :{' '}
          <PdfInput
            type="text"
            style={{ width: '3rem', textAlign: 'center', color: '#1d4ed8' }}
            value={consentData.totalHours}
            onChange={(e) => handleChange('totalHours', e.target.value)}
          />
          시간
        </FieldRow>
        <p style={{ margin: 0 }}>3. 내 용</p>
      </FieldBlock>

      <PdfTable style={{ marginBottom: '1.5rem' }}>
        <tbody>
          <tr style={{ height: '10mm' }}>
            <PdfTd $shaded $bold style={{ width: '25%' }}>
              은행명
            </PdfTd>
            <PdfTd $align="left" style={{ width: '75%' }}>
              <PdfInput
                type="text"
                style={{ width: '100%', color: '#1d4ed8', fontWeight: 'bold' }}
                value={consentData.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
              />
            </PdfTd>
          </tr>
          <tr style={{ height: '10mm' }}>
            <PdfTd $shaded $bold>
              계좌번호
            </PdfTd>
            <PdfTd $align="left">
              <PdfInput
                type="text"
                style={{ width: '100%', color: '#1d4ed8', fontWeight: 'bold' }}
                value={consentData.accountNum}
                onChange={(e) => handleChange('accountNum', e.target.value)}
              />
            </PdfTd>
          </tr>
          <tr style={{ height: '10mm' }}>
            <PdfTd $shaded $bold>
              예금주명
              <br />
              <span style={{ fontSize: '0.875rem' }}>(본인명의)</span>
            </PdfTd>
            <PdfTd $align="left">
              <PdfInput
                type="text"
                style={{ width: '100%', color: '#1d4ed8', fontWeight: 'bold' }}
                value={consentData.accountOwner}
                onChange={(e) => handleChange('accountOwner', e.target.value)}
              />
            </PdfTd>
          </tr>
          <tr style={{ height: '10mm' }}>
            <PdfTd $shaded $bold>
              금액
            </PdfTd>
            <PdfTd $align="left" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', height: '100%' }}>
              <span style={{ marginRight: '0.5rem' }}>일금</span>
              <PdfInput
                type="text"
                style={{ width: '7rem', textAlign: 'right', fontWeight: 'bold', color: '#1d4ed8' }}
                value={consentData.totalAmount}
                onChange={(e) => handleChange('totalAmount', e.target.value)}
              />
              <span style={{ marginLeft: '0.25rem' }}>원</span>
              <span style={{ fontSize: '0.875rem', color: '#374151', marginLeft: '1rem' }}>
                (기타소득세를 제외한 실수령액 :{' '}
                <PdfInput
                  type="text"
                  readOnly
                  style={{ width: '6rem', textAlign: 'right', color: '#1d4ed8', fontWeight: 'bold', margin: '0 0.25rem' }}
                  value={consentData.netAmount}
                  onChange={(e) => handleChange('netAmount', e.target.value)}
                />
                원)
              </span>
            </PdfTd>
          </tr>
        </tbody>
      </PdfTable>

      <SignDateRow>
        <PdfInput
          type="text"
          style={{ width: '4rem', textAlign: 'center', color: '#1d4ed8' }}
          value={consentData.signYear}
          onChange={(e) => handleChange('signYear', e.target.value)}
        />
        년
        <PdfInput
          type="text"
          style={{ width: '2.5rem', textAlign: 'center', color: '#1d4ed8' }}
          value={consentData.signMonth}
          onChange={(e) => handleChange('signMonth', e.target.value)}
        />
        월
        <PdfInput
          type="text"
          style={{ width: '2.5rem', textAlign: 'center', color: '#1d4ed8' }}
          value={consentData.signDay}
          onChange={(e) => handleChange('signDay', e.target.value)}
        />
        일
      </SignDateRow>

      <InfoList>
        <InfoRow>
          ◦ 주민등록번호 :{' '}
          <PdfInput
            type="text"
            style={{ width: '16rem', marginLeft: '0.5rem', color: '#1d4ed8' }}
            value={consentData.ssn}
            onChange={(e) => handleChange('ssn', e.target.value)}
          />
        </InfoRow>
        <InfoRow>
          ◦ 주소(자택) :{' '}
          <PdfInput
            type="text"
            style={{ flex: 1, marginLeft: '0.5rem', color: '#1d4ed8' }}
            value={consentData.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </InfoRow>
        <InfoRow>
          ◦ 연락처 :{' '}
          <PdfInput
            type="text"
            style={{ width: '16rem', marginLeft: '0.5rem', color: '#1d4ed8' }}
            value={consentData.contact}
            onChange={(e) => handleChange('contact', e.target.value)}
          />
        </InfoRow>
        <InfoRow>
          ◦ 소속기관 및 부서 :{' '}
          <PdfInput
            type="text"
            style={{ width: '16rem', marginLeft: '0.5rem', color: '#1d4ed8' }}
            value={consentData.affiliation}
            onChange={(e) => handleChange('affiliation', e.target.value)}
          />
        </InfoRow>
        <NameRow>
          ◦ 성명 :{' '}
          <PdfInput
            type="text"
            style={{ width: '8rem', textAlign: 'center', margin: '0 0.5rem', color: '#1d4ed8' }}
            value={consentData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />{' '}
          (서명 또는 인)
        </NameRow>
      </InfoList>
    </div>

    <PrivacySection>
      <PrivacyTitle>개인정보의 수집·이용·제공 및 활용 동의서(신청인)</PrivacyTitle>
      <PrivacyList>
        <p style={{ margin: 0 }}>1. 수집항목 : 성명, 연락처, 주민등록번호, 계좌번호, 주소 등</p>
        <p style={{ margin: 0 }}>2. 이용목적 : 예금계좌이체 및 원천징수</p>
        <p style={{ margin: 0 }}>3. 보유기간 : 사업종료 후 5년 이하</p>
        <p style={{ margin: 0 }}>
          4. 본 센터는 수집된 개인정보에 대해 안내된 이용목적 이외의 용도로 활용하지 않으며, 보유기간 이후
          자동삭제됨을 알려 드립니다.
        </p>
      </PrivacyList>
      <PrivacyConsentText>본인은 용인시 미디어센터에서 위와 같이 개인정보를 수집, 이용함에 동의합니다.</PrivacyConsentText>
      <SignDateRow style={{ marginBottom: '1rem' }}>
        <PdfInput
          type="text"
          style={{ width: '4rem', textAlign: 'center', color: '#1d4ed8' }}
          value={consentData.signYear}
          onChange={(e) => handleChange('signYear', e.target.value)}
        />
        년
        <PdfInput
          type="text"
          style={{ width: '2.5rem', textAlign: 'center', color: '#1d4ed8' }}
          value={consentData.signMonth}
          onChange={(e) => handleChange('signMonth', e.target.value)}
        />
        월
        <PdfInput
          type="text"
          style={{ width: '2.5rem', textAlign: 'center', color: '#1d4ed8' }}
          value={consentData.signDay}
          onChange={(e) => handleChange('signDay', e.target.value)}
        />
        일
      </SignDateRow>
      <NameRow style={{ paddingBottom: '0.5rem' }}>
        성명 :{' '}
        <PdfInput
          type="text"
          style={{ width: '8rem', textAlign: 'center', margin: '0 0.5rem', color: '#1d4ed8' }}
          value={consentData.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />{' '}
        (서명 또는 인)
      </NameRow>
    </PrivacySection>
  </PdfPage>
);
