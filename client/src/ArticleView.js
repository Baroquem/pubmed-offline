import React, { useState } from 'react';

import { subjectsDisplay, publicationDisplay, saveArticle } from './utils';

const ArticleView = ({article, toggle, keywordSearchHandler}) => {

  const [saved, setSaved] = useState(false);

  const mySearchHandler = (search) => {
    console.log("handling search", search)
    keywordSearchHandler(search)
  }

  console.log("article being shown", article)

  let doi = null
  if (article.article_ids) {
    console.log("article ids", article.article_ids)
    doi = article.article_ids.doi
    // if (typeof article.article_ids === 'string') {
    //   // Force to array
    //   article.article_ids = article.article_ids.split();
    // }
    // article.article_ids.keys.forEach(id => {
    //   if (id.match(/\//)) {
    //     doi = id;
    //   }
    // })
  }
  
  return (
    <div className="fullArticle">
      <span className="close" onClick={toggle}>X</span>
      <div className="title">{article.title}</div>
      <div className="journal"><i>in</i> {publicationDisplay(article)}</div>
      <br/>
      <div className="authors">{article.authors.join('; ')}</div>
      <br/>
      <div><b>Subjects</b>
        <br />
        <i>{subjectsDisplay(article.subjects, mySearchHandler)}</i>
      </div>
      <br/>
      { article.abstract &&
        <div>
          <b>Abstract</b>
          <p>{article.abstract}</p>
        </div>
      }
      <br/>
      {doi &&
        <span>DOI: {doi}</span>
      }
      <br/><br/>
      <button onClick={() => { saveArticle(article); setSaved(true); }}>Save to bookbag</button>
      {saved && 
        <p>Saved!</p>
      }
      <br/><br/><br />
      <div>{article.sourceFile}</div>
    </div>
  );
}

export default ArticleView;