import React, { Fragment } from 'react';

import SearchResult from './SearchResult';
import { commaNumber } from './utils';

const SearchResultList = ({query, results, keywordSearchHandler}) => {
  const top50 = results.slice(0,50);

  return (
    <Fragment>
      { results.length > 0 &&
        <div>
          <h4>Search Results ({top50.length} of {commaNumber(results.length)}) for '{query}' </h4>
          <ul>
            {top50.map(r => <SearchResult article={r} keywordSearchHandler={keywordSearchHandler} />)}
          </ul>
        </div>
      }
    </Fragment>
  );
}

export default SearchResultList;




// const query = $('#query').val();
// results = index.search(query);
// console.log(results)
// resultText = '<h3>Search results</h3>';
// if (results.length < 1) {
//   resultText += 'No results found';
// }
// else {
//   resultText += '<p>Found ' + results.length + ' results. Top 50:';
//   resultText += '<ol>'
//   let maxCount = (results.length < 10) ? results.length : 50;
//   for (let i = 0; i < maxCount; i++) {
//     console.log("")
//     resultText += '<li><span data-id=' + results[i]['ref'] + '>' + results[i]['doc']['title'] + ' (relevance: ' + results[i]['score'].toFixed(2) + ')</span></li>';
//   }
//   resultText += '</ol>'