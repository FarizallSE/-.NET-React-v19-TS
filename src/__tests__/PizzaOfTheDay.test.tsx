import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import PizzaOfTheDay from "../PizzaOfTheDay";
import type { Pizza } from "../APIResponseTypes";

afterEach(cleanup);

//Menyimulasikan Permintaan API (Fetch Mocking)
const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

beforeEach(() => {
  fetchMocker.resetMocks();
});

const pizzaOfTheDay: Pizza = {
  id: "1",
  name: "Pepperoni Feast",
  category: "Classic",
  description: "A classic with a spicy kick.",
  image: "https://picsum.photos/200",
  sizes: { S: 10, M: 15, L: 20 },
};

test("shows a loading state while the pizza of the day is fetched", async () => {
  fetchMocker.mockResponse(JSON.stringify(pizzaOfTheDay));
  render(<PizzaOfTheDay />);

  //Status Loading dan Pemanggilan URL
  expect(screen.getByText("Loading...")).toBeDefined();
  //
  expect((await screen.findByRole("heading", { level: 3 })).textContent).toBe(
    pizzaOfTheDay.name,
  );
  //Memastikan komponen benar-benar berusaha mengambil data ke alamat URL yang tepat
  expect(fetchMocker).toHaveBeenCalledWith("/api/pizza-of-the-day");
});

test("renders the name, description, price and image of the pizza of the day", async () => {
  fetchMocker.mockResponse(JSON.stringify(pizzaOfTheDay));
  render(<PizzaOfTheDay />);

  //Memastikan nama pizza ("Pepperoni Feast") sama.
  expect((await screen.findByRole("heading", { level: 3 })).textContent).toBe(
    pizzaOfTheDay.name,
  );

  //Memastikan deskripsi pizza ("A classic with a spicy kick.") sama
  expect(screen.getByText(pizzaOfTheDay.description)).toBeDefined();

  //Memastikan harga pizza ("From: $10.00") muncul di layar.
  //harga dipecah jadi dua node teks ("From: " + <span>$10.00</span>)
  const price = screen.getByText("$10.00").closest("p");
  expect(price?.textContent).toBe("From: $10.00");

  //memastikan gambar pizza muncul dengan atribut src dan alt yang benar.
  const img = screen.getByRole("img") as HTMLImageElement;
  expect(img.src).toBe(pizzaOfTheDay.image);
  expect(img.alt).toBe(pizzaOfTheDay.name);
});
