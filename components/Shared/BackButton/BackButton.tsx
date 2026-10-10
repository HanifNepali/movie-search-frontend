"use client";

import { useRouter } from "next/navigation";

export const BackButton = () => {
  const router = useRouter();

  const handleClick = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex w-fit cursor-pointer items-center gap-1 py-1 text-sm text-brand-400 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
    >
      <span aria-hidden="true">←</span>
      Back
    </button>
  );
};
