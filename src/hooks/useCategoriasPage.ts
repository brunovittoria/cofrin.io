import {
  useCategories,
  useDeleteCategoria,
} from "@/hooks/api/useCategories";

export const useCategoriasPage = () => {
  const { data: categoriasEntrada = [] } = useCategories("entrada");
  const { data: categoriasSaida = [] } = useCategories("saida");
  const deleteCategoria = useDeleteCategoria();

  return {
    categoriasEntrada,
    categoriasSaida,
    deleteCategoria,
  };
};

