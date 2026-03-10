
// Importa la instancia personalizada de Axios desde tu carpeta de librerías
import api from "@/lib/axios";

// Importa React y el hook useState (aunque en este componente no se está usando)
import React, { useState } from "react";
import { toast } from "sonner";

// Componente principal
const DependencyScheme = ({ onPdfGenerated }) => {

    
    // Función que maneja la generación del PDF
    
    const handleGeneratePdf = async (e) => {
        e.preventDefault(); // Evita que el formulario recargue la página
        document.getElementById("my_modal_1").close();

        let toastId;
        toastId = toast.loading("Generando PDF")

        try {
            const form = new FormData(e.target);
            const data = Object.fromEntries(form.entries());

            const response = await api.post(
                "/generate-pdf",
                data,
                { responseType: "blob" }
            );

            // Verificar si el blob es en realidad un JSON de error
            if (response.data.type === "application/json") {
                const text = await response.data.text();
                const errorData = JSON.parse(text);
                throw new Error(errorData.error || "Error desconocido en el servidor");
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = "acta.pdf";
            a.click();

            if (onPdfGenerated) onPdfGenerated();

            toast.dismiss(toastId);
            toast.success("PDF generado correctamente");

        } catch (error) {
            toast.dismiss(toastId);
            console.error("Error generando el PDF:", error);
            
            let errorMessage = "No se pudo generar el PDF";
            if (error.response && error.response.data instanceof Blob) {
                const text = await error.response.data.text();
                try {
                    const json = JSON.parse(text);
                    errorMessage = json.error || errorMessage;
                } catch (e) {
                    errorMessage = text || errorMessage;
                }
            } else {
                errorMessage = error.message || errorMessage;
            }
            
            toast.error(errorMessage);
        }
    };

    // ------------------------------
    // Render del formulario
    // ------------------------------
    return (
        <form id="pdfForm" onSubmit={handleGeneratePdf}>
            <div className="rounded-sm p-6 gap-3 items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between bg-gray-200 w-full">

                {/* Campo: Código */}
                <div>
                    <label>Código</label>
                    <input name="codigo" className="input" />
                </div>

                {/* Campo: Fecha de elaboración */}
                <div>
                    <label>Fecha de elaboración</label>
                    <input type="date" name="fecha" className="input" />
                </div>

                {/* Campo: Lugar */}
                <div>
                    <label>Lugar</label>
                    <input name="lugar" className="input" />
                </div>

                {/* Campo: Tratamiento */}
                <div>
                    <label>Tratamiento</label>
                    <input name="tratamiento" className="input" />
                </div>

                {/* Campo: Nombres */}
                <div>
                    <label>Nombres y Apellidos</label>
                    <input name="nombres" className="input" />
                </div>

                {/* Campo: Cargo */}
                <div>
                    <label>Cargo</label>
                    <input name="cargo" className="input" />
                </div>

                {/* Campo: Empresa */}
                <div>
                    <label>Empresa</label>
                    <input name="empresa" className="input" />
                </div>

                {/* Campo: Dirección */}
                <div>
                    <label>Dirección</label>
                    <input name="direccion" className="input" />
                </div>

                {/* Campo: Ciudad */}
                <div>
                    <label>Ciudad</label>
                    <input name="ciudad" className="input" />
                </div>

                {/* Campo: Asunto */}
                <div>
                    <label>Asunto</label>
                    <input name="asunto" className="input" />
                </div>

                {/* Campo: Saludo */}
                <div>
                    <label>Saludo</label>
                    <input name="saludo" className="input" />
                </div>

                {/* Campo: Texto (textarea) */}
                <div>
                    <label>Texto</label>
                    <textarea name="texto" className="textarea" />
                </div>

                {/* Campos: Despedidas */}
                <div>
                    <label>Despedida línea 1</label>
                    <input name="despedida1" className="input" />
                </div>

                <div>
                    <label>Despedida línea 2</label>
                    <input name="despedida2" className="input" />
                </div>

                <div>
                    <label>Despedida línea 3</label>
                    <input name="despedida3" className="input" />
                </div>

                {/* Firma */}
                <div>
                    <label>Firma - Nombres y Apellidos</label>
                    <input name="firma_nombres" className="input" />
                </div>

                <div>
                    <label>Firma - Cargo</label>
                    <input name="firma_cargo" className="input" />
                </div>

                {/* Anexo, Copia, Transcriptor */}
                <div>
                    <label>Anexo</label>
                    <input name="anexo" className="input" />
                </div>

                <div>
                    <label>Copia</label>
                    <input name="copia" className="input" />
                </div>

                <div>
                    <label>Transcriptor</label>
                    <input name="transcriptor" className="input" />
                </div>

                {/* Botón del formulario */}
                <button
                    type="submit"
                    className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                    Generar PDF
                </button>
            </div>
        </form>
    );
};

// Exporta el componente para poder usarlo en otras partes del proyecto
export default DependencyScheme;

