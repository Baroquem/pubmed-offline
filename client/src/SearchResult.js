import React, { useState } from 'react';

import ArticleView from './ArticleView';
import { subjectsDisplay, pubDateDisplay } from './utils';

const SearchResult = ({article, keywordSearchHandler}) => {
  const [showArticleView, setArticleView] = useState(false);

  const toggleArticleView = () => {
    setArticleView(!showArticleView)
  }

  const mySearchHandler = (search) => {
    console.log("handling search", search)
    keywordSearchHandler(search)
  }

  if (showArticleView) {
    return <ArticleView article={article} toggle={toggleArticleView} keywordSearchHandler={keywordSearchHandler} />
  }
  else {
    return (
      <div key={article._id} className="searchResult" onClick={toggleArticleView}>
        <span className="clickForDetail">Click for details</span>
        <span><strong>{article.title}</strong>  {pubDateDisplay(article.pubDate)}</span>
        <br/><br/>
        <span><i>Subjects</i>: {subjectsDisplay(article.subjects, mySearchHandler)}</span>
      </div>
    );
  }
}

export default SearchResult;

//<li><span data-id={r._id} key={r._id}>{r.title}</span></li>