import { Ayuntamiento } from "./ayuntamiento.model";

export interface Cementerio {
    id: number;
    nombre: string;
    direccion: string;
    poblacion: string;
    provincia: string;
    codigoPostal: string;
    emailContacto: string;
    imagenRuta?: string;
    ayuntamiento?: Ayuntamiento; 
    ayuntamientoId?: number;
}

