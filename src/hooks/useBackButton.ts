import { useEffect, useRef } from 'react';

export function useBackButton(isOpen: boolean, onClose: () => void) {
  const lastStateOpen = useRef(isOpen);

  useEffect(() => {
    const handlePopstate = () => {
      if (lastStateOpen.current) {
        onClose();
      }
    };

    // Transition tracking
    if (isOpen && !lastStateOpen.current) {
      window.history.pushState({ modal: true }, '');
    } else if (!isOpen && lastStateOpen.current) {
      if (window.history.state && window.history.state.modal) {
        window.history.back();
      }
    }

    lastStateOpen.current = isOpen;

    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, [isOpen, onClose]);
}
