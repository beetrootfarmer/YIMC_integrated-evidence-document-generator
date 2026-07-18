import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import styled from 'styled-components';
import type { DocKey, DocTab, ImagesState, PrintSelection, UploadDocKey, UploadFormatsState } from '../types';
import { DOC_CONFIGS } from '../config/docConfigs';
import { SaveIcon, FolderOpenIcon, PrinterIcon, ExcelIcon, GripIcon, LinkIcon } from './icons';
import { UploadSection } from './UploadSection';

const SidebarContainer = styled.aside`
  width: 450px;
  min-width: 450px;
  background: ${({ theme }) => theme.colors.white};
  border-right: 1px solid ${({ theme }) => theme.colors.gray200};
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 10;
  height: 100vh;
  position: sticky;
  top: 0;

  @media print {
    display: none !important;
  }
`;

const HeaderSection = styled.div`
  padding: 1.5rem 1.5rem 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
  flex-shrink: 0;
`;

const TitleText = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.gray800};
  margin: 0 0 0.25rem;
`;

const SubtitleText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray500};
  margin: 0 0 1rem;
`;

const ActionButtonsRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ActionButton = styled.button<{ $variant: 'indigo' | 'amber' }>`
  flex: 1;
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  cursor: pointer;
  transition: background-color 0.15s;
  ${({ $variant, theme }) =>
    $variant === 'indigo'
      ? `background: ${theme.colors.indigo50}; color: ${theme.colors.indigo700}; border: 1px solid ${theme.colors.indigo100};
         &:hover { background: ${theme.colors.indigo100}; }`
      : `background: ${theme.colors.amber50}; color: ${theme.colors.amber700}; border: 1px solid ${theme.colors.amber100};
         &:hover { background: ${theme.colors.amber100}; }`}
`;

const TabsRow = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.75rem 0;
  font-size: 0.875rem;
  font-weight: bold;
  cursor: pointer;
  border: none;
  background: ${({ $active, theme }) => ($active ? `${theme.colors.blue50}80` : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.blue600 : theme.colors.gray500)};
  border-bottom: 2px solid ${({ $active, theme }) => ($active ? theme.colors.blue600 : 'transparent')};
  transition: background-color 0.15s;

  &:hover {
    background: ${({ $active, theme }) => ($active ? `${theme.colors.blue50}80` : theme.colors.gray50)};
  }
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 6rem;
`;

const DocOrderPanel = styled.div`
  background: ${({ theme }) => theme.colors.gray800};
  color: ${({ theme }) => theme.colors.white};
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
`;

const DocOrderTitle = styled.h3`
  font-weight: bold;
  font-size: 0.875rem;
  margin: 0 0 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DocOrderHint = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray400};
  margin: 0 0 0.75rem;
`;

const DocOrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

const DocOrderItem = styled.div<{ $dragging: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.gray700};
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: move;
  transition: border-color 0.15s;
  opacity: ${({ $dragging }) => ($dragging ? 0.5 : 1)};
  border: 1px solid transparent;

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray500};
  }
`;

const DocCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  flex: 1;

  &:hover {
    color: ${({ theme }) => theme.colors.blue300};
  }
`;

const DocNameSpan = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const SectionDivider = styled.div`
  border-top: 2px dashed ${({ theme }) => theme.colors.gray200};
  margin: 0.5rem 0;
  position: relative;
`;

const SectionDividerLabel = styled.span`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -0.75rem;
  background: ${({ theme }) => theme.colors.white};
  padding: 0 0.75rem;
  font-size: 0.75rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.gray400};
`;

const BasicInfoBox = styled.div`
  background: ${({ theme }) => theme.colors.blue50};
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.blue100};
  transition: box-shadow 0.3s;
`;

const BasicInfoTitle = styled.h3`
  font-weight: bold;
  color: #1e40af;
  font-size: 0.875rem;
  margin: 0 0 0.5rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.gray700};
  margin-bottom: 0.25rem;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 0.25rem;
  font-size: 0.875rem;
`;

const TwoColGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const ExcelBox = styled.div<{ $dragOver: boolean }>`
  background: ${({ $dragOver, theme }) => ($dragOver ? theme.colors.green100 : theme.colors.green50)};
  padding: 1rem;
  border-radius: 0.5rem;
  border: 2px dashed ${({ $dragOver, theme }) => ($dragOver ? theme.colors.green500 : theme.colors.green200)};
  transition: border-color 0.3s, background-color 0.3s;
