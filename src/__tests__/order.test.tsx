import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type PropsWithChildren } from "react";
import { Order } from "../routes/order.lazy";
import { CartContext, type CartItem } from "../contexts";
import type { Pizza } from "../APIResponseTypes";

afterEach(cleanup);

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

// reset mock sebelum setiap test agar request yang tercatat tidak menumpuk antar test
beforeEach(() => {
  fetchMocker.resetMocks();
  vi.clearAllMocks();
});

const pizzas: Pizza[] = [
  {
    id: "pepperoni",
    name: "Pepperoni",
    category: "Classic",
    description: "A classic with a spicy kick.",
    image: "https://picsum.photos/200",
    sizes: { S: 10, M: 15, L: 20 },
  },
  {
    id: "cheese",
    name: "Cheese",
    category: "Vegetarian",
    description: "Simple and timeless.",
    image: "https://picsum.photos/201",
    sizes: { S: 11, M: 16, L: 21 },
  },
];

function CartProvider({ children }: PropsWithChildren) {
  const [cart, setCart] = useState<CartItem[]>([]);
  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
}

function setup() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Order />
      </CartProvider>
    </QueryClientProvider>,
  );
}

test("loads the pizza types and shows the default pizza price", async () => {
  fetchMocker.mockResponse(JSON.stringify(pizzas));
  setup();

  expect(screen.getByText("Loading...")).toBeDefined();

  // data pizza dimuat dari endpoint yang benar lalu dirender ke dalam <select>
  await screen.findAllByRole("option");

  //memastikan komponen benar-benar berusaha mengambil data ke alamat (endpoint) URL yang tepat
  expect(fetchMocker).toHaveBeenCalledWith("/api/pizzas");

  //memanggil tag select untuk memilih pizza
  const select = screen.getByRole("combobox") as HTMLSelectElement;
  expect(select.name).toBe("pizza-type");
  //memastikan jumlah option yang tersedia sesuai dengan data dummy yang dibuat
  const options = screen.getAllByRole("option") as HTMLOptionElement[];
  expect(options).toHaveLength(2);
  //memastikan value dan innerText dari masing-masing option sesuai dengan data dummy yang dibuat
  expect(options[0].value).toBe("pepperoni");
  expect(options[0].textContent).toBe("Pepperoni");
  expect(options[1].value).toBe("cheese");
  expect(options[1].textContent).toBe("Cheese");

  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
    "Pepperoni",
  );

  const img = screen.getByRole("img") as HTMLImageElement;
  expect(img.src).toBe(pizzas[0].image);
  expect(img.alt).toBe("Pepperoni");

  // default size is "M", so the price is sizes.M
  expect(screen.getByText("$15.00")).toBeDefined();
});

test("can add a pizza to the cart and check out", async () => {
  fetchMocker.mockResponse((request) => {
    if (request.url === "/api/pizzas") {
      return JSON.stringify(pizzas);
    }
    if (request.url === "/api/order") {
      return JSON.stringify({ status: "ok" });
    }
    return "";
  });

  setup();

  //menunggu sampai data pizza tampil
  await screen.findAllByRole("option");

  //menambahkan pizza (default pepperoni size M) ke dalam keranjang
  fireEvent.click(screen.getByRole("button", { name: "Add to Cart" }));

  //keranjang terisi: total menjadi 15.00 (pizza.sizes.M dari data dummy)
  await screen.findByText("Total: $15.00");

  //memeriksa isi keranjang lewat <ul> (role list), bukan lewat class .cart
  const cartList = screen.getByRole("list");
  expect(within(cartList).getByText("Pepperoni")).toBeDefined();
  expect(within(cartList).getByText("M")).toBeDefined();
  expect(within(cartList).getByText("$15.00")).toBeDefined();

  //menyelesaikan pesanan yang akan melakukan POST /api/order
  fireEvent.click(screen.getByRole("button", { name: "Checkout" }));

  //keranjang dibersihkan setelah pesanan terkirim
  await screen.findByText("Total: $0.00");

  //memastikan tepat satu request POST /api/order terkirim
  const orderRequests = fetchMocker
    .requests()
    .filter((r) => r.url === "/api/order");
  expect(orderRequests).toHaveLength(1);

  //memastikan payload POST /api/order sesuai: cart berisi pizza pepperoni size M
  expect(fetchMocker).toHaveBeenCalledWith("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cart: [{ pizza: pizzas[0], size: "M", price: "$15.00" }],
    }),
  });
});
