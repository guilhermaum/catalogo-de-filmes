import type { Movie, MovieStatus } from "../models/movieModel.js";
import { MovieService } from "../services/movieService.js";
import { MovieView } from "../views/movieView.js";

export class MovieController {
  private service: MovieService;
  private view: MovieView;

  private searchQuery = "";
  private selectedStatus: "all" | MovieStatus = "all";

  constructor(service: MovieService, view: MovieView) {
    this.service = service;
    this.view = view;

    this.initialize();
  }

  private initialize(): void {
    this.view.bindToggleMovie(this.handleToggleMovie);
    this.view.bindDeleteMovie(this.handleDeleteMovie);
    this.view.bindSearch(this.handleSearch);
    this.view.bindFilter(this.handleFilter);
    this.view.bindAddMovie(this.addMovie);

    this.renderMovies();
  }

  private renderMovies(): void {
    const allMovies = this.service.getAllMovies();

    let filteredMovies = allMovies;

    if (this.searchQuery.trim() !== "") {
      filteredMovies = this.service.searchMovies(this.searchQuery);
    }

    if (this.selectedStatus !== "all") {
      filteredMovies = filteredMovies.filter((movie) =>
        this.selectedStatus === "watched" ? movie.watched : !movie.watched,
      );
    }

    this.view.renderMovies(filteredMovies, allMovies.length);

    this.view.renderSummary({
      total: allMovies.length,
      watched: allMovies.filter((movie) => movie.watched).length,
      unwatched: allMovies.filter((movie) => !movie.watched).length,
    });
  }

  private handleToggleMovie = (id: number): void => {
    this.service.changeStatus(id);
    this.renderMovies();
  };

  private handleDeleteMovie = (id: number): void => {
    this.service.deleteMovie(id);
    this.renderMovies();
    this.view.showMessage("Filme excluído com sucesso.", "success");
  };

  private handleSearch = (query: string): void => {
    this.searchQuery = query;
    this.renderMovies();
  };

  private handleFilter = (status: "all" | MovieStatus): void => {
    this.selectedStatus = status;
    this.renderMovies();
  };

  public addMovie = (movie: Omit<Movie, "id">): void => {
    this.service.addMovie(
      movie.title,
      movie.summary,
      movie.runtime,
      movie.country,
      movie.genres,
      movie.year,
      movie.watched ? "watched" : "unwatched",
    );

    this.searchQuery = "";
    this.selectedStatus = "all";
    this.view.resetCatalogFilters();
    this.renderMovies();

    this.view.showMessage("Filme cadastrado com sucesso.", "success");
  };
}
