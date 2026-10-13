import { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import type { WorkspaceData } from './types';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import {
  useToast,
  useConsentData,
  useSignatureRoster,
  useImageUpload,
  useDocumentOrder,
  useWorkspacePersistence,
} from './hooks';
import { Sidebar } from './components/Sidebar';
import { PreviewArea } from './components/PreviewArea';

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray100};
  display: flex;
  position: relative;
`;

const Toast = styled.div`
  position: fixed;
  top: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.gray800};
  color: ${({ theme }) => theme.colors.white};
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  z-index: 50;
  font-size: 0.875rem;
  font-weight: bold;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingBox = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  font-weight: bold;
  color: ${({ theme }) => theme.colors.blue600};
`;

function App() {
  const { toastMsg, showMessage } = useToast();

  const [courseName, setCourseName] = useState('유튜브 크리에이터 실무-중급과정');
  const [date, setDate] = useState('2026. 04. 25');
  const [time, setTime] = useState('14:00~17:00');
  const [location, setLocation] = useState('용인특례시 미디어센터 3층 플레이그라운드 B');

  const { consentData, setConsentData, handleConsentChange } = useConsentData(date, time);
  const {
    attendeeCount,
    setAttendeeCount,
    extraColumnLabel,
    setExtraColumnLabel,
    signatureData,
    setSignatureData,
    handleSigChange,
    handleExcelFile,
  } = useSignatureRoster(showMessage);
  const { images, setImages, uploadFormats, isLoading, handleFileUpload, handleClearSectionImages, removeImage } =
    useImageUpload(showMessage);
  const {
    activeTab,
    documentOrder,
    setDocumentOrder,
    printSelection,
    setPrintSelection,
    draggedItemKey,
    setDraggedItemKey,
    handleTabClick,
    handleDropOrder,
  } = useDocumentOrder();

  const workspaceData: WorkspaceData = {
    courseName,
    date,
    time,
    location,
    consentData,
    attendeeCount,
    extraColumnLabel,
    signatureData,
    documentOrder,
    printSelection,
    images,
  };

  const { handleSaveWorkspace, handleLoadWorkspace } = useWorkspacePersistence(
    workspaceData,
    {
      setCourseName,
      setDate,
      setTime,
      setLocation,
      setConsentData,
      setAttendeeCount,
      setExtraColumnLabel,
      setSignatureData,
      setDocumentOrder,
      setPrintSelection,
      setImages,
    },
    showMessage,
  );

  const handlePrint = () => window.print();

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        {toastMsg && <Toast>{toastMsg}</Toast>}
        {isLoading && (
          <LoadingOverlay>
            <LoadingBox>처리 중입니다...</LoadingBox>
          </LoadingOverlay>
        )}

        <Sidebar
          activeTab={activeTab}
          documentOrder={documentOrder}
          printSelection={printSelection}
          setPrintSelection={setPrintSelection}
          draggedItemKey={draggedItemKey}
          setDraggedItemKey={setDraggedItemKey}
          handleTabClick={handleTabClick}
          handleDropOrder={handleDropOrder}
          courseName={courseName}
          setCourseName={setCourseName}
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          location={location}
          setLocation={setLocation}
          attendeeCount={attendeeCount}
          handleExcelFile={handleExcelFile}
          images={images}
          uploadFormats={uploadFormats}
          handleFileUpload={handleFileUpload}
          handleClearSectionImages={handleClearSectionImages}
          removeImage={removeImage}
          handleSaveWorkspace={handleSaveWorkspace}
          handleLoadWorkspace={handleLoadWorkspace}
          handlePrint={handlePrint}
        />

        <PreviewArea
          documentOrder={documentOrder}
          activeTab={activeTab}
          printSelection={printSelection}
          courseName={courseName}
          date={date}
          time={time}
          location={location}
          consentData={consentData}
          handleConsentChange={handleConsentChange}
          attendeeCount={attendeeCount}
          setAttendeeCount={setAttendeeCount}
          extraColumnLabel={extraColumnLabel}
          setExtraColumnLabel={setExtraColumnLabel}
          signatureData={signatureData}
          handleSigChange={handleSigChange}
          images={images}
          uploadFormats={uploadFormats}
        />
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
