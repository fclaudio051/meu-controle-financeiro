// Corrigido: adicionando campos que existem no backend
export interface Person {
  id: string;
  name: string;
  userId?: string; // Campo presente no backend
  createdAt?: string; // Campo presente no backend
}