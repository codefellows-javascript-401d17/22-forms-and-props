'use strict';

import './style/main.scss';
import React from 'react';
import ReactDom from 'react-dom';
import superagent from 'superagent';

const API_URL='http://www.reddit.com/r';
// const API_LIMITER=.json

// http://reddit.com/r/${searchFormBoard}.json?limit=${searchFormLimit}

class RedditSearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      limit: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
  }

  handleTextChange(e) {
    this.setState({ text: e.target.value })
  }

  handleLimitChange(e) {
    this.setState({ limit: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.textParam(this.state.text)
    this.props.limitParam(this.state.limit)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type='text'
          name='searchSubreddit'
          placeholder='search for a post'
          value={this.state.text}
          onChange={this.handleTextChange}
        />

        <input
          type='text'
          name='searchLimit'
          placeholder='number of posts'
          value={this.state.limit}
          onChange={this.handleLimitChange}
        />

        <p>{this.state.text}</p>
        <p>{this.state.limit}</p>
      </form>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    console.log('props:', props);

    this.state = {
      redditLookup: {},
      redditResults: {},
      redditSearchError: null
    }

  }

  componentDidUpdate() {
    console.log('__STATE__:', this.state);
  }

  componentDidMount() {
    console.log('Hello World');

    superagent.get(`${API_URL}/${this.props.textParam}.json?limit=${this.props.limitParam}`)
    .then( res => {
      console.log('res.body:', res.body.data.children)
    })
    .catch(console.error);
  };

  render() {
    return (
      <div>
        <RedditSearchForm />
      </div>
    )
  }
}


const container = document.createElement('main');
document.body.appendChild(container);
ReactDom.render(<App />, container);