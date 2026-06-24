import { useEffect, useRef } from 'react';

export function useBackButton(isOpen: boolean, onClose: () => void) {
  const idRef = useRef(Math.random().toString(36).substring(7));
  const poppedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    poppedRef.current = false;

    const handlePopstate = (e: PopStateEvent) => {
      // When back button is pressed, the browser already popped our state.
      // We just call onClose.
      poppedRef.current = true;
      onClose();
    };

    // Push state for this modal
    window.history.pushState({ modalId: idRef.current }, '');
    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
      // If unmounting (or isOpen became false) and we didn't pop via back button,
      // we need to remove the state we pushed.
      if (!poppedRef.current && window.history.state?.modalId === idRef.current) {
        window.history.back();
      }
    };
  }, [isOpen, onClose]);
}
