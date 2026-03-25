export interface SongWithTags {
  id: string;
  title: string;
  lyrics: string | null;
  about: string | null;
  status: "COMPLETED" | "WIP";
  mp3Url: string | null;
  mp3Filename: string | null;
  imageUrl: string | null;
  imageFilename: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  tags: {
    tag: {
      id: string;
      name: string;
      color: string;
    };
  }[];
}

export interface TagData {
  id: string;
  name: string;
  color: string;
  _count?: { songs: number };
}
