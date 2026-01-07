import { useState, useMemo } from "react";
import {
  useCategories,
  useDeleteCategoria,
} from "@/hooks/api/useCategories";

export const useCategoriasPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPageEntrada, setCurrentPageEntrada] = useState(1);
  const [currentPageSaida, setCurrentPageSaida] = useState(1);
  const pageSize = 5;

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

  const totalPagesEntrada = useMemo(() => {
    return Math.ceil(categoriasEntrada.length / pageSize);
  }, [categoriasEntrada.length, pageSize]);

  const paginatedCategoriasEntrada = useMemo(() => {
    const startIndex = (currentPageEntrada - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return categoriasEntrada.slice(startIndex, endIndex);
  }, [categoriasEntrada, currentPageEntrada, pageSize]);

  const totalPagesSaida = useMemo(() => {
    return Math.ceil(categoriasSaida.length / pageSize);
  }, [categoriasSaida.length, pageSize]);

  const paginatedCategoriasSaida = useMemo(() => {
    const startIndex = (currentPageSaida - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return categoriasSaida.slice(startIndex, endIndex);
  }, [categoriasSaida, currentPageSaida, pageSize]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchEntrada(), refetchSaida()]);
    setIsRefreshing(false);
  };

  return {
    categoriasEntrada,
    categoriasSaida,
    paginatedCategoriasEntrada,
    paginatedCategoriasSaida,
    deleteCategoria,
    isLoading: isLoadingEntrada || isLoadingSaida || isRefreshing,
    handleRefresh,
    currentPageEntrada,
    setCurrentPageEntrada,
    totalPagesEntrada,
    currentPageSaida,
    setCurrentPageSaida,
    totalPagesSaida,
  };
};

