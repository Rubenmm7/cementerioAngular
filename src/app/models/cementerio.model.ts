import { Ayuntamiento } from "./ayuntamiento.model";

export interface Cementerio {
    id: number;
    nombre: string;
    telefono?: string;
    direccion: string;
    poblacion: string;
    provincia: string;
    codigoPostal: string;
    estado?: 'activo' | 'inactivo';
    capacidad?: number;
    ocupacion?: number;
    emailContacto: string;
    imagenRuta?: string;
    ayuntamiento?: Ayuntamiento; 
    ayuntamientoId?: number;
}

