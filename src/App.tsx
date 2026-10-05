import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// add at top
// remove useState import from react import
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
// const queryClient = new QueryClient();

// replace App
const App = () => {
  return (
    <Provider store={store}>
    <StrictMode>
      {/* <QueryClientProvider client={queryClient}> */}
        <RouterProvider router={router} />
      {/* </QueryClientProvider> */}
    </StrictMode>
    </Provider>
  );
};

// dia akan mengambil elemen dengan id "root" dari HTML dan membuat root React di dalamnya
// Kemudian, ia akan merender komponen App ke dalam root tersebut.
const container = document.getElementById("root");
if (!container) {
  throw new Error("no container to render to");
}
const root = createRoot(container);
root.render(<App />);
