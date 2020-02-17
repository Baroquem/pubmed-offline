import React, { Fragment, useState } from 'react';

const SearchHeader = ({searchHandler}) => {
  const [query, setQuery] = useState();

  const handleChange = event => {
    setQuery(event.target.value);
  };

  const handleSearch = event => {
    event.preventDefault()
    searchHandler(query);
  }

  const handleKeyup = event => {
    if (event.keyCode === 13) searchHandler(query);
  }

  return (
    <Fragment>
      <div id="documentCount"></div>
      <div id="search">
        <input type="text" id="query" onChange={handleChange} onKeyUp={handleKeyup} />
        <button type="submit" id="searchButton" onClick={handleSearch}>Search</button>
      </div>
    </Fragment>
  );
}

export default SearchHeader;