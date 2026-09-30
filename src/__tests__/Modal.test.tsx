import Modal from "../Modal";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test } from "vitest";

beforeEach(() => {
  const modalRoot = document.createElement("div");
  modalRoot.setAttribute("id", "modal");
  document.body.appendChild(modalRoot);
});

afterEach(() => {
  cleanup();

  const modalRoot = document.getElementById("modal");

  if (modalRoot) {
    modalRoot.remove();
  }
});

test("renders its children inside the modal root", async () => {
  const name = "My Favorite Pizza";
  const src = "https://picsum.photos/200";

  render(
    <Modal>
      <img src={src} alt={name} />
    </Modal>,
  );

  const img = (await screen.findByRole("img", { name })) as HTMLImageElement;

  expect(img.getAttribute("src")).toBe(src);
  expect(img.getAttribute("alt")).toBe(name);

  // Modal me-render lewat portal, jadi isinya harus ada di dalam #modal
  expect(document.getElementById("modal")?.contains(img)).toBe(true);
});
