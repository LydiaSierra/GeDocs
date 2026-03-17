import React, { useMemo, useState } from "react";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { router } from "@inertiajs/react";
import { DocumentArrowDownIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import api from "@/lib/axios";
import { toast } from "sonner";

const DOCUMENT_TYPES = [
    { value: "carta", label: "Carta" },
    { value: "circular", label: "Circular" },
    { value: "acta", label: "Acta" },
    { value: "informe", label: "Informe" },
    { value: "constancia", label: "Constancia" },
];

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

const EditableList = ({ title, items, setItems, placeholder, numbered = false, multiline = false }) => {
    const updateItem = (index, value) => {
        const clone = [...items];
        clone[index] = value;
        setItems(clone);
    };

    const addItem = () => setItems([...items, ""]);

    const removeItem = (index) => {
        if (items.length === 1) return;
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <section className="mb-6">
            <p className="text-[11pt] font-bold mb-2">{title}</p>
            <div className="space-y-2">
                {items.map((item, index) => (
                    <div key={`${title}-${index}`} className="flex items-start gap-2">
                        {numbered ? (
                            <span className="text-sm font-bold text-gray-500 pt-2 min-w-6">{index + 1}.</span>
                        ) : (
                            <span className="text-sm font-bold text-gray-400 pt-2 min-w-6">-</span>
                        )}

                        {multiline ? (
                            <textarea
                                value={item}
                                onChange={(e) => updateItem(index, e.target.value)}
                                rows={2}
                                placeholder={placeholder}
                                className="flex-1 bg-transparent border border-dashed border-gray-300 focus:border-[#0FB849] focus:outline-none placeholder-gray-300 px-2 py-1 transition-colors"
                                style={{ fontFamily: "inherit" }}
                            />
                        ) : (
                            <DocInput
                                value={item}
                                onChange={(e) => updateItem(index, e.target.value)}
                                placeholder={placeholder}
                                className="flex-1 text-[11pt]"
                            />
                        )}

                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-xs px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
                        >
                            Quitar
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addItem}
                className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-bold"
            >
                + Agregar linea
            </button>
        </section>
    );
};

export default function CreatePDF() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [documentType, setDocumentType] = useState("carta");

    const [actaAsistentes, setActaAsistentes] = useState([""]);
    const [actaInvitados, setActaInvitados] = useState([""]);
    const [actaAusentes, setActaAusentes] = useState([""]);
    const [actaOrdenDia, setActaOrdenDia] = useState([""]);
    const [actaDesarrollo, setActaDesarrollo] = useState([""]);

    const [informeElaboradoPor, setInformeElaboradoPor] = useState([""]);
    const [informeObjetivos, setInformeObjetivos] = useState([""]);
    const [informeConclusiones, setInformeConclusiones] = useState([""]);
    const [informeRecomendaciones, setInformeRecomendaciones] = useState([""]);

    const selectedTypeLabel = useMemo(
        () => DOCUMENT_TYPES.find((type) => type.value === documentType)?.label || "Documento",
        [documentType]
    );

    const syncActaDesarrolloLength = (nextOrdenDia) => {
        setActaDesarrollo((prev) => {
            const next = [...prev];
            if (nextOrdenDia.length > next.length) {
                return [...next, ...Array(nextOrdenDia.length - next.length).fill("")];
            }
            return next.slice(0, nextOrdenDia.length);
        });
    };

    const updateActaOrdenDiaItem = (index, value) => {
        const next = [...actaOrdenDia];
        next[index] = value;
        setActaOrdenDia(next);
        syncActaDesarrolloLength(next);
    };

    const addActaOrdenDiaItem = () => {
        const next = [...actaOrdenDia, ""];
        setActaOrdenDia(next);
        syncActaDesarrolloLength(next);
    };

    const removeActaOrdenDiaItem = (index) => {
        if (actaOrdenDia.length === 1) return;
        const next = actaOrdenDia.filter((_, i) => i !== index);
        setActaOrdenDia(next);
        syncActaDesarrolloLength(next);
    };

    const updateActaDesarrolloItem = (index, value) => {
        const next = [...actaDesarrollo];
        next[index] = value;
        setActaDesarrollo(next);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsGenerating(true);
        const toastId = toast.loading("Generando PDF...");

        try {
            const form = new FormData(e.target);
            const data = Object.fromEntries(form.entries());

            const response = await api.post("/generate-pdf", data, {
                responseType: "blob",
            });

            if (response.data.type === "application/json") {
                const text = await response.data.text();
                const errorData = JSON.parse(text);
                throw new Error(errorData.error || "Error desconocido en el servidor");
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = `${documentType}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);

            toast.dismiss(toastId);
            toast.success("PDF generado correctamente");
        } catch (error) {
            toast.dismiss(toastId);

            let errorMessage = "No se pudo generar el PDF";
            if (error.response?.data instanceof Blob) {
                const text = await error.response.data.text();
                try {
                    const json = JSON.parse(text);
                    errorMessage = json.error || errorMessage;
                } catch {
                    errorMessage = text || errorMessage;
                }
            } else {
                errorMessage = error.message || errorMessage;
            }

            toast.error(errorMessage);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="h-full overflow-y-auto bg-gray-100 flex flex-col">
                <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 py-3">
                    <button
                        type="button"
                        onClick={() => router.visit(route("explorer"))}
                        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0FB849] transition-colors"
                    >
                        <ArrowLeftIcon className="size-4" />
                        Volver al Explorador
                    </button>

                    <div className="flex items-center gap-3 flex-wrap justify-end">
                        <span className="text-sm font-bold text-gray-600 hidden sm:block">
                            Seleccionar tipo de documento
                        </span>
                        <select
                            name="document_type"
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                            className="h-10 min-w-44 rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700 focus:border-primary focus:outline-none"
                        >
                            {DOCUMENT_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            form="pdfForm"
                            disabled={isGenerating}
                            className="btn bg-primary text-white border-0 rounded-xl shadow-lg shadow-primary/20 px-6 disabled:opacity-50"
                        >
                            <DocumentArrowDownIcon className="size-5 mr-2" />
                            {isGenerating ? "Generando..." : "Generar PDF"}
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex items-start justify-center p-6 sm:p-10 pb-16">
                    <form
                        id="pdfForm"
                        onSubmit={handleSubmit}
                        className="bg-white shadow-2xl w-full max-w-[794px] min-h-[1123px] px-14 py-12 leading-relaxed text-[11pt] text-gray-900"
                        style={{ fontFamily: "'Helvetica', 'Arial', sans-serif" }}
                    >
                        <input type="hidden" name="document_type" value={documentType} />
                        <input type="hidden" name="acta_asistentes_json" value={JSON.stringify(actaAsistentes)} />
                        <input type="hidden" name="acta_invitados_json" value={JSON.stringify(actaInvitados)} />
                        <input type="hidden" name="acta_ausentes_json" value={JSON.stringify(actaAusentes)} />
                        <input type="hidden" name="acta_orden_dia_json" value={JSON.stringify(actaOrdenDia)} />
                        <input type="hidden" name="acta_desarrollo_json" value={JSON.stringify(actaDesarrollo)} />
                        <input type="hidden" name="informe_elaborado_por_json" value={JSON.stringify(informeElaboradoPor)} />
                        <input type="hidden" name="informe_objetivos_json" value={JSON.stringify(informeObjetivos)} />
                        <input type="hidden" name="informe_conclusiones_json" value={JSON.stringify(informeConclusiones)} />
                        <input type="hidden" name="informe_recomendaciones_json" value={JSON.stringify(informeRecomendaciones)} />

                        <div className="flex w-full h-3.5 mb-10">
                            <div className="w-[30%] h-full bg-[#0FB849]" />
                            <div className="w-[40%] h-full bg-[#2c3e50]" />
                            <div className="w-[30%] h-full bg-[#0FB849]" />
                        </div>

                        <div className="text-center underline font-bold text-[14pt] mb-12 text-gray-800 leading-snug">
                            SENA - Centro de comercio y servicios - Regional Pereira
                            <br />
                            {selectedTypeLabel}
                        </div>

                        {documentType === "carta" && (
                            <>
                                <div className="mb-6 space-y-3">
                                    <DocInput name="codigo" placeholder="Codigo" className="w-44 text-[11pt]" />
                                    <div className="flex flex-wrap gap-4 mt-1">
                                        <DocInput name="lugar" placeholder="Lugar" className="flex-1 min-w-40 text-[11pt]" />
                                        <DocInput name="fecha" type="date" className="text-[11pt] text-gray-600" />
                                    </div>
                                </div>

                                <div className="my-8 space-y-2">
                                    <DocInput name="tratamiento" placeholder="Tratamiento" className="w-full text-[11pt]" />
                                    <DocInput name="nombres" placeholder="Nombres y apellidos" className="w-full text-[11pt] font-bold" />
                                    <DocInput name="cargo" placeholder="Cargo" className="w-full text-[11pt]" />
                                    <DocInput name="empresa" placeholder="Empresa" className="w-full text-[11pt]" />
                                    <DocInput name="direccion" placeholder="Direccion" className="w-full text-[11pt]" />
                                    <DocInput name="ciudad" placeholder="Ciudad" className="w-full text-[11pt]" />
                                </div>

                                <DocInput name="asunto" placeholder="Asunto" className="w-full text-[11pt] mb-4" />
                                <DocInput name="saludo" placeholder="Saludo" className="w-full text-[11pt] mb-4" />
                                <DocArea name="texto" rows={10} placeholder="Cuerpo de la carta" className="text-justify mb-8" />
                                <DocInput name="despedida1" placeholder="Despedida" className="w-full text-[11pt] mb-16" />

                                <div className="mt-8 mb-10">
                                    <div className="w-[250px] border-t border-gray-800 pt-2 space-y-1">
                                        <DocInput name="firma_nombres" placeholder="Nombres y apellidos del firmante" className="w-full text-[11pt] font-bold" />
                                        <DocInput name="firma_cargo" placeholder="Cargo del firmante" className="w-full text-[11pt]" />
                                    </div>
                                </div>

                                <div className="mt-10 text-[10pt] space-y-2">
                                    <DocInput name="anexo" placeholder="Anexo" className="w-full text-[10pt]" />
                                    <DocInput name="copia" placeholder="Copia" className="w-full text-[10pt]" />
                                    <DocInput name="redactor" placeholder="Redactor" className="w-full text-[10pt]" />
                                    <DocInput name="transcriptor" placeholder="Transcriptor" className="w-full text-[10pt]" />
                                </div>
                            </>
                        )}

                        {documentType === "circular" && (
                            <>
                                <DocInput name="titulo" placeholder="Titulo" className="w-full text-center text-[13pt] font-bold mb-8" />
                                <div className="mb-6 space-y-3">
                                    <DocInput name="codigo" placeholder="Codigo" className="w-44 text-[11pt]" />
                                    <div className="flex flex-wrap gap-4 mt-1">
                                        <DocInput name="lugar" placeholder="Lugar" className="flex-1 min-w-40 text-[11pt]" />
                                        <DocInput name="fecha" type="date" className="text-[11pt] text-gray-600" />
                                    </div>
                                </div>
                                <DocInput name="grupo_destinatario" placeholder="Grupo destinatario" className="w-full text-[11pt] mb-4" />
                                <DocInput name="asunto" placeholder="Asunto" className="w-full text-[11pt] mb-4" />
                                <DocInput name="saludo" placeholder="Saludo" className="w-full text-[11pt] mb-4" />
                                <DocArea name="texto" rows={10} placeholder="Cuerpo de la circular" className="text-justify mb-8" />
                                <DocInput name="despedida1" placeholder="Despedida" className="w-full text-[11pt] mb-16" />

                                <div className="mt-8 mb-10">
                                    <div className="w-[250px] border-t border-gray-800 pt-2 space-y-1">
                                        <DocInput name="firma_nombres" placeholder="Nombres y apellidos del firmante" className="w-full text-[11pt] font-bold" />
                                        <DocInput name="firma_cargo" placeholder="Cargo del firmante" className="w-full text-[11pt]" />
                                    </div>
                                </div>

                                <div className="mt-10 text-[10pt] space-y-2">
                                    <DocInput name="anexo" placeholder="Anexo" className="w-full text-[10pt]" />
                                    <DocInput name="copia" placeholder="Copia" className="w-full text-[10pt]" />
                                    <DocInput name="redactor" placeholder="Redactor" className="w-full text-[10pt]" />
                                    <DocInput name="transcriptor" placeholder="Transcriptor" className="w-full text-[10pt]" />
                                </div>
                            </>
                        )}

                        {documentType === "acta" && (
                            <>
                                <DocInput name="titulo" placeholder="Titulo" className="w-full text-center text-[13pt] font-bold mb-6" />
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                                    <DocInput name="fecha" type="date" placeholder="Fecha" className="text-[11pt]" />
                                    <DocInput name="hora" type="time" placeholder="Hora" className="text-[11pt]" />
                                    <DocInput name="lugar" placeholder="Lugar" className="text-[11pt]" />
                                </div>

                                <EditableList title="Asistentes" items={actaAsistentes} setItems={setActaAsistentes} placeholder="Nombre completo" />
                                <EditableList title="Invitados" items={actaInvitados} setItems={setActaInvitados} placeholder="Nombre completo" />
                                <EditableList title="Ausentes" items={actaAusentes} setItems={setActaAusentes} placeholder="Nombre completo" />

                                <section className="mb-6">
                                    <p className="text-[11pt] font-bold mb-2">Orden del dia</p>
                                    <div className="space-y-2">
                                        {actaOrdenDia.map((item, index) => (
                                            <div key={`agenda-${index}`} className="flex items-start gap-2">
                                                <span className="text-sm font-bold text-gray-500 pt-2 min-w-6">{index + 1}.</span>
                                                <DocInput
                                                    value={item}
                                                    onChange={(e) => updateActaOrdenDiaItem(index, e.target.value)}
                                                    placeholder="Punto del orden del dia"
                                                    className="flex-1 text-[11pt]"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeActaOrdenDiaItem(index)}
                                                    className="text-xs px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
                                                >
                                                    Quitar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addActaOrdenDiaItem}
                                        className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-bold"
                                    >
                                        + Agregar punto
                                    </button>
                                </section>

                                <section className="mb-6">
                                    <p className="text-[11pt] font-bold mb-2">Desarrollo</p>
                                    <div className="space-y-4">
                                        {actaOrdenDia.map((item, index) => (
                                            <div key={`desarrollo-${index}`} className="space-y-2">
                                                <p className="font-bold text-[11pt]">{item?.trim() || `Punto ${index + 1}`}</p>
                                                <DocArea
                                                    rows={3}
                                                    placeholder="Descripcion del desarrollo"
                                                    value={actaDesarrollo[index] || ""}
                                                    onChange={(e) => updateActaDesarrolloItem(index, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <DocArea name="acta_cuerpo_informe" rows={8} placeholder="Cuerpo del informe" className="text-justify mb-6" />
                                <DocInput name="convocatoria" placeholder="Convocatoria" className="w-full text-[11pt] mb-16" />

                                <div className="mt-8 mb-10">
                                    <div className="w-[250px] border-t border-gray-800 pt-2 space-y-1">
                                        <DocInput name="firma_nombres" placeholder="Nombres y apellidos" className="w-full text-[11pt] font-bold" />
                                        <DocInput name="firma_cargo" placeholder="Cargo" className="w-full text-[11pt]" />
                                    </div>
                                </div>

                                <div className="mt-10 text-[10pt] space-y-2">
                                    <DocInput name="anexo" placeholder="Anexo" className="w-full text-[10pt]" />
                                    <DocInput name="transcriptor" placeholder="Transcriptor" className="w-full text-[10pt]" />
                                </div>
                            </>
                        )}

                        {documentType === "informe" && (
                            <>
                                <DocInput name="codigo" placeholder="Codigo" className="w-44 text-[11pt] mb-4" />
                                <DocInput name="titulo" placeholder="Titulo" className="w-full text-center text-[13pt] font-bold mb-4" />
                                <DocInput name="fecha" type="date" placeholder="Fecha" className="text-[11pt] mb-6" />

                                <EditableList
                                    title="Elaborado por"
                                    items={informeElaboradoPor}
                                    setItems={setInformeElaboradoPor}
                                    placeholder="Nombre completo"
                                />

                                <EditableList
                                    title="Objetivos"
                                    items={informeObjetivos}
                                    setItems={setInformeObjetivos}
                                    placeholder="Objetivo"
                                    numbered
                                />

                                <p className="font-bold text-[11pt] mb-2">Titulo de la actividad</p>
                                <DocInput name="informe_titulo_actividad" placeholder="Titulo de la actividad" className="w-full text-[11pt] mb-4" />
                                <DocArea name="informe_cuerpo" rows={8} placeholder="Cuerpo del informe" className="text-justify mb-6" />

                                <EditableList
                                    title="Conclusiones"
                                    items={informeConclusiones}
                                    setItems={setInformeConclusiones}
                                    placeholder="Conclusion"
                                    numbered
                                    multiline
                                />

                                <EditableList
                                    title="Recomendaciones"
                                    items={informeRecomendaciones}
                                    setItems={setInformeRecomendaciones}
                                    placeholder="Recomendacion"
                                    numbered
                                    multiline
                                />

                                <div className="mt-8 mb-10">
                                    <div className="w-[250px] border-t border-gray-800 pt-2 space-y-1">
                                        <DocInput name="firma_nombres" placeholder="Nombres y apellidos" className="w-full text-[11pt] font-bold" />
                                        <DocInput name="firma_cargo" placeholder="Cargo" className="w-full text-[11pt]" />
                                    </div>
                                </div>

                                <div className="mt-10 text-[10pt] space-y-2">
                                    <DocInput name="anexo" placeholder="Anexo" className="w-full text-[10pt]" />
                                    <DocInput name="transcriptor" placeholder="Transcriptor" className="w-full text-[10pt]" />
                                </div>
                            </>
                        )}

                        {documentType === "constancia" && (
                            <>
                                <DocInput name="codigo" placeholder="Codigo" className="w-44 text-[11pt] mb-4" />
                                <DocInput name="constancia_cargo_quien_consta" placeholder="Cargo de quien consta" className="w-full text-center text-[13pt] font-bold mb-6" />
                                <p className="text-center font-bold text-[13pt] mb-6">HACE CONSTAR</p>
                                <DocArea name="constancia_cuerpo" rows={10} placeholder="Cuerpo de la constancia" className="text-justify mb-10" />

                                <div className="mt-8 mb-10">
                                    <div className="w-[250px] border-t border-gray-800 pt-2 space-y-1">
                                        <DocInput name="firma_nombres" placeholder="Nombres y apellidos" className="w-full text-[11pt] font-bold" />
                                    </div>
                                </div>

                                <div className="mt-10 text-[10pt] space-y-2">
                                    <DocInput name="anexo" placeholder="Anexo" className="w-full text-[10pt]" />
                                    <DocInput name="transcriptor" placeholder="Transcriptor" className="w-full text-[10pt]" />
                                </div>
                            </>
                        )}

                        <div className="mt-16 text-center text-[10pt] text-gray-500 leading-snug">
                            SENA - Centro de comercio y servicios - Area de gestion documental
                            <br />
                            &copy; Gedocs {new Date().getFullYear()} Todos los derechos reservados.
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
