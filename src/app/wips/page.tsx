import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { IoAdd } from "react-icons/io5";
import { SongCard } from "../components/SongCard";

export const dynamic = "force-dynamic";

export default async function WIPSongs() {
  const songs = await prisma.song.findMany({
    where: { status: "WIP" },
    include: { tags: { include: { tag: true } } },
    orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Works in Progress</h1>
          <p className="text-text-muted mt-1">{songs.length} songs in the works</p>
        </div>
        <Link
          href="/songs/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-medium rounded-xl hover:from-pink-400 hover:to-fuchsia-400 transition-all shadow-lg shadow-pink-500/20"
        >
          <IoAdd className="text-lg" />
          New Song
        </Link>
      </div>

      {/* Song Grid */}
      {songs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {songs.map((song) => (
            <SongCard key={song.id} song={JSON.parse(JSON.stringify(song))} />
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border p-12 text-center">
          <p className="text-text-muted mb-4">No works in progress</p>
          <Link
            href="/songs/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-medium rounded-xl transition-all"
          >
            <IoAdd className="text-lg" />
            Start Something New
          </Link>
        </div>
      )}
    </div>
  );
}
