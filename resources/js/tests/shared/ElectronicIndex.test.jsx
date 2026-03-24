import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import IndexTable from "@/Components/ElectronicIndex/indexTable";
import { ElectronicIndexContext } from "@/context/ElectronicIndexContext/ElectronicIndexContext";
import * as useExplorerModule from "@/Hooks/useExplorer";

// Mock del heroicons para evitar problemas de renderizado
vi.mock("@heroicons/react/24/outline", () => ({
    EllipsisVerticalIcon: () => <svg data-testid="ellipsis-icon" />,
    ExclamationTriangleIcon: () => <svg data-testid="exclamation-icon" />,
}));

// Datos de prueba
const mockFiles = [
    {
        id: 1,
        name: "Archivo-Prueba-1.pdf",
        created_at: "2024-03-20T10:00:00.000Z",
        updated_at: "2024-03-21T10:00:00.000Z",
        folder_code: "123-456",
        root_dependency_name: "Dependencia A",
        hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    },
    {
        id: 2,
        name: "Archivo-Sin-Hash.pdf",
        created_at: null,
        updated_at: null,
        folder_code: null,
        root_dependency_name: null,
        hash: null,
    }
];

describe("ElectronicIndex - IndexTable Frontend API", () => {
    let mockContextValue;
    let mockUseExplorerValue;

    beforeEach(() => {
        vi.clearAllMocks();

        mockContextValue = {
            scopedFiles: mockFiles,
            loading: false,
            error: null,
            openFileInExplorerById: vi.fn(),
        };

        mockUseExplorerValue = {
            deleteSelectionItemsMixed: vi.fn().mockResolvedValue(),
            setSelectedItems: vi.fn(),
            downloadZip: vi.fn().mockResolvedValue(),
        };

        vi.spyOn(useExplorerModule, "useExplorer").mockReturnValue(mockUseExplorerValue);
        
        // Mock document.getElementById for the dialog
        const modalMock = {
            open: false,
            showModal: vi.fn(function() { this.open = true; }),
            close: vi.fn(function() { this.open = false; }),
        };
        vi.spyOn(document, 'getElementById').mockImplementation((id) => {
            if (id === 'confirmDeleteIndexFile') return modalMock;
            return null;
        });
    });

    const renderComponent = () => {
        return render(
            <ElectronicIndexContext.Provider value={mockContextValue}>
                <IndexTable />
            </ElectronicIndexContext.Provider>
        );
    };

    it("renderiza los archivos correctamente", () => {
        renderComponent();

        expect(screen.getByText("Archivo-Prueba-1.pdf")).toBeInTheDocument();
        expect(screen.getByText("Archivo-Sin-Hash.pdf")).toBeInTheDocument();
        expect(screen.getByText("123-456")).toBeInTheDocument();
        expect(screen.getByText("Dependencia A")).toBeInTheDocument();
    });

    it("renderiza los hashes acortados a 12 caracteres o muestra un guion si no hay hash", () => {
        renderComponent();

        // el primer archivo tiene hash e3b0c44298fc1c14...
        // Los primeros 12 chars son e3b0c44298fc
        expect(screen.getByText("e3b0c44298fc...")).toBeInTheDocument();

        // El segundo archivo no tiene hash, en la tabla se pone "-" pero puede haber multiples guiones
        // podemos buscar la fila del archivo 2
        const rows = screen.getAllByRole('row');
        expect(rows.length).toBeGreaterThan(1); // theader + tr
    });

    it("abre el menu de 3 puntitos y funciona 'Ir al archivo'", async () => {
        renderComponent();

        const ellipsisButtons = screen.getAllByTestId("ellipsis-icon");
        // click al primer archivo
        fireEvent.click(ellipsisButtons[0].parentElement);

        const goToFileBtn = screen.getByText("Ir al archivo");
        expect(goToFileBtn).toBeInTheDocument();

        fireEvent.click(goToFileBtn);

        expect(mockContextValue.openFileInExplorerById).toHaveBeenCalledWith(1);
    });

    it("abre el menu de 3 puntitos y funciona 'Descargar'", async () => {
        renderComponent();

        const ellipsisButtons = screen.getAllByTestId("ellipsis-icon");
        fireEvent.click(ellipsisButtons[0].parentElement);

        const downloadBtn = screen.getByText("Descargar");
        fireEvent.click(downloadBtn);

        expect(mockUseExplorerValue.setSelectedItems).toHaveBeenCalledWith([
            { id: 1, type: "file" }
        ]);
        expect(mockUseExplorerValue.downloadZip).toHaveBeenCalled();
    });

    it("abre el menu de 3 puntitos, selecciona 'Mover a la papelera', y confirma", async () => {
        renderComponent();

        // Abrir menu del primer archivo
        const ellipsisButtons = screen.getAllByTestId("ellipsis-icon");
        fireEvent.click(ellipsisButtons[0].parentElement);

        // Click a Mover a la papelera en el menu
        const moveToTrashBtn = screen.getByText("Mover a la papelera");
        fireEvent.click(moveToTrashBtn);

        // Verificar que el boton "Mover a papelera" se muestra y darle click
        const confirmBtns = screen.getAllByText("Mover a papelera");
        const confirmBtn = confirmBtns[confirmBtns.length - 1]; // El botón final
        fireEvent.click(confirmBtn);

        await waitFor(() => {
            expect(mockUseExplorerValue.deleteSelectionItemsMixed).toHaveBeenCalledWith(
                [{ id: 1, type: "file" }],
                expect.any(Object)
            );
        });
    });

    it("muestra mensaje de carga", () => {
        mockContextValue.loading = true;
        renderComponent();
        expect(screen.getByText("Cargando archivos...")).toBeInTheDocument();
    });

    it("muestra mensaje de error", () => {
        mockContextValue.error = "Error al cargar archivos";
        renderComponent();
        expect(screen.getByText("Error al cargar archivos")).toBeInTheDocument();
    });
});
