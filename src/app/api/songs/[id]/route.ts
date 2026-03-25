import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single song
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const song = await prisma.song.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  });

  if (!song) {
    return NextResponse.json({ error: "Song not found" }, { status: 404 });
  }

  return NextResponse.json(song);
}

// PUT update song
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { title, lyrics, about, status, mp3Url, mp3Filename, imageUrl, imageFilename, tagIds } = body;

  // Delete existing tag associations
  await prisma.songTag.deleteMany({ where: { songId: id } });

  const song = await prisma.song.update({
    where: { id },
    data: {
      title,
      lyrics,
      about,
      status,
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
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json(song);
}

// DELETE song
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.song.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
