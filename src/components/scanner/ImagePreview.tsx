import { X, ArrowUp } from 'lucide-react';

interface ImagePreviewProps {
  imageSrc: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ImagePreview({ imageSrc, onConfirm, onCancel }: ImagePreviewProps) {
  return (
    <div className="flex flex-col items-center animate-fade-in w-full h-full">
      <div className="relative w-full flex-1 rounded-3xl overflow-hidden shadow-ios-lg mb-6 bg-foreground/95">
        <img
          src={imageSrc}
          alt="Vista previa"
          className="w-full h-full object-contain opacity-90"
        />
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 bg-background/20 backdrop-blur-md text-primary-foreground w-10 h-10 rounded-full hover:bg-background/30 flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <button
        onClick={onConfirm}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-full shadow-glow press-effect flex items-center justify-center gap-2 text-[17px] mb-4"
      >
        <span>Confirmar Foto</span>
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}
