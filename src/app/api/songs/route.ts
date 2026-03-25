import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all songs (with optional status filter)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const tag = searchParams.get("tag");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { lyrics: { contains: search, mode: "insensitive" } },
      { about: { contains: search, mode: "insensitive" } },
    ];
  }
  if (tag) {
    where.tags = { some: { tag: { name: { equals: tag, mode: "insensitive" } } } };
  }

  const songs = await prisma.song.findMany({
    where,
    include: {
      tags: { include: { tag: true } },
    },
    orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
  });

  return NextResponse.json(songs);
}

// POST create a new song
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, lyrics, about, status, mp3Url, mp3Filename, imageUrl, imageFilename, tagIds } = body;

  const song = await prisma.song.create({
    data: {
      title,
      lyrics,
      about,
      status: status || "WIP",
      mp3Url,
      mp3Filename,
      imageUrl,
      imageFilename,
      tags: tagIds?.length
        ? {
            create: tagIds.map((tagId: string) => ({ tagId })),
          }
        : undefined,
    },
    include: {
      tags: { include: { tag: true } },
    },
  });

  return NextResponse.json(song, { status: 201 });
}
