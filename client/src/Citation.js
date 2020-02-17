import React from 'react';

const Citation = ({article}) => {
  
  const authors = article.authors.length > 2 ? article.authors.slice(0,2).join('; ') + '; et al' : article.authors.join('; ');

  return (
    <div className="citation hangingIndent">
      {authors}. {article.title} <i>{article.journal}</i> {article.pubDate.year}; {article.issue.volume} ({article.issue.issue}). doi: {article.article_ids.doi}, pmid: {article.article_ids.pubmed}.
    </div>
  );
}

export default Citation;