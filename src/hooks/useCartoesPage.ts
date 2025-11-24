import { useState } from "react";
import {
  useCartoes,
  useDeleteCartao,
  useSetCartaoPrincipal,
  useCreateCartao,
  useUpdateCartao,
  type NovoCartao,
  type Cartao,
} from "@/hooks/api/useCartoes";

export const useCartoesPage = () => {
  const { data: cartoes, isLoading } = useCartoes();
  const deleteCartao = useDeleteCartao();
  const setCartaoPrincipal = useSetCartaoPrincipal();
  const createCartao = useCreateCartao();
  const updateCartao = useUpdateCartao();
  
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCartao, setSelectedCartao] = useState<Cartao | null>(null);

  const cards = cartoes ?? [];
  const cardsToDisplay = cards.slice(0, 3);
  const emptySlots = Math.max(0, 3 - cardsToDisplay.length);

  const handleCreateCartao = (data: NovoCartao) => {
    createCartao.mutate(data, {
      onSuccess: () => {
        setAddModalOpen(false);
      },
    });
  };

  const handleEditCartao = (data: NovoCartao) => {
    if (!selectedCartao) return;
    updateCartao.mutate(
      { ...data, id: selectedCartao.id },
      {
        onSuccess: () => {
          setEditModalOpen(false);
          setSelectedCartao(null);
        },
      }
    );
  };

  const openEditModal = (cartao: Cartao) => {
    setSelectedCartao(cartao);
    setEditModalOpen(true);
  };

  const handleDeleteCartao = (id: number) => {
    deleteCartao.mutate(id);
  };

  const handleSetPrincipal = (id: number) => {
    setCartaoPrincipal.mutate(id);
  };

  return {
    cards,
    cardsToDisplay,
    emptySlots,
    isLoading,
    addModalOpen,
    setAddModalOpen,
    editModalOpen,
    setEditModalOpen,
    selectedCartao,
    handleCreateCartao,
    handleEditCartao,
    openEditModal,
    handleDeleteCartao,
    handleSetPrincipal,
    isPendingDelete: deleteCartao.isPending,
    isPendingSetPrincipal: setCartaoPrincipal.isPending,
    isPendingCreate: createCartao.isPending,
    isPendingUpdate: updateCartao.isPending,
  };
};

