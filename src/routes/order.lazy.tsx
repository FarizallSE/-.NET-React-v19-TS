import { createLazyFileRoute } from "@tanstack/react-router";
// import { useQuery } from "@tanstack/react-query";
import Pizza from "../Pizza";
import { useState } from "react";
import Cart from "../Cart";
// import { CartContext } from "../contexts";
// import getPizzas from "../api/getPizzas";
import { type Pizza as PizzaType, type PizzaSize } from "../APIResponseTypes";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addToCart, clearCart, selectedCartItems } from "../cartSlice";
import { useGetPizzasQuery } from "../api/pizzaApi";

export const Route = createLazyFileRoute("/order")({
  component: Order,
});

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function Order() {
  const [pizzaType, setPizzaType] = useState("pepperoni");
  const [pizzaSize, setPizzaSize] = useState<PizzaSize>("M");
  // const [cart, setCart] = useContext(CartContext);
  // const [checkoutLoading, setCheckoutLoading] = useState(false);
  const cart = useAppSelector(selectedCartItems);
  const dispatch = useAppDispatch();
  const { data: pizzaTypes = [], isLoading: isLoadingPizzas } = useGetPizzasQuery();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const loading = isLoadingPizzas || isCheckingOut;

  // const { data, isPending: isLoadingPizzas } = useQuery<PizzaType[]>({
  //   queryKey: ["pizzas"],
  //   queryFn: () => getPizzas(),
  // });

  // const pizzaTypes = data ?? [];

  // const loading = isLoadingPizzas || checkoutLoading;

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
    setIsCheckingOut(true);

    await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart,
      }),
    });

    // setCart([]);
    dispatch(clearCart());
    setIsCheckingOut(false);
  }

  return (
    <div className="mx-auto grid max-w-1300 grid-cols-1 gap-12.5 lg:grid-cols-[2fr_1fr]">
      <div className="w-full lg:ml-[5%]">
        <h2>Create Order</h2>
        <form
          className="flex flex-col md:flex-row md:justify-between"
          onSubmit={(e) => {
            e.preventDefault();
            if (!selectedPizza || !price) {
              return;
            }
            dispatch(
              addToCart({ pizza: selectedPizza, size: pizzaSize, price }),
            );
          }}
        >
          <div className="text-center p-3.75 md:border-r md:border-border">
            <div className="my-2.5 w-full border-b border-border p-3.75 text-center md:border-r md:border-b-0">
              <label htmlFor="pizza-type">Pizza Type</label>
              <select
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
            <div>
              <label htmlFor="pizza-size">Pizza Size</label>
              <div>
                <span>
                  <input
                    checked={pizzaSize === "S"}
                    onChange={(e) => setPizzaSize(e.target.value as PizzaSize)}
                    type="radio"
                    name="pizza-size"
                    value="S"
                    id="pizza-s"
                  />
                  <label htmlFor="pizza-s">Small</label>
                </span>
                <span>
                  <input
                    checked={pizzaSize === "M"}
                    onChange={(e) => setPizzaSize(e.target.value as PizzaSize)}
                    type="radio"
                    name="pizza-size"
                    value="M"
                    id="pizza-m"
                  />
                  <label htmlFor="pizza-m">Medium</label>
                </span>
                <span>
                  <input
                    checked={pizzaSize === "L"}
                    onChange={(e) => setPizzaSize(e.target.value as PizzaSize)}
                    type="radio"
                    name="pizza-size"
                    value="L"
                    id="pizza-l"
                  />
                  <label htmlFor="pizza-l">Large</label>
                </span>
              </div>
            </div>
            <button className="btn border p-3.75" type="submit">
              Add to Cart
            </button>
          </div>
          <div className="border-t border-border p-3.75 text-center leading-normal lg:border-l">
            {loading || !selectedPizza ? (
              <h3>Loading...</h3>
            ) : (
              <div className="border-t border-border p-3.75 text-center leading-normal lg:border-l">
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
      </div>
      {/* // just inside the last closing div */}
      {loading ? <h2>LOADING …</h2> : <Cart checkout={checkout} cart={cart} />}
    </div>
  );
}
