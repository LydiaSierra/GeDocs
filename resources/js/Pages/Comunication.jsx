import axios from "axios";
import { useEffect, useState } from "react";

export default function Comunication(params) {
    const [comunication, setComunication] = useState({});
    const [pqr, setPqr] = useState({});
    const [response, setResponse] = useState("");

    useEffect(() => {
        const url = "http://localhost:8000/api/pqr/responder";
        async function fetchComunication() {
            try {
                const response = await axios.get(`${url}/${params.pqrID}`);
                setComunication(response.data.data.communication);
                setPqr(response.data.data.pqr);
            } catch (e) {
                console.log(e);
            }
        }
        fetchComunication();
    }, []);

    const handleSubmit = () => {};
    return (
        <div className="communications">
            <div className="title">
                <div>{pqr.id}: </div>
                <h2>{pqr.affair}</h2>
            </div>
            <div className="response">
                <p>{comunication.message}</p>
            </div>
            <div>
                <form action="#">
                    <label htmlFor="respuesta">Escribe una respuesta: </label>
                    <textarea
                        name="tespuesta"
                        id="respuesta"
                        placeholder="necrochimbo"
                        onChange={(e) => setResponse(e.target.value)}
                    ></textarea>
                    <button type="submit">Enviar</button>
                </form>
            </div>
        </div>
    );
}
