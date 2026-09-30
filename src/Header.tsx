import { CartContext } from "./contexts";
import { useContext } from "react";
import { Link } from "@tanstack/react-router";

export default function Header() {
  // top of function
  const [cart] = useContext(CartContext);
  return (
    <nav>
      <Link to={"/"}>
        <h1 className="logo">Padre Gino's Pizza</h1>
      </Link>
      <div className="nav-cart">
        🛒<span className="nav-cart-number">{cart.length}</span>
      </div>
    </nav>
  );
}
