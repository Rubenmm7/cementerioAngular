import { Zona } from "./zona.model";

// Definimos los tipos
export type TipoParcela = 'NICHO' | 'CRIPTA' | 'SUELO' | 'COLUMBARIO' | 'FOSA' | 'PANTEON';
export type EstadoParcela = 'LIBRE' | 'OCUPADO' | 'RESERVADO' | 'MANTENIMIENTO';

export interface Parcela {
    id: number;
    fila: number;
    columna: number;
    tipo: TipoParcela;
    estado: EstadoParcela;
    capacidad: number;
    
    zona?: Zona;
    zonaId?: number;
}