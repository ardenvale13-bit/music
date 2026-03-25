import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all tags
export async function GET() {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { songs: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(tags);
}

// POST create tag
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, color } = body;

  const tag = await prisma.tag.create({
    data: {
      name,
      color: color || "#ec4899",
    },
  });

  return NextResponse.json(tag, { status: 201 });
}

// DELETE tag
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Tag ID required" }, { status: 400 });
  }

  await prisma.tag.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
