import { Record } from "immutable";
import fixtures from "../../fixtures.json";
import { arrToMap, getBookRating } from "../utils";
import {
  ALPHABET_ASCENDING_ORDER,
  ALPHABET_DESCENDING_ORDER,
  DATE_ASCENDING_ORDER,
  DATE_DESCENDING_ORDER,
  SORT_BOOKS,
  RATING_ASCENDING_ORDER,
  RATING_DESCENDING_ORDER,
  ADD_FAVORITE_BOOK,
  REMOVE_FAVORITE_BOOK,
} from "../../constants";

const collator = new Intl.Collator(undefined, {
  sensitivity: "base",
  ignorePunctuation: true,
});

const BookRecord = Record({
  id: null,
  title: "",
  author: "",
  published: null,
  publisher: "",
  coverSrc: "",
  isFavorite: null,
  rating: 0,
});

const ReducerRecord = Record({
  entities: arrToMap(fixtures, BookRecord),
  sortType: null,
});

export default (state = new ReducerRecord(), action) => {
  const { type, payload } = action;
  switch (type) {
    case SORT_BOOKS + ALPHABET_ASCENDING_ORDER:
      return state
        .updateIn(["entities"], (entities) =>
          entities.sort((a, b) =>
            collator.compare(a.get("title"), b.get("title"))
          )
        )
        .set("sortType", payload.orderConstant);

    case SORT_BOOKS + ALPHABET_DESCENDING_ORDER:
      return state
        .updateIn(["entities"], (entities) =>
          entities.sort((a, b) =>
            collator.compare(b.get("title"), a.get("title"))
          )
        )
        .set("sortType", payload.orderConstant);
    case SORT_BOOKS + DATE_ASCENDING_ORDER:
      return state
        .updateIn(["entities"], (entities) =>
          entities.sort((a, b) => {
            if (a.get("published") > b.get("published")) return 1;
            if (a.get("published") < b.get("published")) return -1;
            return 0;
          })
        )
        .set("sortType", payload.orderConstant);
    case SORT_BOOKS + DATE_DESCENDING_ORDER:
      return state
        .updateIn(["entities"], (entities) =>
          entities.sort((a, b) => {
            if (a.get("published") < b.get("published")) return 1;
            if (a.get("published") > b.get("published")) return -1;
            return 0;
          })
        )
        .set("sortType", payload.orderConstant);

    case SORT_BOOKS + RATING_ASCENDING_ORDER:
      return state
        .updateIn(["entities"], (entities) =>
          entities.sort((a, b) => {
            const aRating = getBookRating(a);
            const bRating = getBookRating(b);
            if (aRating < bRating) return -1;
            if (aRating > bRating) return 1;
            return 0;
          })
        )
        .set("sortType", payload.orderConstant);

    case SORT_BOOKS + RATING_DESCENDING_ORDER:
      return state
        .updateIn(["entities"], (entities) =>
          entities.sort((a, b) => {
            const aRating = getBookRating(a);
            const bRating = getBookRating(b);
            if (aRating < bRating) return 1;
            if (aRating > bRating) return -1;
            return 0;
          })
        )
        .set("sortType", payload.orderConstant);

    case ADD_FAVORITE_BOOK:
      return state.setIn(
        ["entities", payload.book.get("id"), "isFavorite"],
        true
      );

    case REMOVE_FAVORITE_BOOK:
      return state.setIn(
        ["entities", payload.book.get("id"), "isFavorite"],
        false
      );

    default:
      return state;
  }
};
