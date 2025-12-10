import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Lock, Mail, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ModeToggle } from '@/components/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Login = () => {
    const navigate = useNavigate();
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        if (session) {
            navigate('/app');
        }
    }, [session, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;

            toast.success('Bienvenido de nuevo');
            navigate('/app');
        } catch (error: any) {
            toast.error(error.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 font-sans relative overflow-auto">
            {/* Background Image with Effects */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: "url('/register-bg.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Overlay for translucency and shine */}
                <div className="absolute inset-0 bg-white/40 bg-gradient-to-br from-white/50 to-transparent backdrop-brightness-110" />
            </div>

            <main className="w-full max-w-sm flex flex-col items-center justify-center animate-fade-in relative z-10 bg-white/30 backdrop-blur-lg rounded-[2.5rem] shadow-2xl border border-white/50 p-6 sm:p-8 min-h-[750px]">
                <div className="w-full">
                    {/* Header */}
                    <div className="mb-8 flex flex-col items-center text-center pt-2">
                        <Avatar className="w-20 h-20 mb-4 border-2 border-brand-lime shadow-lg">
                            <AvatarImage src="/default-avatar.png" className="object-cover" />
                            <AvatarFallback className="bg-gray-100 text-3xl font-bold text-brand-dark">
                                <User className="w-8 h-8 text-gray-400" />
                            </AvatarFallback>
                        </Avatar>
                        <h1 className="text-3xl font-bold tracking-tight text-brand-dark mb-2">
                            Bienvenido
                        </h1>
                        <p className="text-gray-500 font-medium">Inicia sesión ahora!</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1">
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-dark transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white border border-gray-200 focus:border-brand-dark focus:bg-white rounded-full py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition-all placeholder:text-gray-400 text-brand-dark"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-dark transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Contraseña"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white border border-gray-200 focus:border-brand-dark focus:bg-white rounded-full py-3.5 pl-12 pr-12 text-sm font-medium outline-none transition-all placeholder:text-gray-400 text-brand-dark"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-xs font-semibold text-gray-500 hover:text-brand-dark transition-colors underline decoration-transparent hover:decoration-brand-dark">
                                ¿Olvidaste la contraseña?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-dark hover:opacity-90 text-white font-bold py-3.5 rounded-full shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-6"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <span>Continuar</span>
                            )}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <div className="h-[1px] bg-gray-300/50 flex-1"></div>
                        <span className="text-xs text-gray-400 font-medium">o</span>
                        <div className="h-[1px] bg-gray-300/50 flex-1"></div>
                    </div>

                    <div className="space-y-4">
                        <button type="button" className="w-full bg-gray-100/80 hover:bg-gray-200 text-brand-dark font-semibold py-4 rounded-full transition-all flex items-center justify-center gap-3 active:scale-[0.99]">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4" /><path d="M12.24 24.0008C15.4766 24.0008 18.2059 22.9382 20.19 21.1039L16.323 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.24 24.0008Z" fill="#34A853" /><path d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.5166C-0.18551 10.0056 -0.18551 14.0004 1.5166 17.3912L5.50253 14.3003Z" fill="#FBBC05" /><path d="M12.24 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.24 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50253 9.70575C6.45064 6.86173 9.10947 4.74966 12.24 4.74966Z" fill="#EA4335" /></svg>
                            <span>Continuar con Google</span>
                        </button>

                        <button type="button" className="w-full bg-brand-lime hover:opacity-90 text-brand-dark font-semibold py-4 rounded-full transition-all flex items-center justify-center gap-3 active:scale-[0.99] shadow-md shadow-brand-lime/20">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.56-2.07-.54-3.2.04-1.44.71-2.48.56-3.76-.79-2.73-2.87-3.08-7.96.11-10.7 1.48-1.27 3.32-1.35 4.76-.32.65.46 1.34.46 1.94.02 1.35-.97 3.25-.62 4.67.74.88.84 1.48.86 1.48.91-.04.03-.89.54-1.23 1.07-1.12 1.77-.92 2.87.5 3.48.14.07-.94 3.05-2.06 5.2zm-2.96-15.6c.64-1.28 1.91-2.12 3.11-2.05.02.16.03.34.03.53 0 1.25-.65 2.65-1.74 3.33-.92.57-2.14.77-3.13.43-.03-1.02.66-1.79 1.73-2.24z" /></svg>
                            <span>Continuar con Apple</span>
                        </button>

                        <button type="button" className="w-full bg-gray-100/80 hover:bg-gray-200 text-brand-dark font-semibold py-4 rounded-full transition-all flex items-center justify-center gap-3 active:scale-[0.99]">
                            <span className="w-5 h-5 flex items-center justify-center">👤</span>
                            <span>Continuar como Invitado</span>
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-white font-medium">
                            ¿Necesitas una cuenta?{' '}
                            <Link to="/register" className="text-brand-dark font-extrabold hover:text-white hover:underline transition-colors">
                                Regístrate
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
