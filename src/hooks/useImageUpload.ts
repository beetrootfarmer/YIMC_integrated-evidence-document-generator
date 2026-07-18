import { useState } from 'react';
import type { ImagesState, UploadDocKey, UploadFormatsState } from '../types';
import { UPLOAD_DOC_KEYS } from '../config/docConfigs';
import { pdfjsLib } from '../lib/pdfjsSetup';

const createEmptyImagesState = (): ImagesState =>
  UPLOAD_DOC_KEYS.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {} as ImagesState);

export const useImageUpload = (showMessage: (msg: string) => void) => {
  const [images, setImages] = useState<ImagesState>(createEmptyImagesState);
  const [uploadFormats, setUploadFormats] = useState<UploadFormatsState>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleClearSectionImages = (type: UploadDocKey) => {
    setImages((prev) => ({ ...prev, [type]: [] }));
    setUploadFormats((prev) => ({ ...prev, [type]: undefined }));
  };

  const removeImage = (type: UploadDocKey, index: number) => {
    setImages((prev) => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }));
  };

  const handleFileUpload = async (type: UploadDocKey, maxCount: number, files: File[]) => {
    if (!files.length) return;
    if (files.some((f) => f.name.endsWith('.ppt') || f.name.endsWith('.pptx'))) {
      showMessage('🚨 PPT 파일은 PDF로 저장 후 올려주세요!');
    }

    const pdfFiles = files.filter((f) => f.type === 'application/pdf');
    const imageFiles = files.filter((f) => f.type.startsWith('image/'));

    if (pdfFiles.length > 0) setUploadFormats((prev) => ({ ...prev, [type]: 'pdf' }));
    else if (imageFiles.length > 0) setUploadFormats((prev) => ({ ...prev, [type]: 'image' }));

    if (pdfFiles.length > 0) {
      setIsLoading(true);
      showMessage('PDF에서 페이지를 추출하고 있습니다...');
      for (const file of pdfFiles) {
        try {
          const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;

          const pageIndices =
            maxCount === 1
              ? [1]
              : Array.from(
                  { length: Math.min(pdf.numPages, maxCount - images[type].length) },
                  () => Math.floor(Math.random() * pdf.numPages) + 1,
                ).sort((a, b) => a - b);

          for (const pageNum of [...new Set(pageIndices)]) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const context = canvas.getContext('2d');
            if (!context) continue;
            await page.render({ canvasContext: context, viewport, canvas }).promise;
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            setImages((prev) => (prev[type].length < maxCount ? { ...prev, [type]: [...prev[type], dataUrl] } : prev));
          }
        } catch (err) {
          console.error(err);
          showMessage('PDF 처리 중 오류 발생');
        }
      }
      setIsLoading(false);
    }

    if (imageFiles.length > 0) {
      setImages((prev) => {
        if (imageFiles.length > maxCount - prev[type].length) {
          setTimeout(() => showMessage(`최대 ${maxCount}장까지만 가능합니다.`), 100);
        }
        return prev;
      });
      imageFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImages((prev) => (prev[type].length < maxCount ? { ...prev, [type]: [...prev[type], result] } : prev));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return {
    images,
    setImages,
    uploadFormats,
    setUploadFormats,
    isLoading,
    handleFileUpload,
    handleClearSectionImages,
    removeImage,
  };
};
