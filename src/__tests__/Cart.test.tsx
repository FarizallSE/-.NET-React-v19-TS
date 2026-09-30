import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import Cart from "../Cart";
import type { Pizza } from "../APIResponseTypes";
import type { CartItem } from "../contexts";

afterEach(cleanup);

const testPizza: Pizza = {
  id: "pepperoni",
  name: "The Pepperoni Pizza",
  category: "Classic",
  description: "Mozzarella Cheese, Pepperoni",
  image: "/pizzas/pepperoni.webp",
  sizes: {
    S: 9.75,
    M: 12.5,
    L: 15.25,
  },
};

const threeItems: CartItem[] = [
  {
    pizza: testPizza,
    size: "S",
    price: "$9.75",
  },
  {
    pizza: testPizza,
    size: "M",
    price: "$12.50",
  },
  {
    pizza: testPizza,
    size: "L",
    price: "$15.25",
  },
];

test("renders the cart items and the total price", () => {
  // Cart menerima data lewat props, bukan lewat CartContext
  render(<Cart cart={threeItems} checkout={vi.fn()} />);

  // Cek judul halaman
  expect(
    screen.getByRole("heading", {
      level: 2,
    }).textContent,
  ).toBe("Cart");

  // Harus ada 3 item sesuai threeItems
  expect(screen.getAllByRole("listitem")).toHaveLength(3);

  // Cek ukuran
  expect(screen.getByText("S")).toBeDefined();
  expect(screen.getByText("M")).toBeDefined();
  expect(screen.getByText("L")).toBeDefined();

  // Karena nama pizza sama 3 kali
  expect(screen.getAllByText("The Pepperoni Pizza")).toHaveLength(3);

  // Cek harga
  expect(screen.getByText("$9.75")).toBeDefined();
  expect(screen.getByText("$12.50")).toBeDefined();
  expect(screen.getByText("$15.25")).toBeDefined();

  // Cek total
  expect(screen.getByText("Total: $37.50")).toBeDefined();
});

test("calls the checkout callback when the checkout button is clicked", () => {
  const checkout = vi.fn();
  render(<Cart cart={threeItems} checkout={checkout} />);

  fireEvent.click(screen.getByRole("button", { name: "Checkout" }));

  expect(checkout).toHaveBeenCalledTimes(1);
});

test("renders an empty cart with a zero total", () => {
  render(<Cart cart={[]} checkout={vi.fn()} />);

  expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  expect(screen.getByText("Total: $0.00")).toBeDefined();
  expect(screen.getByRole("button", { name: "Checkout" })).toBeDefined();
});
