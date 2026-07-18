import type { ChangeEvent } from 'react';
import type { ConsentData, DocKey, ImagesState, PrintSelection, SignatureRow, WorkspaceData } from '../types';

interface WorkspaceSetters {
  setCourseName: (v: string) => void;
  setDate: (v: string) => void;
  setTime: (v: string) => void;
  setLocation: (v: string) => void;
  setConsentData: (updater: (prev: ConsentData) => ConsentData) => void;
  setAttendeeCount: (v: string) => void;
  setSignatureData: (v: SignatureRow[]) => void;
  setDocumentOrder: (v: DocKey[]) => void;
  setPrintSelection: (updater: (prev: PrintSelection) => PrintSelection) => void;
  setImages: (updater: (prev: ImagesState) => ImagesState) => void;
}

export const useWorkspacePersistence = (
  workspaceData: WorkspaceData,
  setters: WorkspaceSetters,
  showMessage: (msg: string) => void,
) => {
  const handleSaveWorkspace = () => {
    const blob = new Blob([JSON.stringify(workspaceData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workspaceData.courseName}_작업내역.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showMessage('작업 내역이 파일로 안전하게 저장되었습니다.');
  };

  const handleLoadWorkspace = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as Partial<WorkspaceData>;
        if (data.courseName !== undefined) setters.setCourseName(data.courseName);
        if (data.date !== undefined) setters.setDate(data.date);
        if (data.time !== undefined) setters.setTime(data.time);
        if (data.location !== undefined) setters.setLocation(data.location);
        if (data.consentData !== undefined) {
          setters.setConsentData((prev) => ({ ...prev, ...data.consentData }));
        }
        if (data.attendeeCount !== undefined) setters.setAttendeeCount(data.attendeeCount);
        if (data.signatureData !== undefined) setters.setSignatureData(data.signatureData);
        if (data.documentOrder !== undefined) setters.setDocumentOrder(data.documentOrder);
        if (data.printSelection !== undefined) {
          setters.setPrintSelection((prev) => ({ ...prev, ...data.printSelection }));
        }
        if (data.images !== undefined) {
          setters.setImages((prev) => ({ ...prev, ...data.images }));
        }
        showMessage('작업 내역을 성공적으로 불러왔습니다.');
      } catch {
        showMessage('파일을 읽는 중 오류가 발생했습니다. 올바른 작업 파일인지 확인해주세요.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return { handleSaveWorkspace, handleLoadWorkspace };
};
