export type TrasnsacaoRequestInput = {
  titulo: string;
  descricao: string;
  valor: number;
  tipo: number;
  usuarioId: number;
  tags: string[];
};
