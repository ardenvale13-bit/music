import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * MCP-compatible API endpoint
 * Exposes the music catalog for external tool access (e.g., Lincoln's MCP)
 *
 * GET /api/mcp?action=list          - List all songs
 * GET /api/mcp?action=get&id=xxx    - Get a specific song
 * GET /api/mcp?action=search&q=xxx  - Search songs
 * GET /api/mcp?action=tags          - List all tags
 * GET /api/mcp?action=stats         - Dashboard stats
 * GET /api/mcp?action=lyrics&id=xxx - Get just the lyrics for a song
 * GET /api/mcp?action=wips          - List all WIPs
 * GET /api/mcp?action=completed     - List all completed songs
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "list";

  try {
    switch (action) {
      case "list": {
        const songs = await prisma.song.findMany({
          include: { tags: { include: { tag: true } } },
          orderBy: { updatedAt: "desc" },
        });
        return NextResponse.json({
          success: true,
          count: songs.length,
          songs: songs.map(formatSong),
        });
      }

      case "get": {
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const song = await prisma.song.findUnique({
          where: { id },
          include: { tags: { include: { tag: true } } },
        });
        if (!song) return NextResponse.json({ error: "Not found" }, { status: 404 });

        return NextResponse.json({ success: true, song: formatSong(song) });
      }

      case "search": {
        const q = searchParams.get("q") || "";
        const songs = await prisma.song.findMany({
          where: {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { lyrics: { contains: q, mode: "insensitive" } },
              { about: { contains: q, mode: "insensitive" } },
            ],
          },
          include: { tags: { include: { tag: true } } },
          orderBy: { updatedAt: "desc" },
        });
        return NextResponse.json({
          success: true,
          query: q,
          count: songs.length,
          songs: songs.map(formatSong),
        });
      }

      case "lyrics": {
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const song = await prisma.song.findUnique({
          where: { id },
          select: { id: true, title: true, lyrics: true, status: true },
        });
        if (!song) return NextResponse.json({ error: "Not found" }, { status: 404 });

        return NextResponse.json({ success: true, song });
      }

      case "tags": {
        const tags = await prisma.tag.findMany({
          include: { _count: { select: { songs: true } } },
          orderBy: { name: "asc" },
        });
        return NextResponse.json({ success: true, tags });
      }

      case "stats": {
        const [total, completed, wips, tagCount] = await Promise.all([
          prisma.song.count(),
          prisma.song.count({ where: { status: "COMPLETED" } }),
          prisma.song.count({ where: { status: "WIP" } }),
          prisma.tag.count(),
        ]);
        const withAudio = await prisma.song.count({ where: { mp3Url: { not: null } } });

        return NextResponse.json({
          success: true,
          stats: { total, completed, wips, withAudio, tags: tagCount },
        });
      }

      case "wips": {
        const songs = await prisma.song.findMany({
          where: { status: "WIP" },
          include: { tags: { include: { tag: true } } },
          orderBy: { updatedAt: "desc" },
        });
        return NextResponse.json({
          success: true,
          count: songs.length,
          songs: songs.map(formatSong),
        });
      }

      case "completed": {
        const songs = await prisma.song.findMany({
          where: { status: "COMPLETED" },
          include: { tags: { include: { tag: true } } },
          orderBy: { updatedAt: "desc" },
        });
        return NextResponse.json({
          success: true,
          count: songs.length,
          songs: songs.map(formatSong),
        });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error) {
    console.error("MCP API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function formatSong(song: Record<string, unknown>) {
  const tags = song.tags as Array<{ tag: { id: string; name: string; color: string } }>;
  return {
    id: song.id,
    title: song.title,
    status: song.status,
    about: song.about,
    lyrics: song.lyrics,
    hasAudio: !!song.mp3Url,
    hasImage: !!song.imageUrl,
    tags: tags?.map((t) => t.tag.name) || [],
    createdAt: song.createdAt,
    updatedAt: song.updatedAt,
  };
}
