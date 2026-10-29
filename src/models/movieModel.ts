export interface Movie {
  id: number;
  title: string;
  summary: string;
  runtime: number;
  country: string;
  genres: string;
  year: number;
  watched: boolean;
}

export type MovieStatus = "watched" | "unwatched";
