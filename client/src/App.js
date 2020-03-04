import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import './App.css';
import Bookbag from './Bookbag';
import SearchPage from './SearchPage';
import SearchTips from './SearchTips';

require('es6-promise').polyfill();
require('isomorphic-fetch');

class App extends Component {
  // initialize state
  state = {
    articles: [],
    articleCount: 0,
    searchResults: [],
    id: 0,
    title: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
    isSearching: false,
    query: null,
    success: true,
  };

  componentDidMount() {
   // this.getArticleCount()
  }

  // never let a process live forever
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  getArticleCount = () => {
    fetch('/api/getArticle/count')
      .then(count => count.json())
      .then(res => this.setState({ articleCount: res.count}));
  }

  findArticles = (query) => {
    this.setState({ articles: [], isSearching: true });
    fetch(`/api/searchArticle/${query}`)
    .then(response => {
      console.log("response", response)
      if (!response.ok) { throw response }
      return response.json();
    })
    //.then(articles => articles.json())
    .then(res => this.setState({ searchResults: res.articles, success: res.success, isSearching: false, query }))
    .catch(err => {
      this.setState({ error: err, isSearching: false, success: false })
      console.log("ERROR: ", err)
    })
  }

  // Potential errors (name: message):
  // Server isn't responding: TypeError: Failed to fetch

  findKeyword = (query) => {
    this.setState({ articles: [], isSearching: true });
    fetch(`/api/searchKeyword/${query}`)
    .then(response => {
      console.log("response", response)
      if (!response.ok) { throw response }
      return response.json();
    })
    .then(res => this.setState({ searchResults: res.articles, success: res.success, isSearching: false, query: `keyword: ${query}` }))
    .catch(err => {
      this.setState({ error: err, isSearching: false, success: false })
      console.log("ERROR: ", err)
    })
  }

  render() {
    const mainComponent = 
      <Fragment>
        <header>
          <div className="navlinks">
            <div id="bookbag"><Link to="/bookbag">Bookbag</Link></div>
            <div id="howto"><Link to="/howto">Search tips</Link></div>
          </div>
          <h1>CPEP - PubMed search</h1>
        </header>
        <SearchPage
          articleCount={this.state.articleCount}
          searchHandler={this.findArticles}
          keywordSearchHandler={this.findKeyword}
          success={this.state.success}
          error={this.state.error}
          query={this.state.query}
          searchResults={this.state.searchResults}
          isSearching={this.state.isSearching}
        />
      </Fragment>;

    return (
      <BrowserRouter>
        <div className="App">
          {/* <header className="App-header"> */}
          <Route exact path="/" render={() => mainComponent} />
          <Route path="/bookbag" component={Bookbag} />
          <Route path="/howto" component={SearchTips} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
