'use strict';

import './style/main.scss';
import React from 'react';
import ReactDom from 'react-dom';
import superagent from 'superagent';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    };
    this._loadSavedQuery.call(this);
    this.resultsListeners = [];
    this.searchReddit = this.searchReddit.bind(this);
    this.registerResultsListener = this.registerResultsListener.bind(this);
    this.notifyResultsChanged = this.notifyResultsChanged.bind(this);
  }

  _loadSavedQuery() {
    let savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      try {
        this.state.posts = JSON.parse(savedPosts);
      }
      catch (error) {
        localStorage.removeItem('posts');
      }

    }

    this.initialQuery = localStorage.getItem('query') || 'puppies';
    this.initialSubreddit = localStorage.getItem('subreddit') || 'aww';
    this.initialLimit = localStorage.getItem('limit') || 10;    
  }

  searchReddit(query, subreddit, limit) {
    return new Promise((resolve, reject) => {
      superagent.get(`https://www.reddit.com/r/${subreddit}/search.json`)
      .query({ q: query })
      .query({ restrict_sr: 'on' })
      .query({ sort: 'relevance' })
      .query({ t: 'all' })
      .query({ limit: limit })
      .then(response => {
        this.setState({ posts: this._getPosts(response.body) });
        this.notifyResultsChanged();
        localStorage.setItem('query', query);
        localStorage.setItem('subreddit', subreddit);
        localStorage.setItem('limit', limit);
        localStorage.setItem('posts', JSON.stringify(this.state.posts));
        resolve();
      })
      .catch(reject);
    });
  }

  _getPosts(results) {
    return results.data.children.map(post => {
      return {
        title: post.data.title,
        url: post.data.url,
        ups: post.data.ups
      };
    });
  }

  registerResultsListener(component) {
    this.resultsListeners.push(component);
  }

  notifyResultsChanged() {
    this.resultsListeners.forEach(resultsListener => {
      resultsListener.setState({ results: this.state.posts });
    });
  }

  render() {
    return (
      <div>
        <h1>Search Reddit</h1>
        <SearchForm searchReddit={this.searchReddit} initialQuery={this.initialQuery} initialSubreddit={this.initialSubreddit} initialLimit={this.initialLimit} />
        <SearchFormList initialPosts={this.state.posts} registerResultsListener={this.registerResultsListener} />
      </div>
    );
  }
}

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.initialQuery,
      subreddit: props.initialSubreddit,
      limit: props.initialLimit,
    };
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleSubredditChange = this.handleSubredditChange.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleQueryChange(e) {
    this.setState({ query: e.target.value });
  }
  
  handleSubredditChange(e) {
    this.setState({ subreddit: e.target.value });
  }

  handleLimitChange(e) {
    this.setState({ limit: e.target.value });
  }
  
  handleSubmit(e) {
    e.preventDefault();

    this.props.searchReddit(this.state.query, this.state.subreddit, this.state.limit)
    .then(() => {
      let searchFields = document.getElementsByClassName('searchField');
      for (let searchField of searchFields) {
        searchField.setCustomValidity('');
      }
    })
    .catch(error => {
      document.getElementById('subreddit').setCustomValidity(`Subreddit ${this.state.subreddit} not found.`);
    });
    
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label for="query">Search:</label>
        <input
          id="query"
          className="searchField"
          type="text"
          value={this.state.query}
          onChange={this.handleQueryChange}
          required
        />
        <label for="subreddit">Subreddit:</label>
        <input
          id="subreddit"
          className="searchField"
          type="text"
          value={this.state.subreddit}
          onChange={this.handleSubredditChange}
          required
        />
        <label for="resultCount">Results:</label>
        <input
          id="resultCount"
          className="searchField"
          type="number"
          value={this.state.limit}
          onChange={this.handleLimitChange}
          min="0"
          max="100"
          required
        />
        <input
          type="submit"
          value="Submit"
        />
      </form>
    );
  }
}

class SearchFormList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: this.props.initialPosts || []
    };
    props.registerResultsListener(this);
  }

  render() {
    if (this.state.results.length === 0) {
      return <ul></ul>;
    }
    let renderedResults = this.state.results.map((result, index) => {
      return (
        <li key={index}>
          <a href={result.url}><h3>{result.title}</h3></a>
          <span>Upvotes: {result.ups}</span>
        </li>
      );
    });

    return (
      <div>
        <h2 id="resultsHeader">Results</h2>
        <ul>
          {renderedResults}
        </ul>
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));