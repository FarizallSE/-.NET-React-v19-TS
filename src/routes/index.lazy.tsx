import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="index mx-auto my-30 grid max-w-175 grid-cols-1 gap-7.5 md:grid-cols-2">
      <div className="index-brand flex flex-col">
        <h1 className="font-pacifico font-normal text-primary">Padre Gino's</h1>
        <p className="max-w-[315px] text-[40px] font-bold text-secondary uppercase">
          Pizza & Art at a location near you
        </p>
      </div>
      <ul className="flex flex-col items-center justify-center">
        <li className="w-full max-w-62.5 text-center">
          <Link
            className=" btn text-primary mb-2.5 block w-full max-w-62.5 text-center"
            to="/order"
          >
            Order
          </Link>
        </li>
        <li className="w-full max-w-62.5 text-center">
          <Link
            className=" btn text-primary mb-2.5 block w-full max-w-62.5 text-center"
            to="/past"
          >
            Past Orders
          </Link>
        </li>
        {/* // after past orders */}
        <li className="w-full max-w-62.5 text-center">
          <Link
            className="btn text-primary mb-2.5 block w-full max-w-62.5 text-center"
            to="/contact"
          >
            Contact
          </Link>
        </li>
      </ul>
    </div>
  );
}
