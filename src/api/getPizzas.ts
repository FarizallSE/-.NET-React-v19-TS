import type { Pizza } from "../APIResponseTypes";

export default async function getPizzas(): Promise<Pizza[]> {
  const response = await fetch("/api/pizzas");
  const data = await response.json();
  return data;
}
