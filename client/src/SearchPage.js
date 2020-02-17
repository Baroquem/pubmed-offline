import React, { Fragment } from 'react';
import { css } from "@emotion/core";
import MoonLoader from "react-spinners/MoonLoader";

import FirstDocuments from './FirstDocuments';
import SearchHeader from './SearchHeader';
import SearchResultList from './SearchResultList';
import { commaNumber } from './utils';

const SearchPage = ({articleCount, searchHandler, keywordSearchHandler, isSearching, success, searchResults, query}) => {

  // Can be a string as well. Need to ensure each key-value pair ends with ;
  const override = css`
    border-color: blue;
  `;

  // const [searchResults, setSearchResults] = useState();
  console.log("getting results", searchResults)
  return (
    <Fragment>
      <h2>Search Page</h2>
      <p>Searching {commaNumber(articleCount)} article citations</p>
      <SearchHeader searchHandler={searchHandler} />
      <FirstDocuments />
      { isSearching &&
        <div className="sweet-loading">
          <MoonLoader
            css={override}
            size={20}
            //size={"150px"} this also works
            color={"#123abc"}
            loading={isSearching}
          />
          Searching ...
        </div>
      }
      { !isSearching && success &&
        <SearchResultList query={query} results={searchResults} keywordSearchHandler={keywordSearchHandler} />
      }
      { !isSearching && !success &&
        <p>Your search could not be completed. Your topic may be too broad; try narrowing your search terms.</p>
      }
    </Fragment>
  );
}

export default SearchPage;
