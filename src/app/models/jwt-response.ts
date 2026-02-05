export interface JwtResponse {
    token: string;
    username: string;
    roles: string[];
    usuario?: {
        id?: number;
        nombre?: string;
        email?: string;
        telefono?: string;
        direccion?: string;
    };
}
