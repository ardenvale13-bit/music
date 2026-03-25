"use client";

import Link from "next/link";
import { IoMusicalNote, IoImage } from "react-icons/io5";
import type { SongWithTags } from "@/lib/types";

interface SongCardProps {
  song: SongWithTags;
}

export function SongCard({ song }: SongCardProps) {
  return (
    <Link href={`/songs/${song.id}`}>
      <div className="group bg-surface rounded-2xl border border-border overflow-hidden hover:border-pink-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/5">
        {/* Image */}
        <div className="aspect-square relative bg-surface-hover overflow-hidden">
          {song.imageUrl ? (
            <img
              src={song.imageUrl}
              alt={song.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-hover to-surface">
              <IoMusicalNote className="text-4xl text-text-faint" />
            </div>
          )}

          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                song.status === "COMPLETED" ? "status-completed" : "status-wip"
              }`}
            >
              {song.status === "COMPLETED" ? "Complete" : "WIP"}
            </span>
          </div>

          {/* MP3 indicator */}
          {song.mp3Url && (
            <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <IoMusicalNote className="text-pink-400 text-sm" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-text group-hover:text-accent transition-colors truncate">
            {song.title}
          </h3>
          {song.about && (
            <p className="text-text-muted text-sm mt-1 line-clamp-2">{song.about}</p>
          )}

          {/* Tags */}
          {song.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {song.tags.slice(0, 3).map(({ tag }) => (
                <span
                  key={tag.id}
                  className="tag-pill"
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                    border: `1px solid ${tag.color}30`,
                  }}
                >
                  {tag.name}
                </span>
              ))}
              {song.tags.length > 3 && (
                <span className="tag-pill text-text-faint">+{song.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
