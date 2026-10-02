// import { CartContext } from "./contexts";
// import { useContext } from "react";
import { Link } from "@tanstack/react-router";
import { useAppSelector } from "./hooks";
import { selectedCartCount } from "./cartSlice";

// export default function Header() {
//   const [cart] = useContext(CartContext);

export default function Header() {
  const cartCount = useAppSelector(selectedCartCount);

  return (
    <nav
      className=" grid w-full border-b border-[#ccc] [grid-template-areas:'._logo_logo_logo_cart']
      "
    >
      <Link
        to={"/"}
        className=" flex items-center justify-center [grid-area:logo]"
      >
        <h1
          className="h-[110px] w-[inherit] border-b border-[#ccc] bg-left bg-no-repeat pt-5 pb-5 [content:url('/public/padre_gino.svg')] [grid-area:logo]"
        >
          Padre Gino's Pizza
        </h1>
      </Link>

      <div
        className="flex items-center justify-center text-[40px] [grid-area:cart]"
      >
        🛒
        <span
          className=" relative top-[-17px] left-[-17px] flex h-5 w-5 items-center justify-center rounded-full bg-[#33670a] text-[18px] text-white"
        >
          {cartCount}
        </span>
      </div>
    </nav>
  );
}
