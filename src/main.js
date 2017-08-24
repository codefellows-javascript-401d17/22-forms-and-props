'use strict';

import './style/main.scss';
import React from 'react';
import ReactDom from 'react-dom';
import superagent from 'superagent';

const API_URL='http://www.reddit.com/r';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: []
    }

    this.searchReddit = this.searchReddit.bind(this);
  }

  componentDidUpdate() {
    console.log('__STATE__:', this.state.results);
  }

  searchReddit(topic, limit) {
    superagent.get(`${API_URL}/${topic}.json?limit=${limit}`)
    .then( response => {
      this.setState({
        results: response.body.data.children
      })
    })
    .catch(console.error);
  }

  render() {
    return (
      <div>
        <RedditSearchForm searchReddit={this.searchReddit} />
        <RedditSearchResults searchResults={this.state.results} />
      </div>
    )
  }
}

class RedditSearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: '',
      limit: 0
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTopicChange = this.handleTopicChange.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
  }

  handleTopicChange(e) {
    this.setState({ topic: e.target.value })
  }

  handleLimitChange(e) {
    this.setState({ limit: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.searchReddit(this.state.topic, this.state.limit);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type='text'
          name='searchTopic'
          placeholder='search for a topic'
          value={this.state.topic}
          onChange={this.handleTopicChange}
          required
        />

        <input
          type='number'
          name='searchLimit'
          placeholder='number of posts'
          value={this.state.limit}
          onChange={this.handleLimitChange}
          min='0'
          max='100'
          required
        />

        <button onSubmit={this.handleSubmit}>submit</button>
      </form>
    )
  }
}

class RedditSearchResults extends React.Component {

  render() {
    console.log('RESULTS:', this.props.searchResults);
    return (
      <div>
        <ul>
          {this.props.searchResults.map((posts, i) => {
            return (
              <li key={i}>
                <a href={posts.data.url}>
                  <h2>{posts.data.title}</h2>
                </a>
                <p>Upvotes: {posts.data.ups}</p>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

const container = document.createElement('main');
document.body.appendChild(container);
ReactDom.render(<App />, container);