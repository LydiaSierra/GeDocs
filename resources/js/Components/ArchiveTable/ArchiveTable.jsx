export default function ArchiveTable() {
    return (
        <div className="w-full max-w-full overflow-x-hidden">
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full table-auto border-separate border-spacing-y-2">
                    <thead className="sticky top-0">
                    <tr className="bg-gray-500 text-white">
                        <th className="rounded-l-lg p-2">
                            <input type="checkbox" className="checkbox border-white text-white" />
                        </th>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Solicitante</th>
                        <th>Identificación</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th className="rounded-r-lg">Fecha Recibido</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.from({ length: 15 }).map((_, i) => (
                        <tr key={i} className="odd:bg-gray-100 even:bg-gray-200 text-center hover:bg-senaLightBlue">
                            <td className="p-2">
                                <input type="checkbox" className="checkbox" />
                            </td>
                            <td>10010025</td>
                            <td className="truncate max-w-[200px]">Queja Generalizada: Instructo...</td>
                            <td>Antonio Antoniez</td>
                            <td>1234567890</td>
                            <td>Queja</td>
                            <td>En Espera</td>
                            <td>08/09/2025</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>


            <div className="block md:hidden space-y-3 w-full max-w-full">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-gray-100 p-3 rounded-lg shadow w-full max-w-full overflow-hidden break-words"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold">ID: 10010025</span>
                            <input type="checkbox" className="checkbox" />
                        </div>
                        <p>
                            <span className="font-semibold">Título:</span>{" "}
                            <span className="break-words">Queja Generalizada: Instructo...</span>
                        </p>
                        <p>
                            <span className="font-semibold">Solicitante:</span>{" "}
                            <span className="break-words">Antonio Antoniez</span>
                        </p>
                        <p>
                            <span className="font-semibold">Identificación:</span>{" "}
                            <span className="break-all">1234567890</span>
                        </p>
                        <p>
                            <span className="font-semibold">Tipo:</span> Queja
                        </p>
                        <p>
                            <span className="font-semibold">Estado:</span> En Espera
                        </p>
                        <p>
                            <span className="font-semibold">Fecha:</span> 08/09/2025
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
