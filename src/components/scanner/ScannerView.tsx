import { useRef, useState } from 'react';
import { UploadSection } from './UploadSection';
import { ManualEntryForm } from './ManualEntryForm';
import { ImagePreview } from './ImagePreview';
import { FeedbackModal } from './FeedbackModal';
import { uploadImage, submitManualEntry } from '@/services/api';

type ViewState = 'upload' | 'manual' | 'preview' | 'feedback';
type FeedbackState = 'loading' | 'success' | 'error';

export function ScannerView() {
  const [viewState, setViewState] = useState<ViewState>('upload');
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState('');
  
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewSrc(e.target?.result as string);
        setViewState('preview');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageConfirm = async () => {
    if (!selectedFile) return;

    setViewState('feedback');
    setFeedbackState('loading');

    try {
      const success = await uploadImage(selectedFile);
      if (success) {
        setFeedbackState('success');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setFeedbackState('error');
      setErrorMessage('Error de conexión.');
    }
  };

  const handleManualSubmit = async (data: { amount: string; date: string; merchant: string }) => {
    setViewState('feedback');
    setFeedbackState('loading');

    try {
      const success = await submitManualEntry({
        monto: data.amount,
        fecha: data.date,
        comercio: data.merchant,
        tipo: 'Efectivo',
      });

      if (success) {
        setFeedbackState('success');
      } else {
        throw new Error('Submit failed');
      }
    } catch (error) {
      console.error('Manual submit error:', error);
      setFeedbackState('error');
      setErrorMessage('Error de conexión.');
    }
  };

  const resetApp = () => {
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    setSelectedFile(null);
    setPreviewSrc('');
    setViewState('upload');
    setErrorMessage('');
  };

  return (
    <section className="flex flex-col h-full pt-2">
      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {viewState === 'upload' && (
        <UploadSection
          onCameraClick={() => cameraInputRef.current?.click()}
          onGalleryClick={() => galleryInputRef.current?.click()}
          onManualClick={() => setViewState('manual')}
        />
      )}

      {viewState === 'manual' && (
        <ManualEntryForm
          onSubmit={handleManualSubmit}
          onCancel={resetApp}
        />
      )}

      {viewState === 'preview' && (
        <ImagePreview
          imageSrc={previewSrc}
          onConfirm={handleImageConfirm}
          onCancel={resetApp}
        />
      )}

      {viewState === 'feedback' && (
        <FeedbackModal
          state={feedbackState}
          errorMessage={errorMessage}
          onAccept={resetApp}
          onRetry={resetApp}
        />
      )}
    </section>
  );
}
