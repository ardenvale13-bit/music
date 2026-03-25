"use client";

import { useState, useEffect } from "react";
import { IoAdd, IoTrash, IoColorPalette } from "react-icons/io5";
import type { TagData } from "@/lib/types";

const PRESET_COLORS = [
  "#ec4899", "#f43f5e", "#e879f9", "#a855f7",
  "#6366f1", "#3b82f6", "#06b6d4", "#14b8a6",
  "#10b981", "#84cc16", "#eab308", "#f59e0b",
  "#ef4444", "#f97316",
];

export default function TagsPage() {
  const [tags, setTags] = useState<TagData[]>([]);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#ec4899");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tags")
      .then((r) => r.json())
      .then(setTags)
      .finally(() => setLoading(false));
  }, []);

  const createTag = async () => {
    if (!newName.trim()) return;
    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim(), color: newColor }),
    });
    if (res.ok) {
      const tag = await res.json();
      setTags((prev) => [...prev, tag].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName("");
    }
  };

  const deleteTag = async (id: string) => {
    const res = await fetch(`/api/tags?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setTags((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Tags</h1>
        <p className="text-text-muted mt-1">Organize your songs with tags</p>
      </div>

      {/* Create new tag */}
      <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
        <h2 className="text-sm font-medium text-text-muted">Create a new tag</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createTag()}
            placeholder="Tag name..."
            className="flex-1 bg-bg border border-border rounded-xl px-4 py-2.5 text-text placeholder-text-faint focus:outline-none focus:border-accent"
          />
          <button
            onClick={createTag}
            disabled={!newName.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-medium rounded-xl disabled:opacity-50 transition-all"
          >
            <IoAdd />
            Add
          </button>
        </div>

        {/* Color picker */}
        <div className="flex items-center gap-2 flex-wrap">
          <IoColorPalette className="text-text-faint" />
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setNewColor(color)}
              className={`w-7 h-7 rounded-full transition-all ${
                newColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-surface scale-110" : "hover:scale-110"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Tag list */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-text-faint text-center py-8">Loading tags...</div>
        ) : tags.length === 0 ? (
          <div className="text-text-faint text-center py-8">No tags yet. Create one above!</div>
        ) : (
          tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between bg-surface rounded-xl border border-border p-4 glow-border"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="text-text font-medium">{tag.name}</span>
                <span className="text-text-faint text-xs">
                  {tag._count?.songs || 0} songs
                </span>
              </div>
              <button
                onClick={() => deleteTag(tag.id)}
                className="text-text-faint hover:text-rose-400 transition-colors p-1"
              >
                <IoTrash />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
