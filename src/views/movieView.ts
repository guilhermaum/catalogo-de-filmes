import type { Movie } from "../models/movieModel.js";

export class MovieView {
  private movieList = this.getElement<HTMLDivElement>("movie-list");

  private totalMovies = this.getElement<HTMLElement>("total-movies");

  private watchedMovies = this.getElement<HTMLElement>("watched-movies");

  private unwatchedMovies = this.getElement<HTMLElement>("unwatched-movies");

  private resultsCount = this.getElement<HTMLElement>("results-count");

  private formMessage = this.getElement<HTMLParagraphElement>("form-message");

  private getElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);

    if (!element) {
      throw new Error(`Elemento não encontrado: ${id}`);
    }

    return element as T;
  }

  public showMessage(message: string, type: "success" | "error"): void {
    this.formMessage.textContent = message;
    this.formMessage.className = `message ${type}`;
  }

  public clearMessage(): void {
    this.formMessage.textContent = "";
    this.formMessage.className = "message";
  }

  public resetCatalogFilters(): void {
    const searchInput = document.getElementById("search-input");
    const filterSelect = document.getElementById("status-filter");

    if (searchInput instanceof HTMLInputElement) {
      searchInput.value = "";
    }

    if (filterSelect instanceof HTMLSelectElement) {
      filterSelect.value = "all";
    }
  }

  public bindAddMovie(handler: (movie: Omit<Movie, "id">) => void): void {
    const form = this.getElement<HTMLFormElement>("movie-form");

    form.addEventListener("submit", (event: SubmitEvent) => {
      event.preventDefault();

      const formData = new FormData(form);
      const title = String(formData.get("title") ?? "").trim();
      const summary = String(formData.get("summary") ?? "").trim();
      const country = String(formData.get("country") ?? "").trim();
      const genres = String(formData.get("genres") ?? "").trim();
      const runtime = Number(formData.get("runtime"));
      const year = Number(formData.get("year"));
      const status = formData.get("status");

      if (
        !title ||
        !summary ||
        !country ||
        !genres ||
        !Number.isInteger(runtime) ||
        runtime < 1 ||
        runtime > 1000 ||
        !Number.isInteger(year) ||
        year < 1888 ||
        year > 2100 ||
        (status !== "watched" && status !== "unwatched")
      ) {
        this.showMessage("Preencha os dados do filme corretamente.", "error");
        return;
      }

      form.reset();
      handler({
        title,
        summary,
        country,
        genres,
        runtime,
        year,
        watched: status === "watched",
      });
    });

    form.addEventListener("reset", () => this.clearMessage());
  }

  public renderSummary(summary: {
    total: number;
    watched: number;
    unwatched: number;
  }): void {
    this.totalMovies.textContent = String(summary.total);
    this.watchedMovies.textContent = String(summary.watched);
    this.unwatchedMovies.textContent = String(summary.unwatched);
  }

  public renderMovies(movies: Movie[], totalRegistered: number): void {
    this.movieList.replaceChildren();

    this.resultsCount.textContent = `${movies.length} ${movies.length === 1 ? "filme" : "filmes"}`;

    if (movies.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";

      const heading = document.createElement("h3");
      heading.textContent =
        totalRegistered === 0
          ? "Seu catálogo está vazio"
          : "Nenhum filme encontrado";

      const description = document.createElement("p");
      description.textContent =
        totalRegistered === 0
          ? "Cadastre seu primeiro filme usando o formulário acima."
          : "Tente mudar a busca ou selecionar outro gênero.";

      emptyState.append(heading, description);
      this.movieList.append(emptyState);

      return;
    }

    for (const movie of movies) {
      this.movieList.append(this.createMovieCard(movie));
    }
  }

  private createMovieCard(movie: Movie): HTMLElement {
    const card = document.createElement("article");
    card.className = "movie-card";

    const top = document.createElement("div");
    top.className = "movie-card-top";

    const genres = document.createElement("span");
    genres.className = "movie-genres";
    genres.textContent = movie.genres;

    const status = document.createElement("span");
    status.className = movie.watched ? "status watched" : "status unwatched";

    status.textContent = movie.watched ? "Assistido" : "Não assistido";

    top.append(genres, status);

    const title = document.createElement("h3");
    title.className = "movie-title";
    title.textContent = movie.title;

    const summary = document.createElement("p");
    summary.className = "movie-summary";
    summary.textContent = movie.summary;

    const details = document.createElement("div");
    details.className = "movie-details";

    const year = document.createElement("span");
    year.textContent = `Ano: ${movie.year}`;

    const runtime = document.createElement("span");
    runtime.textContent = `Duração: ${movie.runtime} min`;

    const country = document.createElement("span");
    country.textContent = `País: ${movie.country}`;

    details.append(year, runtime, country);

    const actions = document.createElement("div");
    actions.className = "movie-actions";

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "button-small";
    toggleButton.dataset.action = "toggle";
    toggleButton.dataset.id = String(movie.id);

    toggleButton.textContent = movie.watched
      ? "Marcar como não assistido"
      : "Marcar como assistido";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "button-small button-delete";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = String(movie.id);
    deleteButton.textContent = "Excluir";

    actions.append(toggleButton, deleteButton);

    card.append(top, title, summary, details, actions);

    return card;
  }

  public bindToggleMovie(handler: (id: number) => void): void {
    this.movieList.addEventListener("click", (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const button = target.closest<HTMLButtonElement>(
        'button[data-action="toggle"]',
      );

      if (!button) return;

      const id = Number(button.dataset.id);

      if (Number.isInteger(id)) {
        handler(id);
      }
    });
  }

  public bindDeleteMovie(handler: (id: number) => void): void {
    this.movieList.addEventListener("click", (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const button = target.closest<HTMLButtonElement>(
        'button[data-action="delete"]',
      );

      if (!button) return;

      const id = Number(button.dataset.id);

      if (Number.isInteger(id)) {
        handler(id);
      }
    });
  }

  public bindSearch(handler: (query: string) => void): void {
    const searchInput = document.getElementById("search-input");

    if (!(searchInput instanceof HTMLInputElement)) {
      return;
    }

    searchInput.addEventListener("input", () => {
      handler(searchInput.value);
    });
  }

  public bindFilter(
    handler: (status: "all" | "watched" | "unwatched") => void,
  ): void {
    const filterSelect = document.getElementById("status-filter");

    if (!(filterSelect instanceof HTMLSelectElement)) {
      return;
    }

    filterSelect.addEventListener("change", () => {
      const value = filterSelect.value;

      if (value === "all" || value === "watched" || value === "unwatched") {
        handler(value);
      }
    });
  }
}
