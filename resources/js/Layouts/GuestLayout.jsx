import { usePage } from '@inertiajs/react';
import ToastMessage from '@/Components/ToastMessage.jsx';

export default function GuestLayout({children}) {
    const { url } = usePage();
    const isRegisterPage = url === '/register';


    return (
        <div className="h-dvh overflow-hidden bg-linear-to-br from-primary/95 via-primary to-secondary md:bg-none md:bg-white">
            <div className="grid h-full w-full grid-cols-1 lg:grid-cols-[1.2fr_1fr] xl:grid-cols-[1.35fr_1fr]">
                <aside className="relative hidden h-full overflow-hidden bg-linear-to-br from-primary/95 via-primary to-secondary lg:grid lg:grid-rows-[auto_1fr_auto] lg:gap-5 lg:p-8 xl:gap-6 xl:p-12">
                    <div className="absolute -right-16 top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -left-12 bottom-8 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

                    <img src="/gedocs-logo-white.svg" alt="GeDocs" className="relative z-10 h-14 w-auto" />

                    <div className="relative z-10 min-h-0 flex items-center justify-center">
                        <div className="w-full max-w-2xl rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur-xs xl:p-6">
                            <img src="/images/OBJECTS.svg" alt="Ilustracion GeDocs" className="mx-auto h-auto max-h-[45dvh] w-full max-w-xl object-contain xl:max-h-[54dvh]" />
                        </div>
                    </div>

                    <div className="relative z-10 flex justify-start">
                        <div className="inline-flex rounded-full border border-white/30 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
                            {isRegisterPage ? 'Registro' : 'Acceso'}
                        </div>
                    </div>
                </aside>

                <main className="flex h-full items-start justify-center overflow-hidden p-4 sm:p-6 lg:items-center lg:p-10 xl:p-14">
                    <div className={`w-full max-w-md space-y-4 overflow-hidden xl:max-w-lg ${isRegisterPage ? 'h-full' : ''}`}>
                        <div className="flex items-center justify-center lg:hidden">
                            <img src="/gedocs-logo-white.svg" alt="GeDocs" className="h-14 w-auto" />
                        </div>

                        <div className={`rounded-2xl border border-white/65 bg-white/85 p-5 shadow-lg shadow-black/10 backdrop-blur-xs sm:p-7 md:border-slate-200 md:bg-white md:shadow-sm md:backdrop-blur-none xl:p-8 ${isRegisterPage ? 'flex h-[calc(100dvh-11rem)] min-h-0 flex-col lg:h-[calc(100dvh-8rem)]' : ''}`}>
                            <div className={isRegisterPage ? 'min-h-0 flex-1 overflow-y-auto pr-1' : ''}>
                                {children}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <ToastMessage />
        </div>
    );
}
