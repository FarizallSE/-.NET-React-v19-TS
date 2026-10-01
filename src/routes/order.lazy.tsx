import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import Pizza from "../Pizza";
import { useState, useContext } from "react";
import Cart from "../Cart";
import { CartContext } from "../contexts";
import getPizzas from "../api/getPizzas";
import { type Pizza as PizzaType, type PizzaSize } from "../APIResponseTypes";

export const Route = createLazyFileRoute("/order")({
  component: Order,
});

// shared by the three size radios: the label is the visible "card", the input is visually hidden
const sizeLabelClass =
  "mx-3.75 mb-2.5 inline-flex h-20 w-20 cursor-pointer items-center justify-center rounded-[5px] border border-[#999] bg-border text-[#999] peer-checked:bg-white peer-checked:text-[#333] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary";

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});


export function Order() {
  const [pizzaType, setPizzaType] = useState("pepperoni");
  const [pizzaSize, setPizzaSize] = useState<PizzaSize>("M");
  const [cart, setCart] = useContext(CartContext);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { data, isPending: isLoadingPizzas } = useQuery<PizzaType[]>({
    queryKey: ["pizzas"],
    queryFn: () => getPizzas(),
  });

  const pizzaTypes = data ?? [];

  const loading = isLoadingPizzas || checkoutLoading;

  let price: string | undefined;
  let selectedPizza: PizzaType | undefined;

  if (!loading) {
    selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id);
    price = selectedPizza
      ? intl.format(selectedPizza.sizes[pizzaSize])
      : undefined;
  }

  // inside the render body
  async function checkout() {
    setCheckoutLoading(true);

    await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart,
      }),
    });

    setCart([]);
    setCheckoutLoading(false);
  }

  return (
    <div className="mx-auto grid max-w-325 grid-cols-1 gap-12.5 lg:grid-cols-[2fr_1fr]">
      <h2>Create Order</h2>
      <form
        className="flex flex-col md:flex-row md:justify-between"
        onSubmit={(e) => {
          e.preventDefault();
          if (!selectedPizza || !price) {
            return;
          }
          setCart([...cart, { pizza: selectedPizza, size: pizzaSize, price }]);
        }}
      >
        <div className="my-2.5 w-full border-r border-border p-3.75 text-center">
          <div className="my-2.5 text-center">
            <label
              className="mb-2.5 block text-[20px] text-secondary"
              htmlFor="pizza-type">Pizza Type</label>
            <select
              className="form-select mb-7.5 block w-full py-1.25 pl-1.25 text-[16px]"
              onChange={(e) => setPizzaType(e.target.value)}
              name="pizza-type"
              value={pizzaType}
            >
              {pizzaTypes.map((pizza) => (
                <option key={pizza.id} value={pizza.id}>
                  {pizza.name}
                </option>
              ))}
            </select>
          </div>
          <div className="my-2.5 text-center">
            <label htmlFor="pizza-size">Pizza Size</label>
            <div className="my-2.5 text-center">
              <span>
                <input
                  className="peer sr-only"
                  checked={pizzaSize === "S"}
                  onChange={(e) => setPizzaSize(e.target.value as PizzaSize)}
                  type="radio"
                  name="pizza-size"
                  value="S"
                  id="pizza-s"
                />
                <label htmlFor="pizza-s" className={sizeLabelClass}>
                  Small
                </label>
              </span>
              <span>
                <input
                  className="peer sr-only"
                  checked={pizzaSize === "M"}
                  onChange={(e) => setPizzaSize(e.target.value as PizzaSize)}
                  type="radio"
                  name="pizza-size"
                  value="M"
                  id="pizza-m"
                />
                <label htmlFor="pizza-m" className={sizeLabelClass}>
                  Medium
                </label>
              </span>
              <span>
                <input
                  className="peer sr-only"
                  checked={pizzaSize === "L"}
                  onChange={(e) => setPizzaSize(e.target.value as PizzaSize)}
                  type="radio"
                  name="pizza-size"
                  value="L"
                  id="pizza-l"
                />
                <label htmlFor="pizza-l" className={sizeLabelClass}>
                  Large
                </label>
              </span>
            </div>
          </div>
          <button type="submit" className="btn border border-border p-3 border-primary" >Add to Cart</button>
        </div>
        <div className="order-pizza">
          {loading || !selectedPizza ? (
            <h3>Loading...</h3>
          ) : (
            <div className="order-pizza">
              <Pizza
                name={selectedPizza.name}
                description={selectedPizza.description}
                image={selectedPizza.image}
              />
              <p>{price}</p>
            </div>
          )}
        </div>
      </form>
      {/* // just inside the last closing div */}
      {loading ? <h2>LOADING …</h2> : <Cart checkout={checkout} cart={cart} />}
    </div>
  );
}
