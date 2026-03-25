"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoTrash } from "react-icons/io5";

export function DeleteButton({ songId }: { songId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    const res = await fetch(`/api/songs/${songId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/songs");
      router.refresh();
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-rose-400">Delete?</span>
        <button
          onClick={handleDelete}
          className="px-3 py-1.5 bg-rose-500/20 border border-rose-500/40 text-rose-400 rounded-lg text-sm hover:bg-rose-500/30 transition-all"
        >
          Yes
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1.5 bg-surface border border-border text-text-muted rounded-lg text-sm hover:bg-surface-hover transition-all"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl text-sm text-text-muted hover:text-rose-400 hover:border-rose-400/40 transition-all"
    >
      <IoTrash /> Delete
    </button>
  );
}
