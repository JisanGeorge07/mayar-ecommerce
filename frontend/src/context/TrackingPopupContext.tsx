import React, { createContext, useContext, useState } from 'react';

interface TrackingPopupContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const TrackingPopupContext = createContext<TrackingPopupContextValue | null>(null);

export const TrackingPopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TrackingPopupContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </TrackingPopupContext.Provider>
  );
};

export const useTrackingPopup = () => {
  const ctx = useContext(TrackingPopupContext);
  if (!ctx) throw new Error('useTrackingPopup must be used within TrackingPopupProvider');
  return ctx;
};
