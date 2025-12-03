import { Check, X } from 'lucide-react';

type FeedbackState = 'loading' | 'success' | 'error';

interface FeedbackModalProps {
  state: FeedbackState;
  errorMessage?: string;
  onAccept: () => void;
  onRetry: () => void;
}

export function FeedbackModal({ state, errorMessage, onAccept, onRetry }: FeedbackModalProps) {
  return (
    <div className="absolute inset-0 bg-card/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-8 animate-fade-in">
      {state === 'loading' && (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="loader mb-6 w-12 h-12 border-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">Procesando</h3>
          <p className="text-muted-foreground">Guardando tu registro...</p>
        </div>
      )}

      {state === 'success' && (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm">
            <Check className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">¡Listo!</h3>
          <p className="text-muted-foreground mb-8">El ingreso se registró correctamente.</p>
          <button
            onClick={onAccept}
            className="px-8 py-3 bg-secondary text-foreground font-semibold rounded-full hover:bg-secondary/80 transition-colors"
          >
            Aceptar
          </button>
        </div>
      )}

      {state === 'error' && (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm">
            <X className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Error</h3>
          <p className="text-muted-foreground mb-8">{errorMessage || 'Algo salió mal.'}</p>
          <button
            onClick={onRetry}
            className="px-8 py-3 bg-foreground text-background font-semibold rounded-full hover:bg-foreground/90 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
