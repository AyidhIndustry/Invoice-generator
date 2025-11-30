// hooks/usePurchase.ts
import { useQuery } from "@tanstack/react-query";
import { getDeliveryNoteById } from "@/features/delivery-notes/get-delivery-note-by-id";

export function useGetDeliveryNoteById(id: string) {
  return useQuery({
    queryKey: ["delivery-note", id],
    queryFn: () => getDeliveryNoteById(id),
    enabled: Boolean(id),
  });
}
