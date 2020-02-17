import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const SearchTips = () => {
  return (
    <Fragment>
      <header>
        <div class="navlinks">
          <Link to="/">Back to search</Link>
        </div>
        <h1>CPEP - PubMed search</h1>
      </header>
      <h4>How to search</h4>
      <ol>
        <li>By default, words entered into the search box are treated as an OR boolean search. For example, typing <span className="example">aspirin tylenol</span> will return a list of all article citations that include the term "aspirin" <i>or</i> the term "tylenol."
        </li>
        <li>You can search for a phrase by entering a set of words in quotation marks. E.g., typing <span className="example">"patient care"</span> will result in a search for the words <i>patient</i> and <i>care</i> together, not individually.</li>
        <li>You can exclude terms from your search by prefacing them with a hypen (-). If you wanted to modify the previous search so that you only saw articles about patient care that did not involve cancer, you could type <span className="example">"patient care" -cancer</span>.</li>
        <li>Clicking one of the highlighted keywords in an article citation from a previous search result will immediately perform a keyword search for that term. This type of search returns a list of article citations that include that term <i>only</i> as a subject keyword.</li>
      </ol>
      <h4>Notes on search</h4>
      <ol>
        <li>Searches are case-insensitive and diacritic-insensitive. Regular text searches (i.e., non-keyword searches) look for query terms in a citation's title, abstract, and keywords, and are ranked by relevance.</li>
        <li>The search engine uses a stemmer. Thus, for example, a search for "puppies" will include results for "puppy" as well.</li>
        <li>Searches that are too broad (e.g., "cancer"), will result in an error. You will see the message <span className="example">Your search could not be completed. Your topic may be too broad; try narrowing your search terms.</span>. This is a limitation of the system due to computer memory constraints. If you encounter this error, redo your search with a more limited query, e.g. "pancreatic cancer."</li>
        <li>More complex searches may take longer to produce results.</li>
      </ol>
    </Fragment>
  );
}

export default SearchTips;