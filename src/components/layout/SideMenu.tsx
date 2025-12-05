import { Drawer } from 'vaul';
import { LogOut, Sun, Moon, User, Menu, X, Pencil } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function SideMenu() {
    const { theme, setTheme } = useTheme();
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const [username, setUsername] = useState<string>('Usuario');
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');

    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                const { data } = await supabase
                    .from('profiles')
                    .select('nombre')
                    .eq('id', user.id)
                    .single();

                if (data?.nombre) {
                    setUsername(data.nombre);
                    setNewUsername(data.nombre);
                } else {
                    // Fallback to email username if no name set
                    const fallback = user.email?.split('@')[0] || 'Usuario';
                    setUsername(fallback);
                    setNewUsername(fallback);
                }
            };
            fetchProfile();
        }
    }, [user]);

    const handleSaveUsername = async () => {
        if (!newUsername.trim() || !user) return;

        const { error } = await supabase
            .from('profiles')
            .update({ nombre: newUsername, updated_at: new Date().toISOString() })
            .eq('id', user.id);

        if (!error) {
            setUsername(newUsername);
            setIsEditing(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/');
        setOpen(false);
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <Drawer.Root direction="right" open={open} onOpenChange={setOpen}>
            <Drawer.Trigger asChild>
                <button className="p-2 rounded-full hover:bg-secondary/80 transition-colors">
                    <Menu className="w-6 h-6 text-foreground" />
                </button>
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" />
                <Drawer.Content className="bg-background/80 backdrop-blur-xl flex flex-col rounded-l-[20px] h-full w-[75%] max-w-[260px] mt-24 fixed bottom-0 right-0 z-50 border-l border-white/20 shadow-2xl focus:outline-none">

                    {/* Header del Menú */}
                    <div className="p-6 border-b border-border/50 flex items-center justify-between">
                        <h2 className="text-lg font-bold">Menú</h2>
                        <Drawer.Close asChild>
                            <button className="p-2 rounded-full hover:bg-secondary/80 transition-colors">
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </Drawer.Close>
                    </div>

                    <div className="flex-1 flex flex-col p-6 gap-6">

                        {/* Perfil */}
                        <div className="flex items-center gap-4 bg-secondary/30 p-4 rounded-2xl">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <User className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newUsername}
                                            onChange={(e) => setNewUsername(e.target.value)}
                                            className="w-full bg-background border border-primary/50 rounded px-2 py-1 text-sm outline-none"
                                            autoFocus
                                            onBlur={handleSaveUsername}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between group cursor-pointer" onClick={() => setIsEditing(true)}>
                                        <p className="font-semibold text-foreground truncate capitalize">
                                            {username}
                                        </p>
                                        <Pencil className="w-3 h-3 text-muted-foreground/50 group-hover:text-primary transition-colors ml-2" />
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        {/* Opciones */}
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Configuración</p>

                            <button
                                onClick={toggleTheme}
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary/20 hover:bg-secondary/40 transition-all active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-3">
                                    {theme === 'dark' ? (
                                        <Moon className="w-5 h-5 text-purple" />
                                    ) : (
                                        <Sun className="w-5 h-5 text-orange-500" />
                                    )}
                                    <span className="font-medium">Tema</span>
                                </div>
                                <span className="text-xs text-muted-foreground capitalize">{theme === 'dark' ? 'Oscuro' : 'Claro'}</span>
                            </button>
                        </div>

                        <div className="mt-auto">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 p-4 rounded-xl text-destructive hover:bg-destructive/10 transition-all active:scale-[0.98]"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-semibold">Cerrar Sesión</span>
                            </button>
                        </div>

                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
