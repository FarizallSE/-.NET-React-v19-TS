import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, expect, test, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import { ContactRoute } from "../routes/contact.lazy";

afterEach(cleanup);

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

test("can submit contact form", async () => {
  fetchMocker.mockResponse(JSON.stringify({ status: "ok" }));

  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <ContactRoute />
    </QueryClientProvider>,
  );

  const testData = {
    name: "Brian",
    email: "test@example.com",
    message: "This is a test message",
  };

  // form di aplikasi belum pakai <label>, jadi placeholder adalah nama yang tersedia
  fireEvent.change(screen.getByPlaceholderText("Name"), {
    target: { value: testData.name },
  });
  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: testData.email },
  });
  fireEvent.change(screen.getByPlaceholderText("Message"), {
    target: { value: testData.message },
  });

  fireEvent.click(screen.getByRole("button", { name: "Submit" }));

  expect((await screen.findByRole("heading", { level: 3 })).textContent).toBe(
    "Submitted!",
  );

  expect(fetchMocker.requests()).toHaveLength(1);
  expect(fetchMocker).toHaveBeenCalledWith("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testData),
  });
});
