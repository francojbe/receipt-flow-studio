import { useState } from 'react';
import { X } from 'lucide-react';
import { getCurrentDateTimeLocal } from '@/utils/formatters';

interface ManualEntryFormProps {
  onSubmit: (data: { amount: string; date: string; merchant: string }) => void;
  onCancel: () => void;
}

export function ManualEntryForm({ onSubmit, onCancel }: ManualEntryFormProps) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getCurrentDateTimeLocal());
  const [merchant, setMerchant] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ amount, date, merchant });
  };

  return (
    <div className="flex flex-col animate-fade-in w-full h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-brand-dark text-lg">Detalles del Ingreso</h3>
        <button
          onClick={onCancel}
          className="w-8 h-8 rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
        {/* Amount Input */}
        <div className="ios-card p-4">
          <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
            Monto
          </label>
          <div className="flex items-center">
            <span className="text-2xl text-white/60 font-light mr-2">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="0"
              className="w-full bg-transparent text-3xl font-bold text-white placeholder:text-white/30 focus:outline-none"
            />
          </div>
        </div>

        {/* Date and Merchant Group */}
        <div className="ios-card overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">
              Fecha y Hora
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-transparent text-base text-white focus:outline-none font-medium [color-scheme:dark]"
            />
          </div>
          <div className="p-4">
            <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">
              Cliente / Comercio
            </label>
            <input
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              required
              placeholder="Ej: Juan Pérez"
              className="w-full bg-transparent text-base text-white placeholder:text-white/30 focus:outline-none font-medium"
            />
          </div>
        </div>

        <div className="mt-auto pb-4">
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-full shadow-glow press-effect flex items-center justify-center gap-2 text-[17px]"
          >
            <span>Registrar</span>
          </button>
        </div>
      </form>
    </div>
  );
}
