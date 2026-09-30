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

  // const { isLoading:isLoadingPastOrder, data: } = useQuery<PastOrder[]>({
  //   queryKey: ["past-order", focusedOrder],
  //   queryFn: () => getPastOrder(focusedOrder),
  //   enabled: !!focusedOrder,
  //   staleTime: 24 * 60 * 60 * 1000,
  // });

  const [page, setPage] = useState(1);
  const { isLoading, data } = useQuery<PastOrder[]>({
    queryKey: ["past-order", page],
    queryFn: () => getPastOrder(page),
    staleTime: 30000,
  });

  const { isLoading: isLoadingPastOrder, data: pastOrderData } =
    useQuery<PastOrderDetail>({
      queryKey: ["past-order", focusedOrder],
      queryFn: focusedOrder ? () => getPastOrders(focusedOrder) : skipToken,
      // enabled: !!focusedOrder,
      staleTime: 24 * 60 * 60 * 1000, // one day in milliseconds,
    });
  if (isLoading) {
    return (
      <div className="past-orders">
        <h2>LOADING …</h2>
      </div>
    );
  }
  if (!data) {
    throw new Error();
  }
  return (
    <div className="past-orders">
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Date</td>
            <td>Time</td>
          </tr>
        </thead>
        <tbody>
          {data?.map((order:PastOrder) => (
            <tr key={order.order_id}>
              <td>
                <button onClick={() => setFocusedOrder(order.order_id)}>
                  {order.order_id}
                </button>
              </td>
              <td>{order.date}</td>
              <td>{order.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pages">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <div>{page}</div>
        <button disabled={data.length < 10} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
      {focusedOrder ? (
        <Modal>
          <h2>Order #{focusedOrder}</h2>
          {!isLoadingPastOrder ? (
            <table>
              <thead>
                <tr>
                  <td>Image</td>
                  <td>Name</td>
                  <td>Size</td>
                  <td>Quantity</td>
                  <td>Price</td>
                  <td>Total</td>
                </tr>
              </thead>
              <tbody>
                {pastOrderData?.orderItems?.map((pizza:PastOrderItem) => (
                  <tr key={`${pizza.pizzaTypeId}_${pizza.size}`}>
                    <td>
                      <img src={pizza.image} alt={pizza.name} />
                    </td>
                    <td>{pizza.name}</td>
                    <td>{pizza.size}</td>
                    <td>{pizza.quantity}</td>
                    <td>{intl.format(pizza.price)}</td>
                    <td>{intl.format(pizza.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Memuat Data...</p>
          )}
          <button onClick={() => setFocusedOrder(undefined)}>Close</button>
        </Modal>
      ) : null}
    </div>
  );
}
