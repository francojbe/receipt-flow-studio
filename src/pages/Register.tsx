import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Lock, Mail, Check, Star, Shield, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
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
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (authError) throw authError;

            if (authData.user) {
                // Calculate trial dates
                const now = new Date();
                const trialEndDate = new Date();
                trialEndDate.setDate(now.getDate() + 30); // 30 days trial

                // Insert profile with subscription data
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: authData.user.id,
                        email: formData.email,
                        subscription_status: 'trial',
                        trial_start_date: now.toISOString(),
                        trial_end_date: trialEndDate.toISOString(),
                        plan_type: 'pro',
                        updated_at: now.toISOString(),
                        nombre: formData.username,
                        tipo: 'usuario',
                    });

                if (profileError) {
                    console.error('Error creating profile:', profileError);
                }
            }

            toast.success('Cuenta creada exitosamente. ¡Por favor verifica tu correo!');
            navigate('/');
        } catch (error: any) {
            toast.error(error.message || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background sm:bg-secondary/30 p-4 font-sans">
            <main className="w-full max-w-5xl bg-background sm:bg-card sm:rounded-4xl sm:shadow-ios-lg overflow-hidden min-h-[600px] flex flex-col md:flex-row border border-border/50 animate-fade-in">

                {/* Left Panel: Subscription/Value Prop */}
                <div className="md:w-1/2 bg-primary/5 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
                    {/* Decorative blobs */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6">
                            <Star className="w-3 h-3 fill-current" />
                            <span>PLAN PRO</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Gestiona tus ingresos como un experto
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8">
                            Obtén acceso completo a todas las herramientas de análisis y reportes avanzados.
                        </p>

                        <div className="space-y-4 mb-8">
                            {[
                                'Reportes ilimitados',
                                'Análisis de tendencias con IA',
                                'Exportación a Excel y PDF',
                                'Soporte prioritario 24/7'
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald/10 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-4 h-4 text-emerald" />
                                    </div>
                                    <span className="text-foreground/80 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 bg-background/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Precio Mensual</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-foreground">$5.000</span>
                                    <span className="text-sm text-muted-foreground">/mes</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="inline-block px-3 py-1 bg-emerald text-white text-xs font-bold rounded-lg shadow-sm animate-pulse">
                                    1 MES GRATIS
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                            <Shield className="w-3 h-3" />
                            Sin cobros automáticos durante la prueba.
                        </p>
                    </div>
                </div>

                {/* Right Panel: Registration Form */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-background relative">
                    <div className="max-w-sm mx-auto w-full">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                                Crea tu cuenta
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Comienza tu prueba gratuita de 30 días hoy.
                            </p>
                        </div>

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
                                    Nombre de Usuario
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                        <UserPlus className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Tu nombre de usuario"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                                    <>
                                        <span>Comenzar Prueba Gratis</span>
                                        <Zap className="w-4 h-4 fill-current" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-xs text-muted-foreground">
                                ¿Ya tienes una cuenta?{' '}
                                <Link to="/" className="text-primary font-semibold hover:underline">
                                    Inicia Sesión
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Register;
