import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import BookList from "../book-list";
import Header from "../header";
import FilterPanel from "../filter-panel";
import {
  authorsSelector,
  filteredBooksSelector,
  publishersSelector,
  filteredFavoritesBooksSelector,
} from "../../redux/selectors";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#f5f5f5",
  },
  item1: {
    marginTop: "25px",
  },
  item2: {
    marginTop: "25px",
    marginBottom: "-40px",
  },
}));

const Content = ({ publishers, authors, selector, equalityFn }) => {
  const classes = useStyles();
  const [books] = useSelector(selector, equalityFn);

  return (
    <main role="main">
      <Container maxWidth="lg" justify="flex-start">
        <Grid container spacing={5}>
          <Box clone order={{ xs: 2, sm: 1 }} className={classes.item1}>
            <Grid item xs={12} sm={6} md={8}>
              <BookList books={books} />
            </Grid>
          </Box>
          <Box clone order={{ xs: 1, sm: 2 }} className={classes.item2}>
            <Grid item xs={12} sm={6} md={4}>
              <FilterPanel publishers={publishers} authors={authors} />
            </Grid>
          </Box>
        </Grid>
      </Container>
    </main>
  );
};

/**
 * allBooksEqualityFn can optimisation (get 12 renders)
 * if click on several Favorite buttons too fast
 * So it there only to show that efficiency not forgotten
 */

export default function App() {
  const classes = useStyles();
  const publishers = useSelector(publishersSelector, shallowEqual);
  const authors = useSelector(authorsSelector, shallowEqual);

  // need only rerender main book
  const allBooksEqualityFn = (a, b) => {
    if (b[1] !== a[1]) return false;
    if (b[2] !== a[2]) return false;
    if (a.length !== b.length) return false;
    const aIds = a[0].map((v) => v.get("id")).sort();
    const bIds = b[0].map((v) => v.get("id")).sort();
    for (let i = 0; i < aIds.length; ++i) {
      if (aIds[i] !== bIds[i]) return false;
    }
    return true;
  };

  // need always rerender favorite books
  const favoriteBooksEqualityFn = (a, b) => a === b;

  return (
    <div className={classes.root}>
      <Header />
      <Switch>
        <Route
          path="/"
          exact
          render={() => (
            <Content
              selector={filteredBooksSelector}
              equalityFn={allBooksEqualityFn}
              publishers={publishers}
              authors={authors}
            />
          )}
        />
        <Route
          path="/favorites"
          render={() => (
            <Content
              selector={filteredFavoritesBooksSelector}
              publishers={publishers}
              equalityFn={favoriteBooksEqualityFn}
              authors={authors}
            />
          )}
        />
      </Switch>
    </div>
  );
}
