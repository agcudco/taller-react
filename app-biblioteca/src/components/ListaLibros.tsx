import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";

interface Libro {
    "id": number;
    "titulo": string;
    "autor": string;
    "editorial": string;
    "nropaginas": number;
    "stock": number;
    "estado": string;
}

export const ListaLibros: React.FC = () => {
    const [libros, setLibros] = useState<Libro[]>([]);
    const [selectedLibro, setSelectedLibro] = useState<Libro | null>(null);
    const toast = useRef<Toast>(null);
    const [displayDialog, setDisplasDialog] = useState<boolean>(false);
    const [displayDlgEliminar, setDisplayDlgEliminar] = useState<boolean>(false);

    useEffect(() => {
        fecthLibros();
    }, []);

    const fecthLibros = async () => {
        try {
            const response = await fetch('http://localhost:5000/libros');
            const data = await response.json();
            setLibros(data);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'fecthLibros dice: ' + error, life: 3000 });
        }
    }

    const openNewLibroDlg = () => {
        setSelectedLibro({
            "id": 0,
            "titulo": '',
            "autor": '',
            "editorial": '',
            "nropaginas": 0,
            "stock": 0,
            "estado": ''
        });
        setDisplasDialog(true);
    }

    const guardar = async () => {
        if (!selectedLibro) return;
        try {
            const response = await fetch('http://localhost:5000/libros' + (selectedLibro.id ? `/${selectedLibro.id}` : ''), {
                method: selectedLibro.id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedLibro)
            });
            if (response.ok) {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Libro guardado exitosamente', life: 3000 });
                fecthLibros();
                setDisplasDialog(false);
            } else {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar el libro', life: 3000 });
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error: ' + error, life: 3000 });
        }
    }

    const editarLibro = (libro: Libro) => {
        setSelectedLibro({ ...libro });
        setDisplasDialog(true);
    }

    const eliminarLibro = (libro: Libro) => {
        setSelectedLibro({ ...libro });
        setDisplayDlgEliminar(true);
    }

    const deleteLibro = async () => {
        if (!selectedLibro) return;
        try {
            const response = await fetch(`http://localhost:5000/libros/${selectedLibro.id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Libro eliminado exitosamente', life: 3000 });
                fecthLibros();
                setDisplayDlgEliminar(false);
            } else {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el libro', life: 3000 });
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error: ' + error, life: 3000 });
        }
    }

    return (
        <div>
            <h1>Gestión de Libros</h1>
            <Toast ref={toast} />
            <Button label="Nuevo"
                icon="pi pi-plus"
                onClick={openNewLibroDlg} />
            <DataTable
                value={libros}
                paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
            >
                <Column field="id" header="Id"></Column>
                <Column field="titulo" header="Titulo"></Column>
                <Column field="autor" header="Autor"></Column>
                <Column field="editorial" header="Editorial"></Column>
                <Column field="nropaginas" header="No paginas"></Column>
                <Column field="stock" header="Unidades disponibles"></Column>
                <Column field="estado" header="Estado"></Column>
                <Column
                    header="Acciones"
                    body={
                        (rowData: Libro) => (
                            <div>
                                <Button
                                    icon="pi pi-pencil"
                                    onClick={() => editarLibro(rowData)}
                                />
                                <Button
                                    className="p-button-danger"
                                    icon="pi pi-trash"
                                    onClick={() => eliminarLibro(rowData)}
                                />
                            </div>
                        )}
                />
            </DataTable>

            <Dialog
                header="Detalles del Libro"
                visible={displayDialog}
                onHide={() => setDisplasDialog(false)}
            >
                <div className="p-grid p-fluid">

                    <div className="p-col-4">
                        <label htmlFor="titulo">Título</label>
                    </div>
                    <div className="p-col-8">
                        <InputText
                            id="titulo"
                            value={selectedLibro?.titulo || ''}
                            onChange={(e) => setSelectedLibro({ ...selectedLibro!, titulo: e.target.value })}
                        />
                    </div>

                    <div className="p-col-4">
                        <label htmlFor="autor">Autor</label>
                    </div>
                    <div className="p-col-8">
                        <InputText
                            id="autor"
                            value={selectedLibro?.autor || ''}
                            onChange={(e) => setSelectedLibro({ ...selectedLibro!, autor: e.target.value })}
                        />
                    </div>

                    <div className="p-col-4">
                        <label htmlFor="editorial">Editorial</label>
                    </div>
                    <div className="p-col-8">
                        <InputText
                            id="editorial"
                            value={selectedLibro?.editorial || ''}
                            onChange={(e) => setSelectedLibro({ ...selectedLibro!, editorial: e.target.value })}
                        />
                    </div>

                    <div className="p-col-4">
                        <label htmlFor="nopaginas">No de páginas</label>
                    </div>
                    <div className="p-col-8">
                        <InputText
                            id="nopaginas"
                            value={selectedLibro?.nropaginas.toString() || '0'}
                            onChange={(e) =>
                                setSelectedLibro({ ...selectedLibro!, nropaginas: parseInt(e.target.value) || 0 })
                            }
                        />
                    </div>

                    <div className="p-col-4">
                        <label htmlFor="stock">Unidades disponibles</label>
                    </div>
                    <div className="p-col-8">
                        <InputText
                            id="stock"
                            value={selectedLibro?.stock.toString() || '0'}
                            onChange={(e) =>
                                setSelectedLibro({ ...selectedLibro!, stock: parseInt(e.target.value) || 0 })
                            }
                        />
                    </div>

                    <div className="p-col-4">
                        <label htmlFor="estado">Estado</label>
                    </div>
                    <div className="p-col-8">
                        <InputText
                            id="estado"
                            value={selectedLibro?.estado || ''}
                            onChange={(e) => setSelectedLibro({ ...selectedLibro!, estado: e.target.value })}
                        />
                    </div>

                </div>

                <Button label="Guardar" icon="pi pi-save" onClick={guardar} />

            </Dialog>

            <Dialog
                header="Eliminar"
                visible={displayDlgEliminar}
                onHide={() => setDisplayDlgEliminar(false)}
            >
                <p>Está seguro de elinminar el libro {selectedLibro?.titulo}?</p>
                <Button label="Si" icon="pi pi-check" onClick={deleteLibro} />
                <Button label="No" icon="pi pi-times" onClick={() => setDisplayDlgEliminar(false)} />
            </Dialog>
        </div>
    );
}