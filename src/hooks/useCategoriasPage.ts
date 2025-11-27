import { useState } from "react";
import {
  useCategories,
  useDeleteCategoria,
} from "@/hooks/api/useCategories";

export const useCategoriasPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { 
    data: categoriasEntrada = [], 
    isLoading: isLoadingEntrada,
    refetch: refetchEntrada 
  } = useCategories("entrada");
  
  const { 
    data: categoriasSaida = [], 
    isLoading: isLoadingSaida,
    refetch: refetchSaida 
  } = useCategories("saida");
  
  const deleteCategoria = useDeleteCategoria();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchEntrada(), refetchSaida()]);
    setIsRefreshing(false);
  };

  return {
    categoriasEntrada,
    categoriasSaida,
    deleteCategoria,
    isLoading: isLoadingEntrada || isLoadingSaida || isRefreshing,
    handleRefresh,
  };
};

