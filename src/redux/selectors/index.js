import { createSelector } from "reselect";
import { isBookPassFilters } from "../utils";

export const sortTypeSelector = (state) => state.filters.sortType;

export const booksSelector = (state) => state.books.entities;

export const createBookIsFavoriteSelector = (id) => {
  return createSelector(booksSelector, (books) => {
    return books.getIn([id, "isFavorite"]);
  });
};

export const createBookRatingSelector = (id) => {
  return createSelector(booksSelector, (books) => {
    return books.getIn([id, "rating"]);
  });
};

export const booksArraySelector = (state) =>
  state.books.entities.valueSeq().toArray();

export const favoritesBooksSelector = (state) =>
  state.books.entities
    .valueSeq()
    .toArray()
    .filter((book) => book.get("isFavorite"));

export const filtersSelector = (state) => state.filters;

export const titleFilterSelector = (state) =>
  filtersSelector(state).get("title");

export const publishersSelector = (state) => state.publishers;

export const authorsSelector = (state) => state.authors;

export const filteredBooksSelector = createSelector(
  booksArraySelector,
  filtersSelector,
  (books, filters) => [
    books.filter((book) => isBookPassFilters(book, filters)),
    filters.sortType,
    filters.title,
  ]
);

export const filteredFavoritesBooksSelector = createSelector(
  favoritesBooksSelector,
  filtersSelector,
  (books, filters) => [
    books.filter((book) => isBookPassFilters(book, filters)),
    filters.sortType,
    filters.title,
  ]
);
