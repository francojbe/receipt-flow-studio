import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function PaymentResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const status = searchParams.get('status'); // 'approved', 'rejected', etc.

    // Note: In a real production app, you should verify the payment status via Webhook or backend check.
    // Relying solely on the URL parameter is not 100% secure, but sufficient for this MVP/Demo.

    const isSuccess = status === 'approved';

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="max-w-md w-full bg-card rounded-3xl shadow-ios-lg p-8 text-center border border-border/50 animate-fade-in">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isSuccess ? 'bg-emerald/10 text-emerald' : 'bg-red-500/10 text-red-500'}`}>
                    {isSuccess ? (
                        <CheckCircle className="w-10 h-10" />
                    ) : (
                        <XCircle className="w-10 h-10" />
                    )}
                </div>

                <h1 className="text-2xl font-bold text-foreground mb-2">
                    {isSuccess ? '¡Suscripción Exitosa!' : 'Pago no completado'}
                </h1>

                <p className="text-muted-foreground mb-8">
                    {isSuccess
                        ? 'Gracias por suscribirte al Plan Pro. Tu cuenta ha sido actualizada.'
                        : 'Hubo un problema con el pago. Por favor intenta nuevamente.'}
                </p>

                <button
                    onClick={() => navigate('/')}
                    className="w-full bg-secondary hover:bg-secondary/80 text-foreground font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                    <span>Volver al Inicio</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
