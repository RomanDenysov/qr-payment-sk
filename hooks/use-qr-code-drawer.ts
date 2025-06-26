import { create } from 'zustand';

type QrCodeDrawerState = {
  isOpen: boolean;
  qrCodeUrl: string;
};

type QrCodeDrawerActions = {
  setIsOpen: (isOpen: boolean) => void;
  setQrCodeUrl: (qrCodeUrl: string) => void;
};

const initialState: QrCodeDrawerState = {
  isOpen: false,
  qrCodeUrl: '',
};

export const useQrCodeDrawer = create<QrCodeDrawerState & QrCodeDrawerActions>(
  (set) => ({
    ...initialState,
    setIsOpen: (isOpen) => set({ isOpen }),
    setQrCodeUrl: (qrCodeUrl) => set({ qrCodeUrl }),
  })
);
