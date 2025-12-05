import { useState } from 'react';
import { Zap, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function SubscriptionButton() {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('Debes iniciar sesión para suscribirte');
                return;
            }

            const { data, error } = await supabase.functions.invoke('create-subscription', {
                body: {
                    email: user.email,
                    userId: user.id
                }
            });

            if (error) throw error;

            if (data.error || data.success === false) {
                console.error('MP Error Details:', data.details);
                throw new Error(data.details?.message || data.error || 'Error desconocido');
            }

            if (data?.init_point) {
                window.location.href = data.init_point;
            } else {
                throw new Error('No se recibió el link de pago');
            }

        } catch (error: any) {
            console.error('Error:', error);
            toast.error('Error al iniciar la suscripción: ' + (error.message || 'Intenta nuevamente'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition-all active:scale-95 flex items-center justify-center gap-2"
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <>
                    <Zap className="w-5 h-5 fill-current" />
                    <span>Suscribirse - $5.000/mes</span>
                </>
            )}
        </button>
    );
}
