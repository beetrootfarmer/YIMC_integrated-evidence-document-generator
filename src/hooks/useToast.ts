import { useRef, useState } from 'react';

export const useToast = () => {
  const [toastMsg, setToastMsg] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showMessage = (msg: string) => {
    setToastMsg(msg);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToastMsg(''), 4000);
  };

  return { toastMsg, showMessage };
};
