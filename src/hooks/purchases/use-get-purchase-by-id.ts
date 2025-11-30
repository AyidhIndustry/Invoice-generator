// hooks/usePurchase.ts
import { useQuery } from "@tanstack/react-query";
import { getPurchaseById } from "@/features/purchases/get-purchase-by-id";

export function useGetPurchasesById(id: string) {
  return useQuery({
    queryKey: ["purchase", id],
    queryFn: () => getPurchaseById(id),
    enabled: Boolean(id),
  });
}
