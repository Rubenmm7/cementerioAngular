
export interface UserResponseDTO {
    id: number;
    nombre: string;
    apellidos: string;
    telefono: string;
    email: string;
    direccion?: string;
    role: string;
    ayuntamientoId?: number;
    nombreAyuntamiento?: string;
}