import React, {Suspense, useEffect, useReducer} from "react";
import "../index.css";
import Header from "./Header";
import Movie from "./Movie";
import Search from "./Search";

const initialState = {
  loading: true,
  movies: [],
  errorMessage: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null,
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload,
      };
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error,
      };
    default:
      return state;
  }
};

const MOVIE_API_URL = "https://www.omdbapi.com/?s=man&apikey=4a3b711b";
const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch(MOVIE_API_URL)
      .then((response) => response.json())
      .then((jsonResponse) => {
        dispatch({
          type: "SEARCH_MOVIES_SUCCESS",
          payload: jsonResponse.search,
        });
      });
  }, []);

  const search = async (searchValue) => {
    dispatch({
      type: "SEARCH_MOVIES_REQUEST",
      payload:searchValue
    });
    try {
      fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=4a3b711b`)
          .then((response) => response.json())
          .then((jsonResponse) => {
            if (jsonResponse === "True") {
              dispatch({
                type: "SEARCH_MOVIES_SUCCESS",
                payload: jsonResponse.Search,
              });
              dispatch({
                type: "SEARCH_MOVIES_FAILURE",
                error: jsonResponse.Error,
              });
            }
          });
    }catch(error){
      console.log(error.log.data);
    }
  };
  const { movies, errorMessage, loading } = state;
  return (
    <div className="App">
      <Header text="Hooked" />
      <Search search={search} />
      <p className="App-intro"> A few favorite movies </p>
      <Suspense fallback={'loading ...'} children={<Movie />} >
      <div className="movies">
        {loading && !errorMessage ? (
          <span>loading...</span>
        ) : errorMessage ? (
          <div className="errorMessage">{errorMessage}</div>
        ) : (
          movies.map((movie, index) => (
            <Movie key={`${index}-${movie.title}`} movie={movie} />
          ))
        )}
      </div>
      </Suspense>
    </div>
  );
};

export default App;
