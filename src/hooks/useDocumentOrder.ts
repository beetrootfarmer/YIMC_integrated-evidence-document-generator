import { useState } from 'react';
import type { DocKey, DocTab, PrintSelection } from '../types';
import { DOC_CONFIGS, DOC_KEYS } from '../config/docConfigs';

const createInitialPrintSelection = (): PrintSelection =>
  DOC_KEYS.reduce((acc, key) => {
    acc[key] = DOC_CONFIGS[key].tab === 'before';
    return acc;
  }, {} as PrintSelection);

export const useDocumentOrder = () => {
  const [activeTab, setActiveTab] = useState<DocTab>('before');
  const [documentOrder, setDocumentOrder] = useState<DocKey[]>(DOC_KEYS);
  const [printSelection, setPrintSelection] = useState<PrintSelection>(createInitialPrintSelection);
  const [draggedItemKey, setDraggedItemKey] = useState<DocKey | null>(null);

  // Switching tabs activates every doc in that tab and deactivates the other tab's docs.
  const handleTabClick = (tabId: DocTab) => {
    setActiveTab(tabId);
    setPrintSelection(
      DOC_KEYS.reduce((acc, key) => {
        acc[key] = DOC_CONFIGS[key].tab === tabId;
        return acc;
      }, {} as PrintSelection),
    );
  };

  const handleDropOrder = (droppedKey: DocKey) => {
    if (!draggedItemKey || draggedItemKey === droppedKey) return;
    const newOrder = [...documentOrder];
    const draggedIdx = newOrder.indexOf(draggedItemKey);
    const droppedIdx = newOrder.indexOf(droppedKey);
    newOrder.splice(draggedIdx, 1);
    newOrder.splice(droppedIdx, 0, draggedItemKey);
    setDocumentOrder(newOrder);
    setDraggedItemKey(null);
  };

  return {
    activeTab,
    documentOrder,
    setDocumentOrder,
    printSelection,
    setPrintSelection,
    draggedItemKey,
    setDraggedItemKey,
    handleTabClick,
    handleDropOrder,
  };
};
