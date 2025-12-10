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
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Menu className="w-6 h-6 text-brand-dark" />
                </button>
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                <Drawer.Content className="bg-white flex flex-col rounded-l-[2rem] h-full w-[85%] max-w-[300px] mt-0 fixed bottom-0 right-0 z-50 shadow-2xl focus:outline-none">

                    {/* Header del Menú */}
                    <div className="p-6 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-brand-dark">Menú</h2>
                        <Drawer.Close asChild>
                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </Drawer.Close>
                    </div>

                    <div className="flex-1 flex flex-col px-6 gap-6">

                        {/* Perfil */}
                        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                            <div className="w-12 h-12 rounded-full bg-brand-lime flex items-center justify-center text-brand-dark flex-shrink-0 font-bold text-lg">
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newUsername}
                                            onChange={(e) => setNewUsername(e.target.value)}
                                            className="w-full bg-white border border-brand-lime rounded-lg px-2 py-1 text-sm outline-none text-brand-dark font-semibold"
                                            autoFocus
                                            onBlur={handleSaveUsername}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between group cursor-pointer" onClick={() => setIsEditing(true)}>
                                        <p className="font-bold text-brand-dark truncate capitalize">
                                            {username}
                                        </p>
                                        <Pencil className="w-3 h-3 text-gray-400 group-hover:text-brand-dark transition-colors ml-2" />
                                    </div>
                                )}
                                <p className="text-xs text-gray-400 truncate font-medium">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        {/* Opciones */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Configuración</p>

                            {/* Theme Toggle - disabled for now as we are enforcing a specific style, but kept for logic */}
                            {/* 
                            <button
                                onClick={toggleTheme}
                                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-3">
                                    {theme === 'dark' ? (
                                        <Moon className="w-5 h-5 text-purple" />
                                    ) : (
                                        <Sun className="w-5 h-5 text-orange-500" />
                                    )}
                                    <span className="font-semibold text-brand-dark">Tema</span>
                                </div>
                                <span className="text-xs text-gray-400 capitalize bg-white px-2 py-1 rounded-full border border-gray-100">{theme === 'dark' ? 'Oscuro' : 'Claro'}</span>
                            </button> 
                            */}

                            <div className="p-4 rounded-2xl bg-gray-50 text-sm text-gray-500 border border-gray-100">
                                <p>Modo claro activado por defecto para este diseño.</p>
                            </div>
                        </div>

                        <div className="mt-auto mb-8">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-3 p-4 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-all active:scale-[0.98] font-bold"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>

                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
