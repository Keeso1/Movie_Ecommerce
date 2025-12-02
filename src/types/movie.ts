export interface MovieGenre {
  genreId: string;
  genre: {
    id: string;
    name: string;
  };
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  price: number;
  releaseDate: string;
  imageUrl: string;
  runtime: number | null;
  deleted?: boolean | null;
  genres: MovieGenre[];
}
