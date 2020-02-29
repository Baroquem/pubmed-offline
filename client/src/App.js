import React, { Component, Fragment } from 'react';
import axios from 'axios';
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

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getArticleCount()
    // this.getDataFromDb();
    // if (!this.state.intervalIsSet) {
    //   let interval = setInterval(this.getDataFromDb, 1000);
    //   this.setState({ intervalIsSet: interval });
    // }
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    fetch('http://localhost:3001/api/getArticle')
      .then((articles) => articles.json())
      .then((res) => this.setState({ articles: res.articles }));
  };

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

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = (message) => {
    let currentIds = this.state.articles.map((article) => article.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post('http://localhost:3001/api/putArticle', {
      id: idToBeAdded,
      title: message,
    });
  };

  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB = (idTodelete) => {
    parseInt(idTodelete);
    let objIdToDelete = null;
    this.state.articles.forEach((article) => {
      if (article.id == idTodelete) {
        objIdToDelete = article._id;
      }
    });

    axios.delete('http://localhost:3001/api/deleteArticle', {
      data: {
        id: objIdToDelete,
      },
    });
  };

  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    parseInt(idToUpdate);
    this.state.articles.forEach((article) => {
      if (article.id == idToUpdate) {
        objIdToUpdate = article._id;
      }
    });

    axios.post('http://localhost:3001/api/updateArticle', {
      id: objIdToUpdate,
      update: { title: updateToApply },
    });
  };

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
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
