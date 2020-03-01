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
    this.getArticleCount()
  }

  // never let a process live forever
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  getArticleCount = () => {
    fetch('http://localhost:3001/api/getArticle/count')
      .then(count => count.json())
      .then(res => this.setState({ articleCount: res.count}));
  }

  findArticles = (query) => {
    this.setState({ articles: [], isSearching: true });
    fetch(`http://localhost:3001/api/searchArticle/${query}`)
    .then(articles => articles.json())
    .then(res => this.setState({ searchResults: res.articles, success: res.success, isSearching: false, query }));
  }

  findKeyword = (query) => {
    this.setState({ articles: [], isSearching: true });
    fetch(`http://localhost:3001/api/searchKeyword/${query}`)
    .then(articles => articles.json())
    .then(res => this.setState({ searchResults: res.articles, success: res.success, isSearching: false, query: `keyword: ${query}` }));
  }

  render() {
    const mainComponent = 
      <Fragment>
        <header>
          <div class="navlinks">
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
