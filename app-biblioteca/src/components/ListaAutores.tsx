import React, { useRef, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import './ListaAutores.css';

interface Autor {
    id: number;
    nombre: string;
    apellido: string;
}

export const ListaAutores: React.FC = () => {

    const [autores, setAUtores] = useState<Autor[]>([
        { id: 1, nombre: 'Angel', apellido: 'Cudco' },
        { id: 2, nombre: 'Juan', apellido: 'Perez' }
    ]);

    const [autor, setAutor] = useState<Autor>({ id: 0, nombre: '', apellido: '' });
    const [autorSel, setAutorSel] = useState<Autor | null>(null);
    const [mostrarDialogo, setMostrarDialogo] = useState<boolean>(false);
    const toast = useRef<Toast>(null);
    const [dialogoEliminar, setDialogoEliminar] = useState<boolean>(false);

    const guardar = () => {
        if (autor.id === 0) {
            setAUtores([...autores, { ...autor, id: autores.length + 1 }]);
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Autor guardado exitosamente', life: 3000 });
        } else {
            setAUtores(autores.map(a => (a.id === autor.id ? autor : a)));
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Autor actualizado exitosamente', life: 3000 });
        }
        setMostrarDialogo(false);
        setAutor({ id: 0, nombre: '', apellido: '' });
    }

    const confirmarEliminacion = (autor: Autor) => {
        setAutorSel(autor);
        setDialogoEliminar(true);
    }

    const elimiarAutor = () => {
        setAUtores(autores.filter(a => a.id !== autorSel?.id));
        setDialogoEliminar(false);
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Autor eliminado exitosamente', life: 3000 });
    }
    const editarAutor = (autor: Autor) => {
        setAutor(autor);
        setMostrarDialogo(true);
    }
    return (
        <div className="flex-content">
            <h1>Gestión de Autores</h1>
            <Toast ref={toast} />
            <Button label="Show" icon="pi pi-user-plus" onClick={() => setMostrarDialogo(true)} />
            <DataTable value={autores}
                selectionMode="single"
                onRowSelect={rowData => editarAutor(rowData.data)}
                tableStyle={{ minWidth: '50rem' }}>
                <Column field="id" header="Id"></Column>
                <Column field="nombre" header="Nombre"></Column>
                <Column field="apellido" header="Apellido"></Column>
                <Column
                    header="Acciones"
                    body={(rowData: Autor) => (
                        <Button
                            label="Eliminar"
                            icon="pi pi-trash"
                            onClick={() => confirmarEliminacion(rowData)}
                        />
                    )}
                />
            </DataTable>

            <Dialog header="Autor"
                visible={mostrarDialogo}
                onHide={() => setMostrarDialogo(false)}>
                <div className="p-field">
                    <label htmlFor="txtNombre">Nombre:</label>
                    <InputText
                        id="txtNombre"
                        value={autor.nombre}
                        onChange={e => setAutor({ ...autor, nombre: e.target.value })}
                    />
                    <br />
                    <label htmlFor="txtApellido">Apellido:</label>
                    <InputText
                        id="txtApellido"
                        value={autor.apellido}
                        onChange={e => setAutor({ ...autor, apellido: e.target.value })}
                    />
                </div>
                <br />
                <Button
                    label="Guardar"
                    icon='pi pi-save'
                    onClick={guardar}
                />
            </Dialog>

            <Dialog
                header="Eliminar"
                visible={dialogoEliminar}
                onHide={() => setDialogoEliminar(false)}
            >
                <p>Está seguro de elinminar el autor seleccionado?</p>
                <Button label="Si" icon="pi pi-check" onClick={elimiarAutor} />
                <Button label="No" icon="pi pi-times" onClick={() => setDialogoEliminar(false)} />
            </Dialog>
        </div>
    );
}