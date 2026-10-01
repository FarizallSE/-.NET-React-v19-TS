import type { PastOrderDetail } from "../APIResponseTypes";

export default async function getPastOrders(
  order: number,
): Promise<PastOrderDetail> {
  const response = await fetch(`/api/past-order/${order}`);
  const data = await response.json();
  return data;
}
