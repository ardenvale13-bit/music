import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { IoArrowBack, IoPencil, IoTrash, IoMusicalNote } from "react-icons/io5";
import { AudioPlayer } from "../../components/AudioPlayer";
import { DeleteButton } from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function SongDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const song = await prisma.song.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  });

  if (!song) notFound();

  return (
    <div className="max-w-4xl space-y-8">
      {/* Back + Actions */}
      <div className="flex items-center justify-between">
        <Link
          href={song.status === "COMPLETED" ? "/songs" : "/wips"}
          className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors"
        >
          <IoArrowBack />
          Back
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/songs/${song.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl text-sm text-text-muted hover:text-accent hover:border-accent transition-all"
          >
            <IoPencil /> Edit
          </Link>
          <DeleteButton songId={song.id} />
        </div>
      </div>

      {/* Hero */}
      <div className="flex gap-8">
        {/* Cover image */}
        <div className="w-64 h-64 rounded-2xl overflow-hidden flex-shrink-0 bg-surface border border-border">
          {song.imageUrl ? (
            <img
              src={song.imageUrl}
              alt={song.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-hover to-surface">
              <IoMusicalNote className="text-6xl text-text-faint" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                song.status === "COMPLETED" ? "status-completed" : "status-wip"
              }`}
            >
              {song.status === "COMPLETED" ? "Complete" : "Work in Progress"}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-text">{song.title}</h1>

          {song.about && (
            <p className="text-text-muted leading-relaxed">{song.about}</p>
          )}

          {/* Tags */}
          {song.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {song.tags.map(({ tag }) => (
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
            </div>
          )}

          <p className="text-xs text-text-faint">
            Last updated {new Date(song.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Audio Player */}
      {song.mp3Url && (
        <AudioPlayer src={song.mp3Url} title={song.title} />
      )}

      {/* Lyrics */}
      {song.lyrics && (
        <div className="bg-surface rounded-2xl border border-border p-8">
          <h2 className="text-lg font-semibold text-text mb-4">Lyrics</h2>
          <pre className="text-text-muted whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {song.lyrics}
          </pre>
        </div>
      )}
    </div>
  );
}
