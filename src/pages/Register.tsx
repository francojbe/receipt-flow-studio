import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Lock, Mail, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;

            toast.success('Cuenta creada exitosamente. ¡Por favor verifica tu correo!');
            navigate('/');
        } catch (error: any) {
            toast.error(error.message || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background sm:bg-secondary/30 p-4">
            <main className="w-full max-w-md bg-background sm:bg-card sm:rounded-4xl sm:shadow-ios-lg overflow-hidden h-screen sm:h-[850px] flex flex-col relative border border-border/50 animate-fade-in">

                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-40 -left-20 w-40 h-40 bg-purple/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex-1 flex flex-col justify-center px-8 relative z-10">

                    {/* Header Section */}
                    <div className="mb-8 text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm transform -rotate-3">
                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg rotate-3">
                                <UserPlus className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                            Crear Cuenta
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Únete para gestionar tus ingresos
                        </p>
                    </div>

                    {/* Register Form */}
                    <form onSubmit={handleRegister} className="space-y-4">

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground ml-1">
                                Email
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="ejemplo@correo.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-secondary/50 border border-transparent focus:border-primary/20 focus:bg-background rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground ml-1">
                                Contraseña
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-secondary/50 border border-transparent focus:border-primary/20 focus:bg-background rounded-2xl py-4 pl-12 pr-12 text-sm font-medium outline-none transition-all shadow-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground ml-1">
                                Confirmar Contraseña
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full bg-secondary/50 border border-transparent focus:border-primary/20 focus:bg-background rounded-2xl py-4 pl-12 pr-12 text-sm font-medium outline-none transition-all shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-6"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <span>Registrarse</span>
                            )}
                        </button>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 text-center">
                    <p className="text-xs text-muted-foreground">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/" className="text-primary font-semibold hover:underline">
                            Inicia Sesión
                        </Link>
                    </p>
                </div>

            </main>
        </div>
    );
};

export default Register;
