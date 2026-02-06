import { Cementerio } from "./cementerio.model";

export interface Ayuntamiento {
    id: number;
    nombre: string;
    telefono: string;
    direccion: string;
    cementerios?: Cementerio[]; 
}