import type { Movie, MovieStatus } from "../models/movieModel.js";

export class MovieService {
  private movies: Movie[] = [];
  private nextId: number = 1;

  public getAllMovies(): Movie[] {
    return [...this.movies];
  }

  public getMovieById(id: number): Movie | undefined {
    return this.movies.find((movie) => movie.id === id);
  }

  public addMovie(
    title: string,
    summary: string,
    runtime: number,
    country: string,
    genres: string,
    year: number,
    status: MovieStatus,
  ): Movie {
    const movie: Movie = {
      id: this.nextId++,
      title,
      summary,
      runtime,
      country,
      genres,
      year,
      watched: status === "watched",
    };

    this.movies.push(movie);

    return movie;
  }

  public deleteMovie(id: number): boolean {
    const index = this.movies.findIndex((movie) => movie.id === id);

    if (index === -1) {
      return false;
    }

    this.movies.splice(index, 1);

    return true;
  }

  public changeStatus(id: number): Movie | undefined {
    const movie = this.getMovieById(id);

    if (!movie) {
      return undefined;
    }

    movie.watched = !movie.watched;

    return movie;
  }

  public searchMovies(title: string = "", genre: string = ""): Movie[] {
    const searchTerm = title.trim().toLocaleLowerCase("pt-BR");

    return this.movies.filter((movie) => {
      const matchesTitle = movie.title
        .toLocaleLowerCase("pt-BR")
        .includes(searchTerm);

      const matchesGenre = genre === "" || movie.genres === genre;

      return matchesTitle && matchesGenre;
    });
  }

  public getSummary(): {
    total: number;
    watched: number;
    unwatched: number;
  } {
    const watched = this.movies.filter((movie) => movie.watched).length;

    return {
      total: this.movies.length,
      watched,
      unwatched: this.movies.length - watched,
    };
  }
}
