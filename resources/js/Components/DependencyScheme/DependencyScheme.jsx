import api from "@/lib/axios";
import React, { useState } from "react";

const DependencyScheme = () => {

    const [formData, setFormData] = useState({
        codigo: "",
        fecha: "",
        lugar: "",
        tratamiento: "",
        nombres: "",
        cargo: "",
        empresa: "",
        direccion: "",
        ciudad: "",
        asunto: "",
        saludo: "",
        texto: "",
        despedida1: "",
        despedida2: "",
        despedida3: "",
        firma_nombres: "",
        firma_cargo: "",
        anexo: "",
        copia: "",
        transcriptor: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleGeneratePdf = async () => {
        try {
            const response = await api.post(
                "/generate-pdf",
                formData,
                { responseType: "blob" }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = "acta.pdf";
            a.click();
        } catch (error) {
            console.error("Error generando el PDF:", error.message);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            {/* Código */}
            <label>Código</label>
            <input name="codigo" onChange={handleChange} className="input" />

            {/* Fecha y lugar */}
            <label>Fecha de elaboración</label>
            <input type="date" name="fecha" onChange={handleChange} className="input" />

            <label>Lugar</label>
            <input name="lugar" onChange={handleChange} className="input" />

            {/* Tratamiento */}
            <label>Tratamiento</label>
            <input name="tratamiento" onChange={handleChange} className="input" />

            <label>Nombres y Apellidos</label>
            <input name="nombres" onChange={handleChange} className="input" />

            <label>Cargo</label>
            <input name="cargo" onChange={handleChange} className="input" />

            <label>Empresa</label>
            <input name="empresa" onChange={handleChange} className="input" />

            <label>Dirección</label>
            <input name="direccion" onChange={handleChange} className="input" />

            <label>Ciudad</label>
            <input name="ciudad" onChange={handleChange} className="input" />

            {/* Asunto */}
            <label>Asunto</label>
            <input name="asunto" onChange={handleChange} className="input" />

            {/* Saludo */}
            <label>Saludo</label>
            <input name="saludo" onChange={handleChange} className="input" />

            {/* Texto */}
            <label>Texto</label>
            <textarea name="texto" onChange={handleChange} className="textarea" />

            {/* Despedidas */}
            <label>Despedida línea 1</label>
            <input name="despedida1" onChange={handleChange} className="input" />

            <label>Despedida línea 2</label>
            <input name="despedida2" onChange={handleChange} className="input" />

            <label>Despedida línea 3</label>
            <input name="despedida3" onChange={handleChange} className="input" />

            {/* Firma */}
            <label>Firma - Nombres y Apellidos</label>
            <input name="firma_nombres" onChange={handleChange} className="input" />

            <label>Firma - Cargo</label>
            <input name="firma_cargo" onChange={handleChange} className="input" />

            {/* Anexo, Copia, Transcriptor */}
            <label>Anexo</label>
            <input name="anexo" onChange={handleChange} className="input" />

            <label>Copia</label>
            <input name="copia" onChange={handleChange} className="input" />

            <label>Transcriptor</label>
            <input name="transcriptor" onChange={handleChange} className="input" />

            {/* Botón */}
            <button
                onClick={handleGeneratePdf}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            >
                Generar PDF
            </button>
        </div>
    );
};

export default DependencyScheme;
