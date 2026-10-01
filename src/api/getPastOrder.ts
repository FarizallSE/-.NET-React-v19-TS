import type { PastOrder } from "../APIResponseTypes";

export default async function getPastOrder(page: number): Promise<PastOrder[]> {
  const response = await fetch(`/api/past-orders?page=${page}`);
  const data = await response.json();
  return data;
}
