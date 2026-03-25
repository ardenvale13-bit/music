import { prisma } from "@/lib/prisma";
import { SongForm } from "../../components/SongForm";

export const dynamic = "force-dynamic";

export default async function NewSong() {
  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-text">New Song</h1>
      <SongForm tags={JSON.parse(JSON.stringify(tags))} mode="create" />
    </div>
  );
}
