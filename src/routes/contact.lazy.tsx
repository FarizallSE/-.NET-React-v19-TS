import { createLazyFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import postContact from "../api/postContact";
import type { SubmitEvent } from "react";

export const Route = createLazyFileRoute("/contact")({
  component: ContactRoute,
});

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function ContactRoute() {
  const mutation = useMutation({
    mutationFn: function (e: SubmitEvent<HTMLFormElement>) {
      e.preventDefault();
      const formData = new FormData(e.target);
      return postContact(
        getString(formData, "name"),
        getString(formData, "email"),
        getString(formData, "message"),
      );
    },
  });

  return (
    <div className="align-center justify-items-center">
      <h2>Contact</h2>
      {mutation.isSuccess ? (
        <h3 className="color-secondary align-center m-[50px] text-sm">Submitted!</h3>
      ) : (
        <form className="flex flex-col text-center justify-center" onSubmit={mutation.mutate}>
          <input className="w-[500px] p-[8px] border border-border border-[2px] rounded-[5px] mb-[15px] mt-[15px] focus:ring focus:ring-black" name="name" placeholder="Name" />
          <input className="w-[500px] p-[8px] border border-border border-[2px] rounded-[5px] mb-[15px] mt-[15px] focus:ring focus:ring-black" type="email" name="email" placeholder="Email" />
          <textarea className="w-[500px] p-[8px] border border-border border-[2px] rounded-[5px] mb-[15px] mt-[15px] min-h-[200px] focus:ring focus:ring-black" placeholder="Message" name="message"></textarea>
          <button className="btn">Submit</button>
        </form>
      )}
    </div>
  );
}
