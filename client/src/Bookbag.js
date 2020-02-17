import React, { Fragment } from 'react';
import { Link, useHi } from 'react-router-dom';

import Citation from './Citation';
import { getSavedArticles, clearBookbag } from './utils';

const Bookbag = () => {

  const savedArticles = getSavedArticles();

  const confirmClear = () => {
    if (window.confirm('Are you sure you wish to clear the bookbag? All saved article citations will be lost.')) {
      clearBookbag();
      window.location.reload(false);
    }
  }

  const count = savedArticles.length;
  const verbForm = (number) => number !== 1 ? 'are' : 'is';

  return (
    <Fragment>
      <header>
        <div class="navlinks">
          <Link to="/">Back to search</Link>
        </div>
        <h1>CPEP - PubMed search</h1>
        <h2>Bookbag</h2>
      </header>
      <br/>
      {count < 1 &&
        <p>Your bookbag is empty.</p>
      }
      {count >= 1 &&
        <div>
          <button style={{float:"right"}} onClick={confirmClear}>Clear bookbag</button>
          <div id="bookbag-items">
            There {verbForm(count)} {savedArticles ? savedArticles.length : '0'} saved article{count !== 1 ? 's' : ''} in the bookbag.
            <br/><br/>
            <h4>Article citations</h4>
            {savedArticles.map(article => <Citation article={article} />)}
          </div>
        </div>
      }
    </Fragment>
  );
}

export default Bookbag;