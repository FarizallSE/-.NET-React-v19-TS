import { cleanup, render, screen, within } from "@testing-library/react";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { afterEach, expect, test, vi } from "vitest";
import Header from "../Header";
import { CartContext, type CartItem } from "../contexts";

afterEach(cleanup);

// Header memakai <Link> dari TanStack Router, jadi komponennya hanya bisa
// dirender di dalam RouterProvider. Kita pakai router in-memory supaya test
// tidak bergantung pada URL browser.
const rootRoute = createRootRoute({ component: Header });
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/" });

type RouterUnderTest = Parameters<typeof RouterProvider>[0]["router"];

function renderHeader(cart: CartItem[]) {
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });

  render(
    <CartContext.Provider value={[cart, vi.fn()]}>
      {/* RouterProvider secara default mengasumsikan router hasil generate
          (src/routeTree.gen.ts). Router test ini route tree-nya dibuat manual,
          jadi satu-satunya cara tanpa menyentuh file aplikasi adalah cast ini. */}
      <RouterProvider router={router as unknown as RouterUnderTest} />
    </CartContext.Provider>,
  );
}

const cart: CartItem[] = [
  {
    pizza: {
      id: "pepperoni",
      name: "Pepperoni",
      category: "Classic",
      description: "A classic with a spicy kick.",
      image: "https://picsum.photos/200",
      sizes: { S: 10, M: 15, L: 20 },
    },
    size: "M",
    price: "$15.00",
  },
  {
    pizza: {
      id: "cheese",
      name: "Cheese",
      category: "Vegetarian",
      description: "Simple and timeless.",
      image: "https://picsum.photos/201",
      sizes: { S: 11, M: 16, L: 21 },
    },
    size: "S",
    price: "$11.00",
  },
];

test("shows the number of pizzas in the cart", async () => {
  renderHeader(cart);

  expect((await screen.findByRole("heading", { level: 1 })).textContent).toBe(
    "Padre Gino's Pizza",
  );

  expect(screen.getByRole("link").getAttribute("href")).toBe("/");
});

test("shows a zero count when the cart is empty", () => {
  renderHeader([]);

  const nav = screen.getByRole("navigation");

  expect(within(nav).getByText("0")).toBeDefined();
  expect(within(nav).getByText("🛒")).toBeDefined();
});

test("counts every pizza in the cart", () => {
  renderHeader(cart);

  const nav = screen.getByRole("navigation");

  expect(within(nav).getByText("2")).toBeDefined();
  expect(within(nav).getByText("🛒")).toBeDefined();
});
