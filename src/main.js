import './style/main.scss';
import React from 'react';
import ReactDom from 'react-dom';
import superagent from 'superagent';

const API_URL ='http://reddit.com/r/';

class RedditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardName: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBoardChange = this.handleBoardChange.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.boardSearch(this.state.boardName, this.state.searchLimit)
  }

  handleBoardChange(e) {
    this.setState({ boardName: e.target.value })
  }

  handleLimitChange(e) {
    this.setState({ searchLimit: e.target.value })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type='text'
          name='boardSearch'
          placeholder='search for a reddit board'
          value={this.state.boardName}
          onChange={this.handleBoardChange} />

        <input
          type='number'
          name='searchLimit'
          placeholder='display 1 - 100 results'
          min='1'
          max='100'
          value={this.state.searchLimit}
          onChange={this.handleLimitChange} />
      </form>
    )
  }
}

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    let results = this.props.topics.map((item) => {
      return (
        <li key={item.data.id}>
        <a href={`http://www.reddit.com/${item.data.permalink}`} target="_blank">
          <h1>{item.data.title}</h1>
        </a>
        <p>Likes: {item.data.ups}</p>
        </li>
      )
    })
    return (
      <div className="results">
        <ul>{results}</ul>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: []
    }
    this.boardSearch = this.boardSearch.bind(this);
  }

  boardSearch(boardName, searchLimit){
    superagent.get(`${API_URL}/${boardName}.json?limit=${searchLimit}`)
    .then( res => {
      this.setState({
        topics: res.body.data.children
      })
    })
  }

  render() {
    return(
      <div className="reddit-form">
        <RedditForm boardSearch={this.boardSearch} />
        <SearchResults topics={this.state.topics} />
      </div>
    )
  }
}

ReactDom.render(<App />, document.getElementById('root'));
