// import { type CartItem } from "./contexts";
import { type CartItem } from "./cartSlice";

interface Props {
  cart: CartItem[];
  checkout: () => void;
}

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD", // feel free to change to your local currency
});

export default function Cart({ cart, checkout }: Props) {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    const current = cart[i];
    total += current.pizza.sizes[current.size];
  }

  return (
    <div className="border-t border-border p-3.75 text-center leading-normal lg:border-t-0 lg:border-l">
      <h2>Cart</h2>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            <span className="size">{item.size}</span> –
            <span className="type">{item.pizza.name}</span> –
            <span className="price">{item.price}</span>
          </li>
        ))}
      </ul>
      <p>Total: {intl.format(total)}</p>
      <button className="btn border p-2" onClick={checkout}>
        Checkout
      </button>
    </div>
  );
}
