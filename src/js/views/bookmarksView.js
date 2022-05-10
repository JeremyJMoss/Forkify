import { ResultsView } from "./resultsView";

class BookmarksView extends ResultsView{
    _parentEl = document.querySelector(".bookmarks__list");
    _errMessage = "No bookmarks yet. Find a nice recipe and bookmark it."
}

export default new BookmarksView();