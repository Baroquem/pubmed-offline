import React from 'react';

export const subjectsDisplay = (subjects, searchHandler) => {
  const linkedSubjects = subjects.map(s => <span className="keyword" key={s} onClick={(e) => {e.stopPropagation(); searchHandler(s)}}>{s}</span>);
  return linkedSubjects;
}

// Display publication date. Input date should be an object of the form
// { year, month, day }
export const pubDateDisplay = (date) => {
  if (!date) return '';

  var months = {
    'Jan' : '01',
    'Feb' : '02',
    'Mar' : '03',
    'Apr' : '04',
    'May' : '05',
    'Jun' : '06',
    'Jul' : '07',
    'Aug' : '08',
    'Sep' : '09',
    'Oct' : '10',
    'Nov' : '11',
    'Dec' : '12'
  }
  // If the month is represented by an abbreviation (Jan, Feb, etc.), convert to numeric for display
  // (this is inconsistent in the source data)
  if (date && date.month && months[date.month]) date.month = months[date.month];
  if (date.month && date.year)
    return [date.month, date.day, date.year].filter(Boolean).join('/');
  else if (date.year)
    return date.year;
}

export const publicationDisplay = (article) => {
  console.log("issue", article.issue)
  const journal = article.journal ? article.journal: null
  const volume = article.issue && article.issue.volume ? `vol. ${article.issue.volume}` : null;
  const issue = article.issue && article.issue.issue ? `issue ${article.issue.issue}` : null;
  const date = pubDateDisplay(article.pubDate);
  return [journal, volume, issue, date].filter(Boolean).join(', ');
}

// See https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
// for following regex
export const commaNumber = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// Retrieve an array of saved articles from sessionStorage
export const getSavedArticles = () => {
  const savedArticlesString = sessionStorage.getItem('pubmedSavedArticles');
  return savedArticlesString ? JSON.parse(savedArticlesString) : [];
};

// Add a new article to the array of saved articles in sessionStorage
export const saveArticle = (article) => {
  if (article) {
    let savedArticles = getSavedArticles();
    savedArticles.push(article);
    sessionStorage.setItem('pubmedSavedArticles', JSON.stringify(savedArticles));
  }
}

// Delete all items from sessionStorage
export const clearBookbag = () => {
  sessionStorage.removeItem('pubmedSavedArticles');
};

