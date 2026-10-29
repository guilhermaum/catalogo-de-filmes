import { MovieService } from "./services/movieService.js";
import { MovieView } from "./views/movieView.js";
import { MovieController } from "./controllers/movieController.js";

const movieService = new MovieService();
const movieView = new MovieView();

new MovieController(movieService, movieView);
