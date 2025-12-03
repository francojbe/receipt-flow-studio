import { Camera, Images, PenSquare, ChevronRight } from 'lucide-react';

interface UploadSectionProps {
  onCameraClick: () => void;
  onGalleryClick: () => void;
  onManualClick: () => void;
}

export function UploadSection({ onCameraClick, onGalleryClick, onManualClick }: UploadSectionProps) {
  return (
    <div className="flex flex-col gap-4 mt-4 animate-fade-in">
      <p className="text-center text-muted-foreground font-medium text-sm mb-2">
        Selecciona un método
      </p>

      <div className="grid grid-cols-2 gap-4">
        {/* Camera Button */}
        <button
          onClick={onCameraClick}
          className="flex flex-col items-center justify-center p-6 ios-card press-effect group h-40"
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Camera className="w-6 h-6" />
          </div>
          <span className="font-semibold text-foreground text-sm">Foto Boleta</span>
        </button>

        {/* Gallery Button */}
        <button
          onClick={onGalleryClick}
          className="flex flex-col items-center justify-center p-6 ios-card press-effect group h-40"
        >
          <div className="w-14 h-14 rounded-full bg-purple/10 text-purple flex items-center justify-center mb-3 group-hover:bg-purple group-hover:text-purple-foreground transition-colors">
            <Images className="w-6 h-6" />
          </div>
          <span className="font-semibold text-foreground text-sm">Galería</span>
        </button>

        {/* Manual Entry Button */}
        <button
          onClick={onManualClick}
          className="col-span-2 flex flex-row items-center gap-5 p-5 ios-card press-effect group"
        >
          <div className="w-12 h-12 rounded-full bg-warning/10 text-warning flex-shrink-0 flex items-center justify-center group-hover:bg-warning group-hover:text-warning-foreground transition-colors">
            <PenSquare className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="block font-semibold text-foreground text-base">Ingreso Manual</span>
            <span className="block text-muted-foreground text-xs mt-0.5">Sin comprobante físico</span>
          </div>
          <div className="ml-auto text-muted-foreground/50">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
}
