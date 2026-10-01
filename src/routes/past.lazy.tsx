import { useState } from "react";
import { skipToken, useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import getPastOrders from "../api/getPastOrders";
import getPastOrder from "../api/getPastOrder";
import type { PastOrder, PastOrderDetail, PastOrderItem } from "../APIResponseTypes";
import Modal from "../Modal";

export const Route = createLazyFileRoute("/past")({
  component: PastOrdersRoute,
});

function PastOrdersRoute() {
  // NOTE: In the course, Brian makes this a hook/module
  const intl = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  // top of the render function
  const [focusedOrder, setFocusedOrder] = useState<number>();

  const [page, setPage] = useState(1);
  const { isLoading, data } = useQuery<PastOrder[]>({
    queryKey: ["past-order", page],
    queryFn: () => getPastOrder(page),
    staleTime: 30000,
  });

  const { isLoading: isLoadingPastOrder, data: pastOrderData } =
    useQuery<PastOrderDetail>({
      queryKey: ["past-order-detail", focusedOrder],
      queryFn: focusedOrder ? () => getPastOrders(focusedOrder) : skipToken,
      staleTime: 24 * 60 * 60 * 1000, // one day in milliseconds,
    });
  if (isLoading) {
    return (
      <div className="mx-auto w-[90%] min-h-162.5 max-w-225 px-3.75">
        <h2>LOADING …</h2>
      </div>
    );
  }
  if (!data) {
    throw new Error();
  }
  return (
    <div className="mx-auto w-[90%] min-h-162.5 max-w-225 px-3.75">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th scope="col" className="head">
                ID
              </th>
              <th scope="col" className="head">
                Date
              </th>
              <th scope="col" className="head">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((order: PastOrder) => (
              <tr key={order.order_id} className="col">
                <td className="row">
                  <button
                    className="btn"
                    onClick={() => setFocusedOrder(order.order_id)}
                  >
                    {order.order_id}
                  </button>
                </td>
                <td className="row">{order.date}</td>
                <td className="row">{order.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-evenly">
        <button
          className="btn"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <div className="font-pacifico text-[20px] text-primary">{page}</div>
        <button
          className="btn"
          disabled={data.length < 10}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
      {focusedOrder ? (
        <Modal>
          <h2>Order #{focusedOrder}</h2>
          {!isLoadingPastOrder ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="head">
                      Image
                    </th>
                    <th scope="col" className="head">
                      Name
                    </th>
                    <th scope="col" className="head">
                      Size
                    </th>
                    <th scope="col" className="head">
                      Quantity
                    </th>
                    <th scope="col" className="head">
                      Price
                    </th>
                    <th scope="col" className="head">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pastOrderData?.orderItems?.map((pizza: PastOrderItem) => (
                    <tr
                      key={`${pizza.pizzaTypeId}_${pizza.size}`}
                      className="row"
                    >
                      <td className="row">
                        <img
                          className="w-12.5"
                          src={pizza.image}
                          alt={pizza.name}
                        />
                      </td>
                      <td className="row">{pizza.name}</td>
                      <td className="row">{pizza.size}</td>
                      <td className="row">{pizza.quantity}</td>
                      <td className="row">{intl.format(pizza.price)}</td>
                      <td className="row">{intl.format(pizza.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Memuat Data...</p>
          )}
          <button
            className="btn"
            onClick={() => setFocusedOrder(undefined)}
          >
            Close
          </button>
        </Modal>
      ) : null}
    </div>
  );
}
