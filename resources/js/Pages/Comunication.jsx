import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    CheckCircleIcon,
    PaperClipIcon,
    ArrowPathIcon,
    ChatBubbleLeftRightIcon,
    ArrowLeftIcon,
    DocumentArrowDownIcon,
    XMarkIcon
} from "@heroicons/react/24/solid";
import { toast } from "sonner";

const DEFAULT_LOGO_PATH = "/SENA-LOGO.png";
const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/svg+xml"];

const DocInput = ({ name, placeholder, className = "", type = "text", ...props }) => (
    <input
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete="off"
        className={`bg-transparent border-0 border-b border-dashed border-gray-400 focus:border-[#0FB849] focus:outline-none placeholder-gray-300 px-1 transition-colors ${className}`}
        {...props}
    />
);

const DocArea = ({ name, placeholder, className = "", rows = 6, ...props }) => (
    <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        className={`w-full bg-transparent border border-dashed border-gray-300 focus:border-[#0FB849] focus:outline-none text-[11pt] placeholder-gray-300 p-2 resize-y leading-relaxed transition-colors ${className}`}
        style={{ fontFamily: "inherit" }}
        {...props}
    />
);

export default function Comunication({ pqrID }) {
    const { auth } = usePage().props;
    const initialUserLogoUrl = auth?.user?.pdf_logo_path ? `/storage/${auth.user.pdf_logo_path}` : DEFAULT_LOGO_PATH;
    
    const [comunication, setComunication] = useState({});
    const [pqr, setPqr] = useState({});
    const [dependency, setDependency] = useState({});
    const [attachments, setAttachments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // PDF specific states (Strictly Carta)
    const [logoPreviewUrl, setLogoPreviewUrl] = useState(initialUserLogoUrl);
    const [customLogoFile, setCustomLogoFile] = useState(null);
    const [signaturePreviewUrl, setSignaturePreviewUrl] = useState(null);
    const [customSignatureFile, setCustomSignatureFile] = useState(null);

    const logoInputRef = useRef(null);
    const signatureInputRef = useRef(null);

    useEffect(() => {
        async function fetchComunication() {
            try {
                // Detectamos si es respuesta pública (UUID alfanumérico) o interna (ID numérico)
                const isInternalId = !isNaN(pqrID);
                const endpoint = isInternalId 
                    ? `/api/pqr/response-details/${pqrID}` 
                    : `/api/pqr/responder/${pqrID}`;

                const res = await axios.get(endpoint);
                
                // Normalizamos la respuesta (ambos endpoints devuelven { data: { communication, pqr, dependency } })
                const data = res.data.data;
                setComunication(data.communication || {});
                setPqr(data.pqr || {});
                setDependency(data.dependency || {});
            } catch (e) {
                console.error(e);
                toast.error("No se pudo cargar la información o el enlace ha expirado.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchComunication();
    }, [pqrID]);

    const handleLogoChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
            toast.error("Solo se permiten imagenes PNG, JPG o SVG.");
            return;
        }
        setCustomLogoFile(file);
        setLogoPreviewUrl(URL.createObjectURL(file));
    };

    const handleSignatureChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setCustomSignatureFile(file);
        setSignaturePreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading("Generando PDF de respuesta...");

        try {
            const data = new FormData(e.target);
            data.append("pqr_id", pqrID);
            data.append("document_type", "carta"); // Force Carta
            
            if (customLogoFile) data.append("logo_file", customLogoFile);
            if (customSignatureFile) data.append("signature_file", customSignatureFile);

            // Archivos de soporte (opcional)
            attachments.forEach((file) => {
                data.append("support_files[]", file);
            });

            // Usamos el PdfController para generar y guardar el registro
            await axios.post(`/api/pdf/generate-response`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            
            toast.dismiss(toastId);
            toast.success("Respuesta enviada exitosamente.");
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            toast.dismiss(toastId);
            toast.error(error.response?.data?.error || "Error al enviar la respuesta.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-gray-500 font-medium animate-pulse">Cargando información...</p>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Head title="Respuesta Enviada" />
                <div className="bg-white rounded-3xl p-10 w-full max-w-md text-center shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-300">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircleIcon className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2 font-outfit">¡Respuesta enviada!</h1>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Tu respuesta ha sido registrada exitosamente en el sistema GeDocs con el documento PDF generado.
                    </p>
                    <Link href="/" className="btn btn-primary w-full text-white font-bold rounded-xl shadow-lg shadow-primary/20">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col pb-10">
            <Head title={`Responder PQR #${pqr.id}`} />

            {/* Toolbar superior */}
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors">
                        <ArrowLeftIcon className="size-4" />
                        Volver
                    </Link>
                    <div className="h-6 w-[1px] bg-gray-200" />
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-gray-400 leading-none">PQR Radicado</span>
                        <span className="font-bold text-gray-700">#{pqr.id} - {pqr.affair}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg uppercase tracking-wider">
                        Formato Carta
                    </div>

                    <button
                        type="submit"
                        form="responseForm"
                        disabled={isSubmitting}
                        className="btn btn-sm h-9 bg-primary text-white border-0 rounded-lg shadow-md shadow-primary/20 px-4 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <ArrowPathIcon className="size-4 animate-spin mr-2" />
                        ) : (
                            <DocumentArrowDownIcon className="size-4 mr-2" />
                        )}
                        {isSubmitting ? "Enviando..." : "Crear PDF y Responder"}
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 p-6">
                
                {/* Editor de Documento (Solo Carta) */}
                <form id="responseForm" onSubmit={handleSubmit} className="flex flex-col items-center">
                    <div 
                        className="bg-white shadow-2xl w-full max-w-[794px] min-h-[1123px] px-14 py-12 leading-relaxed text-[11pt] text-gray-900 border border-gray-200"
                        style={{ fontFamily: "'Helvetica', 'Arial', sans-serif" }}
                    >
                        {/* Area de Logo */}
                        <div className="mb-8 flex justify-between items-start">
                             <div className="relative inline-block group">
                                <button
                                    type="button"
                                    onClick={() => logoInputRef.current?.click()}
                                    className="relative rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
                                >
                                    <img src={logoPreviewUrl} alt="Logo" className="h-16 w-auto object-contain" />
                                    <span className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </button>
                                <input ref={logoInputRef} type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
                            </div>

                            <div className="text-right text-[10pt] text-gray-400">
                                <p>SISTEMA GEDOCS</p>
                                <p>Gestión de PQRs</p>
                            </div>
                        </div>

                        {/* Contenido Formato Carta */}
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="mb-6 space-y-3">
                                <DocInput name="codigo" placeholder="Código (Ej: GD-001)" className="w-44 text-[11pt]" />
                                <div className="flex flex-wrap gap-4">
                                    <DocInput name="lugar" placeholder="Lugar (Municipio)" className="flex-1 min-w-40" defaultValue={dependency.name || ""} />
                                    <DocInput name="fecha" type="date" className="text-gray-600" defaultValue={new Date().toISOString().split('T')[0]} />
                                </div>
                            </div>

                            <div className="my-8 space-y-2">
                                <DocInput name="tratamiento" placeholder="Tratamiento (Ej: Sr, Sra, Dr)" className="w-full" />
                                <DocInput name="nombres" placeholder="Nombres y apellidos del destinatario" className="w-full font-bold" defaultValue={pqr.sender_name || ""} />
                                <DocInput name="cargo" placeholder="Cargo (Opcional)" className="w-full" />
                                <DocInput name="empresa" placeholder="Empresa (Opcional)" className="w-full" />
                                <DocInput name="direccion" placeholder="Dirección" className="w-full" />
                                <DocInput name="ciudad" placeholder="Ciudad" className="w-full" />
                            </div>

                            <DocInput name="asunto" placeholder="Asunto de la respuesta" className="w-full font-bold mb-4" defaultValue={`Respuesta a PQR #${pqr.id}`} />
                            <DocInput name="saludo" placeholder="Cordial saludo," className="w-full mb-4" />
                            <DocArea name="texto" rows={12} placeholder="Redacte aquí la respuesta detallada a la solicitud..." className="text-justify mb-8" />
                            <DocInput name="despedida1" placeholder="Atentamente," className="w-full mb-16" />
                        </div>

                        {/* Firma */}
                        <div className="mt-10 mb-10 border-t border-gray-100 pt-8">
                             <div className="w-[250px] space-y-1">
                                <div className="relative group mb-2">
                                    <button
                                        type="button"
                                        onClick={() => signatureInputRef.current?.click()}
                                        className="relative rounded-md min-h-[50px] w-full flex items-center justify-center border border-dashed border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        {signaturePreviewUrl ? (
                                            <img src={signaturePreviewUrl} alt="Firma" className="h-12 w-auto object-contain" />
                                        ) : (
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Subir Firma</span>
                                        )}
                                    </button>
                                    <input ref={signatureInputRef} type="file" className="hidden" onChange={handleSignatureChange} accept="image/*" />
                                </div>
                                <div className="border-t border-gray-800 pt-2 space-y-1">
                                    <DocInput name="firma_nombres" placeholder="Nombre completo del firmante" className="w-full font-bold" defaultValue={auth.user?.name} />
                                    <DocInput name="firma_cargo" placeholder="Cargo del firmante" className="w-full" />
                                </div>
                            </div>
                        </div>

                        <div className="text-[9pt] text-gray-400 space-y-1">
                             <DocInput name="anexo" placeholder="Anexos (Opcional)" className="w-full text-[9pt]" />
                             <DocInput name="transcriptor" placeholder="Transcriptor / Redactor (Opcional)" className="w-full text-[9pt]" />
                        </div>

                        {/* Pie de página editable y centrado */}
                        <div className="mt-16 border-t border-gray-100 pt-4">
                             <DocArea 
                                name="footer_text" 
                                placeholder="Pie de página corporativo..." 
                                className="text-center text-[9pt] text-gray-400 border-0 italic" 
                                rows={2}
                                defaultValue={`SENA - Centro de comercio y servicios - Area de gestion documental\n© Gedocs ${new Date().getFullYear()}`}
                             />
                        </div>
                    </div>
                </form>

                {/* Sidebar de Ayuda y Archivos */}
                <div className="space-y-6">
                    
                    {/* Información de la PQR */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <ChatBubbleLeftRightIcon className="size-5 text-primary" />
                            Detalles de la PQR
                        </h3>
                        <div className="space-y-3">
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <span className="text-[10px] uppercase font-bold text-gray-400">Mensaje Original</span>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-6 italic">"{comunication.message}"</p>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Tipo:</span>
                                <span className="font-bold text-gray-700">{pqr.request_type}</span>
                            </div>
                        </div>
                    </div>

                    {/* Archivos de Soporte */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <PaperClipIcon className="size-5 text-gray-400" />
                            Anexar Soportes
                        </h3>
                        <p className="text-[10px] text-gray-400">Adjunte documentos adicionales (JPG, PNG, PDF).</p>
                        
                        <input
                            type="file"
                            multiple
                            onChange={(e) => setAttachments(Array.from(e.target.files))}
                            className="block w-full text-xs text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-xs file:font-semibold
                                file:bg-primary/10 file:text-primary
                                hover:file:bg-primary/20
                                cursor-pointer"
                        />

                        {attachments.length > 0 && (
                            <div className="space-y-2 mt-4">
                                {attachments.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100 italic text-[10px] text-gray-500">
                                        <span className="truncate max-w-[150px]">{file.name}</span>
                                        <button type="button" onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}>
                                            <XMarkIcon className="size-3 text-red-400" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Ayuda</h4>
                        <p className="text-xs text-primary/80 leading-relaxed">
                            Complete los datos de la carta para generar el documento oficial de respuesta. No olvide verificar la firma antes de enviar.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

