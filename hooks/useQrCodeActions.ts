import { useCallback, useState } from 'react';

interface QrCodeActionsResult {
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  handleDownloadQR: () => Promise<boolean>;
  handleCopyQR: () => Promise<boolean>;
  handleShareQR: () => Promise<boolean>;
}

interface QrCodeActionsOptions {
  onDownloadSuccess?: () => void;
  onDownloadError?: (error: string) => void;
  onCopySuccess?: () => void;
  onCopyError?: (error: string) => void;
  onShareSuccess?: () => void;
  onShareError?: (error: string) => void;
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export function useQrCodeActions(
  qrCodeUrl: string,
  options: QrCodeActionsOptions = {}
): QrCodeActionsResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    onDownloadSuccess,
    onDownloadError,
    onCopySuccess,
    onCopyError,
    onShareSuccess,
    onShareError,
  } = options;

  const handleDownloadQR = useCallback((): Promise<boolean> => {
    if (!qrCodeUrl || !isValidUrl(qrCodeUrl)) {
      const errorMessage = 'Invalid QR code URL provided';
      setError(errorMessage);
      onDownloadError?.(errorMessage);
      return Promise.resolve(false);
    }

    setIsLoading(true);
    setError(null);

    try {
      const link = document.createElement('a');
      link.download = `payment-qr-${Date.now()}.png`;
      link.href = qrCodeUrl;
      link.click();

      onDownloadSuccess?.();
      return Promise.resolve(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to download QR code';
      setError(errorMessage);
      onDownloadError?.(errorMessage);
      return Promise.resolve(false);
    } finally {
      setIsLoading(false);
    }
  }, [qrCodeUrl, onDownloadSuccess, onDownloadError]);

  const handleCopyQR = useCallback(async (): Promise<boolean> => {
    if (!qrCodeUrl || !isValidUrl(qrCodeUrl)) {
      const errorMessage = 'Invalid QR code URL provided';
      setError(errorMessage);
      onCopyError?.(errorMessage);
      return false;
    }

    // Check if clipboard API is supported
    if (!navigator.clipboard || !navigator.clipboard.write) {
      const errorMessage = 'Clipboard API not supported in this browser';
      setError(errorMessage);
      onCopyError?.(errorMessage);
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(qrCodeUrl);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch QR code: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();

      if (!blob.type.startsWith('image/')) {
        throw new Error('Invalid image format received');
      }

      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);

      onCopySuccess?.();
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to copy QR code to clipboard';
      setError(errorMessage);
      onCopyError?.(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [qrCodeUrl, onCopySuccess, onCopyError]);

  const handleShareQR = useCallback(async (): Promise<boolean> => {
    if (!qrCodeUrl || !isValidUrl(qrCodeUrl)) {
      const errorMessage = 'Invalid QR code URL provided';
      setError(errorMessage);
      onShareError?.(errorMessage);
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = window.location.href;
      const text = 'Pozrite si tento QR kód:';
      const shareData = {
        title: 'QR kód',
        text,
        url,
      };

      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        onShareSuccess?.();
        return true;
      }

      // Fallback: copy URL to clipboard
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        onShareSuccess?.();
        return true;
      }

      throw new Error('Web Share API and Clipboard API not supported');
    } catch (error) {
      // Handle user cancellation separately (not an error)
      if (error instanceof Error && error.name === 'AbortError') {
        return false; // User cancelled, not an error
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to share QR code';
      setError(errorMessage);
      onShareError?.(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [qrCodeUrl, onShareSuccess, onShareError]);

  return {
    isLoading,
    isError: error !== null,
    error,
    handleDownloadQR,
    handleCopyQR,
    handleShareQR,
  };
}
