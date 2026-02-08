export interface Difunto {
    id: number;
    nombre: string;
    apellidos: string;
    dni: string;
    fechaNacimiento: string;
    fechaDefuncion: string;
    fechaEnterramiento?: string;
    biografia?: string;
    parcelaId?: number;
    nombreCementerio?: string;
}