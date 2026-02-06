import { Cementerio } from "./cementerio.model";

export interface Zona {
    id: number;
    nombre: string;
    numeroFilas: number;
    numeroColumnas: number;
    cementerio?: Cementerio;
    cementerioId?: number;
}