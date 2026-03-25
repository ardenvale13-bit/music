"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoCloudUpload, IoMusicalNote, IoImage, IoClose, IoAdd } from "react-icons/io5";
import type { SongWithTags, TagData } from "@/lib/types";

interface SongFormProps {
  song?: SongWithTags;
  tags: TagData[];
  mode: "create" | "edit";
}

export function SongForm({ song, tags, mode }: SongFormProps) {
  const router = useRouter();
  const mp3InputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(song?.title || "");
  const [lyrics, setLyrics] = useState(song?.lyrics || "");
  const [about, setAbout] = useState(song?.about || "");
  const [status, setStatus] = useState<"COMPLETED" | "WIP">(song?.status || "WIP");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    song?.tags.map((t) => t.tag.id) || []
  );
  const [mp3File, setMp3File] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [mp3Preview, setMp3Preview] = useState(song?.mp3Filename || "");
  const [imagePreview, setImagePreview] = useState(song?.imageUrl || "");
  const [saving, setSaving] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [showNewTag, setShowNewTag] = useState(false);

  const handleMp3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMp3File(file);
      setMp3Preview(file.name);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;
    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTagName.trim() }),
    });
    if (res.ok) {
      const tag = await res.json();
      setSelectedTags((prev) => [...prev, tag.id]);
      setNewTagName("");
      setShowNewTag(false);
      router.refresh();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Upload files first if present
      let mp3Url = song?.mp3Url || null;
      let mp3Filename = song?.mp3Filename || null;
      let imageUrl = song?.imageUrl || null;
      let imageFilename = song?.imageFilename || null;

      if (mp3File) {
        const formData = new FormData();
        formData.append("file", mp3File);
        formData.append("type", "audio");
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (uploadRes.ok) {
          const data = await uploadRes.json();
          mp3Url = data.url;
          mp3Filename = data.filename;
        }
      }

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("type", "image");
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (uploadRes.ok) {
          const data = await uploadRes.json();
          imageUrl = data.url;
          imageFilename = data.filename;
        }
      }

      const songData = {
        title,
        lyrics: lyrics || null,
        about: about || null,
        status,
        mp3Url,
        mp3Filename,
        imageUrl,
        imageFilename,
        tagIds: selectedTags,
      };

      const url = mode === "create" ? "/api/songs" : `/api/songs/${song!.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(songData),
      });

      if (res.ok) {
        const saved = await res.json();
        router.push(`/songs/${saved.id}`);
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to save song:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-text-muted mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Song title..."
          className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder-text-faint focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-text-muted mb-2">Status</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStatus("WIP")}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              status === "WIP"
                ? "status-wip"
                : "bg-surface border border-border text-text-muted hover:bg-surface-hover"
            }`}
          >
            Work in Progress
          </button>
          <button
            type="button"
            onClick={() => setStatus("COMPLETED")}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              status === "COMPLETED"
                ? "status-completed"
                : "bg-surface border border-border text-text-muted hover:bg-surface-hover"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* About */}
      <div>
        <label className="block text-sm font-medium text-text-muted mb-2">About this song</label>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="What's this song about..."
          rows={3}
          className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder-text-faint focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all resize-none"
        />
      </div>

      {/* Lyrics */}
      <div>
        <label className="block text-sm font-medium text-text-muted mb-2">Lyrics</label>
        <textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          placeholder="Paste or write lyrics here..."
          rows={12}
          className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder-text-faint focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all resize-y font-mono text-sm leading-relaxed"
        />
      </div>

      {/* File uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MP3 Upload */}
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">Audio File (MP3)</label>
          <input
            ref={mp3InputRef}
            type="file"
            accept="audio/*"
            onChange={handleMp3Change}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => mp3InputRef.current?.click()}
            className="w-full bg-surface border border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 hover:border-accent hover:bg-accent-glow transition-all"
          >
            <IoMusicalNote className="text-2xl text-text-faint" />
            {mp3Preview ? (
              <span className="text-sm text-accent truncate max-w-full">{mp3Preview}</span>
            ) : (
              <span className="text-sm text-text-faint">Click to upload audio</span>
            )}
          </button>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">Cover Image</label>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="w-full bg-surface border border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 hover:border-accent hover:bg-accent-glow transition-all overflow-hidden"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Cover" className="w-20 h-20 object-cover rounded-lg" />
            ) : (
              <>
                <IoImage className="text-2xl text-text-faint" />
                <span className="text-sm text-text-faint">Click to upload image</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-text-muted mb-2">Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`tag-pill transition-all cursor-pointer ${
                selectedTags.includes(tag.id)
                  ? ""
                  : "opacity-40 hover:opacity-70"
              }`}
              style={{
                backgroundColor: `${tag.color}20`,
                color: tag.color,
                border: `1px solid ${selectedTags.includes(tag.id) ? tag.color : tag.color + "30"}`,
              }}
            >
              {tag.name}
            </button>
          ))}
          {showNewTag ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), createTag())}
                placeholder="Tag name..."
                className="bg-surface border border-border rounded-lg px-3 py-1 text-xs text-text w-28 focus:outline-none focus:border-accent"
                autoFocus
              />
              <button type="button" onClick={createTag} className="text-accent hover:text-accent-hover">
                <IoAdd className="text-lg" />
              </button>
              <button type="button" onClick={() => setShowNewTag(false)} className="text-text-faint hover:text-text">
                <IoClose className="text-lg" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowNewTag(true)}
              className="tag-pill bg-surface-hover text-text-faint border border-border hover:border-accent hover:text-accent transition-all cursor-pointer"
            >
              <IoAdd className="mr-1" /> Add Tag
            </button>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={saving || !title.trim()}
          className="px-8 py-3 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-medium rounded-xl hover:from-pink-400 hover:to-fuchsia-400 disabled:opacity-50 transition-all shadow-lg shadow-pink-500/20"
        >
          {saving ? "Saving..." : mode === "create" ? "Create Song" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 bg-surface border border-border text-text-muted rounded-xl hover:bg-surface-hover transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
