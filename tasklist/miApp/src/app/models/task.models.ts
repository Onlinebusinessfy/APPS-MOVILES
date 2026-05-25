export interface Task {
    id: number;
    titulo: string;
    descripcion: string;
    finalizado: boolean;
    proridad: 'Baja' | 'Media' | 'Alta'
}