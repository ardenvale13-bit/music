import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { IoMusicalNotes, IoAlbums, IoConstruct, IoAdd, IoHeadset } from "react-icons/io5";
import { SongCard } from "./components/SongCard";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [totalSongs, completedCount, wipCount, withAudio, recentSongs] =
    await Promise.all([
      prisma.song.count(),
      prisma.song.count({ where: { status: "COMPLETED" } }),
      prisma.song.count({ where: { status: "WIP" } }),
      prisma.song.count({ where: { mp3Url: { not: null } } }),
      prisma.song.findMany({
        include: { tags: { include: { tag: true } } },
        orderBy: { updatedAt: "desc" },
        take: 6,
      }),
    ]);

  const stats = [
    { label: "Total Songs", value: totalSongs, icon: IoMusicalNotes, color: "from-pink-400 to-fuchsia-500" },
    { label: "Completed", value: completedCount, icon: IoAlbums, color: "from-emerald-400 to-emerald-600" },
    { label: "In Progress", value: wipCount, icon: IoConstruct, color: "from-amber-400 to-amber-600" },
    { label: "With Audio", value: withAudio, icon: IoHeadset, color: "from-violet-400 to-violet-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-text-muted mt-1">Your music at a glance</p>
        </div>
        <Link
          href="/songs/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-medium rounded-xl hover:from-pink-400 hover:to-fuchsia-400 transition-all shadow-lg shadow-pink-500/20"
        >
          <IoAdd className="text-lg" />
          New Song
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-surface rounded-2xl border border-border p-5 glow-border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-faint text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-text mt-1">{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <Icon className="text-white text-xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Songs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text">Recent Activity</h2>
          <Link href="/songs" className="text-sm text-accent hover:text-accent-hover transition-colors">
            View all
          </Link>
        </div>

        {recentSongs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentSongs.map((song) => (
              <SongCard key={song.id} song={JSON.parse(JSON.stringify(song))} />
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-2xl border border-border p-12 text-center">
            <IoMusicalNotes className="text-5xl text-text-faint mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text mb-2">No songs yet</h3>
            <p className="text-text-muted mb-6">Start adding your music to the catalog</p>
            <Link
              href="/songs/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-medium rounded-xl hover:from-pink-400 hover:to-fuchsia-400 transition-all"
            >
              <IoAdd className="text-lg" />
              Add Your First Song
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