`;

const ExcelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ExcelLabel = styled.label`
  font-size: 0.875rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.green800};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ExtractedCount = styled.span`
  font-size: 0.75rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.green600};
`;

const ExcelDropButton = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.green200};
  color: ${({ theme }) => theme.colors.green700};
  font-weight: bold;
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.green100};
  }
`;

const PrintBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
  flex-shrink: 0;
`;

const PrintButton = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.blue600};
  color: ${({ theme }) => theme.colors.white};
  font-weight: bold;
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: background-color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.blue700};
  }
`;

interface SidebarProps {
  activeTab: DocTab;
  documentOrder: DocKey[];
  printSelection: PrintSelection;
  setPrintSelection: (updater: (prev: PrintSelection) => PrintSelection) => void;
  draggedItemKey: DocKey | null;
  setDraggedItemKey: (key: DocKey | null) => void;
  handleTabClick: (tab: DocTab) => void;
  handleDropOrder: (droppedKey: DocKey) => void;

  courseName: string;
  setCourseName: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
  time: string;
  setTime: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;

  attendeeCount: string;
  handleExcelFile: (file: File | null | undefined) => void;

  images: ImagesState;
  uploadFormats: UploadFormatsState;
  handleFileUpload: (type: UploadDocKey, maxCount: number, files: File[]) => void;
  handleClearSectionImages: (type: UploadDocKey) => void;
  removeImage: (type: UploadDocKey, index: number) => void;

  handleSaveWorkspace: () => void;
  handleLoadWorkspace: (e: ChangeEvent<HTMLInputElement>) => void;

  handlePrint: () => void;
}

export const Sidebar = ({
  activeTab,
  documentOrder,
  printSelection,
  setPrintSelection,
  draggedItemKey,
  setDraggedItemKey,
  handleTabClick,
  handleDropOrder,
  courseName,
  setCourseName,
  date,
  setDate,
  time,
  setTime,
  location,
  setLocation,
  attendeeCount,
  handleExcelFile,
  images,
  uploadFormats,
  handleFileUpload,
  handleClearSectionImages,
  removeImage,
  handleSaveWorkspace,
  handleLoadWorkspace,
  handlePrint,
}: SidebarProps) => {
  const formRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const excelFileInputRef = useRef<HTMLInputElement>(null);
  const workspaceFileInputRef = useRef<HTMLInputElement>(null);
  const [isExcelDragOver, setIsExcelDragOverState] = useState(false);

  const currentTabKeys = documentOrder.filter((key) => DOC_CONFIGS[key].tab === activeTab);
  const needsBasicInfo = currentTabKeys.some((key) => printSelection[key] && DOC_CONFIGS[key].needsBasicInfo);
  const needsExcelForm = currentTabKeys.some((key) => printSelection[key] && DOC_CONFIGS[key].needsExcel);
  const activeUploadKeys = currentTabKeys.filter(
    (key) => printSelection[key] && DOC_CONFIGS[key].max,
  ) as UploadDocKey[];

  const scrollToForm = (targetKey: DocKey) => {
    const formKey = targetKey === 'consent' ? 'basicInfo' : targetKey;
    const formEl = formRefs.current[formKey];
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      formEl.classList.add('form-highlight');
      setTimeout(() => formEl.classList.remove('form-highlight'), 1200);
    }
    const previewEl = document.getElementById(`preview-${targetKey}`);
    previewEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDocNameClick = (key: DocKey) => {
    if (!printSelection[key]) setPrintSelection((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => scrollToForm(key), 50);
  };

  return (
    <SidebarContainer>
      <HeaderSection>
        <TitleText>통합 증빙 서류 생성기</TitleText>
        <SubtitleText>필요한 문서만 선택하여 인쇄 및 작업이 가능합니다.</SubtitleText>

        <ActionButtonsRow>
          <ActionButton $variant="indigo" onClick={handleSaveWorkspace}>
            <SaveIcon size={16} /> 내역 저장하기 (PC)
          </ActionButton>
          <ActionButton $variant="amber" onClick={() => workspaceFileInputRef.current?.click()}>
            <FolderOpenIcon size={16} /> 내역 불러오기
          </ActionButton>
          <input
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            ref={workspaceFileInputRef}
            onChange={handleLoadWorkspace}
          />
        </ActionButtonsRow>

        <TabsRow>
          <TabButton $active={activeTab === 'before'} onClick={() => handleTabClick('before')}>
            [수업 전] 필수 서류
          </TabButton>
          <TabButton $active={activeTab === 'after'} onClick={() => handleTabClick('after')}>
            [수업 후] 증빙 서류
          </TabButton>
        </TabsRow>
      </HeaderSection>

      <ScrollArea>
        <DocOrderPanel>
          <DocOrderTitle>
            <PrinterIcon size={16} /> 출력 문서 선택
          </DocOrderTitle>
          <DocOrderHint>체크하면 하단에 입력 폼이 열립니다. 끌어서 순서를 변경하세요.</DocOrderHint>
          <DocOrderList>
            {currentTabKeys.map((key) => (
              <DocOrderItem
                key={key}
                draggable
                $dragging={draggedItemKey === key}
                onDragStart={() => setDraggedItemKey(key)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDropOrder(key)}
              >
                <DocCheckboxLabel>
                  <input
                    type="checkbox"
                    checked={printSelection[key]}
                    onChange={(e) => setPrintSelection((prev) => ({ ...prev, [key]: e.target.checked }))}
                    style={{ width: '1rem', height: '1rem' }}
                  />
                  <DocNameSpan
                    onClick={(e) => {
                      e.preventDefault();
                      handleDocNameClick(key);
                    }}
                  >
                    {DOC_CONFIGS[key].name} <LinkIcon size={12} style={{ color: '#9ca3af', opacity: 0.5 }} />
                  </DocNameSpan>
                </DocCheckboxLabel>
                <GripIcon size={16} style={{ color: '#6b7280', marginLeft: '0.5rem', pointerEvents: 'none' }} />
              </DocOrderItem>
            ))}
          </DocOrderList>
        </DocOrderPanel>

        {(needsBasicInfo || needsExcelForm || activeUploadKeys.length > 0) && (
          <SectionDivider>
            <SectionDividerLabel>필요한 정보 입력란</SectionDividerLabel>
          </SectionDivider>
        )}

        {needsBasicInfo && (
          <BasicInfoBox ref={(el) => { formRefs.current['basicInfo'] = el; }}>
            <BasicInfoTitle>기본 정보</BasicInfoTitle>
            <FieldGroup>
              <div>
                <FieldLabel>강의명</FieldLabel>
                <TextInput type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
              </div>
              <TwoColGrid>
                <div>
                  <FieldLabel>일자</FieldLabel>
                  <TextInput type="text" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <FieldLabel>시간</FieldLabel>
                  <TextInput type="text" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </TwoColGrid>
              <div>
                <FieldLabel>장소</FieldLabel>
                <TextInput type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
            </FieldGroup>
          </BasicInfoBox>
        )}

        {needsExcelForm && (
          <ExcelBox
            ref={(el) => { formRefs.current['signature'] = el; }}
            $dragOver={isExcelDragOver}
            onDragOver={(e) => {
              e.preventDefault();
              setIsExcelDragOverState(true);
            }}
            onDragLeave={() => setIsExcelDragOverState(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsExcelDragOverState(false);
              if (e.dataTransfer.files[0]) handleExcelFile(e.dataTransfer.files[0]);
            }}
          >
            <ExcelHeader>
              <ExcelLabel>
                <ExcelIcon size={16} /> 서명부 명단 엑셀 연동
              </ExcelLabel>
              {attendeeCount && <ExtractedCount>{attendeeCount}명 추출됨</ExtractedCount>}
            </ExcelHeader>
            <ExcelDropButton onClick={() => excelFileInputRef.current?.click()}>
              {isExcelDragOver ? '여기에 파일을 놓으세요!' : '명단 엑셀(XLSX)/CSV 끌어다 놓기'}
            </ExcelDropButton>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              style={{ display: 'none' }}
              ref={excelFileInputRef}
              onChange={(e) => handleExcelFile(e.target.files?.[0])}
            />
          </ExcelBox>
        )}

        {activeUploadKeys.map((key) => (
          <div key={key} ref={(el) => { formRefs.current[key] = el; }}>
            <UploadSection
              type={key}
              config={DOC_CONFIGS[key]}
              images={images}
              handleFileUpload={handleFileUpload}
              handleClearSectionImages={handleClearSectionImages}
              removeImage={removeImage}
              uploadFormat={uploadFormats[key]}
            />
          </div>
        ))}
      </ScrollArea>

      <PrintBar>
        <PrintButton onClick={handlePrint}>
          <PrinterIcon size={20} /> 인쇄 및 PDF 다운로드
        </PrintButton>
      </PrintBar>
    </SidebarContainer>
  );
};
