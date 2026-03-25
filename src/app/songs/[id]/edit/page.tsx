import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SongForm } from "../../../components/SongForm";

export const dynamic = "force-dynamic";

export default async function EditSong({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [song, tags] = await Promise.all([
    prisma.song.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!song) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-text">Edit Song</h1>
      <SongForm
        song={JSON.parse(JSON.stringify(song))}
        tags={JSON.parse(JSON.stringify(tags))}
        mode="edit"
      />
    </div>
  );
}
