import styled from 'styled-components';

// A4 page container shared by every printable document component.
export const PdfPage = styled.div<{
  $padding?: string;
  $justify?: 'between' | 'start';
  $font?: 'serif' | 'sans';
}>`
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  width: 210mm;
  height: 297mm;
  padding: ${({ $padding }) => $padding ?? '20mm'};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: ${({ $justify }) => ($justify === 'between' ? 'space-between' : 'flex-start')};
  font-family: ${({ $font, theme }) => ($font === 'serif' ? theme.fonts.serif : 'inherit')};

  @media print {
    box-shadow: none !important;
    margin: 0 !important;
    page-break-after: always !important;
    break-after: page !important;
  }
`;

// Underlined/dashed input used for every editable field on a printable page.
export const PdfInput = styled.input`
  border: 1px dashed transparent;
  transition: border-color 0.2s;
  background-color: transparent;
  font-family: inherit;

  &:hover,
  &:focus {
    border-color: #94a3b8;
    outline: none;
  }

  @media print {
    border: none !important;
    background: transparent !important;
    outline: none !important;
    color: black !important;
    -webkit-text-fill-color: black !important;
  }
`;

// Non-input text that should render blue on screen but black when printed.
export const EditableValue = styled.span`
  color: ${({ theme }) => theme.colors.blue700};

  @media print {
    color: black !important;
  }
`;

export const PdfTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid ${({ theme }) => theme.colors.black};
  text-align: center;
`;

export const PdfTh = styled.th`
  border: 1px solid ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.gray100};
  padding: 0.5rem;
  font-weight: bold;
`;

export const PdfTd = styled.td<{
  $shaded?: boolean;
  $bold?: boolean;
  $align?: 'left' | 'center';
}>`
  border: 1px solid ${({ theme }) => theme.colors.black};
  padding: 0.5rem;
  background: ${({ $shaded, theme }) => ($shaded ? theme.colors.gray100 : 'transparent')};
  font-weight: ${({ $bold }) => ($bold ? 'bold' : 'normal')};
  text-align: ${({ $align }) => $align ?? 'center'};
`;
