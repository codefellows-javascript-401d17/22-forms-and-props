import React from 'react';
import ReactDOM from 'react-dom';
import superagent from 'superagent';

const API_URL = 'https://www.reddit.com/r'

class RedditSearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


}

class RedditSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subreddit: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('clicked!', e);
    this.props.fetchSubreddit(this.state.subreddit, 10);
  }

  handleSearchChange(e) {
    this.setState({ subreddit: e.target.value });
    console.log(this.state.subreddit);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type='text'
          name='search-field'
          placeholder='enter a subreddit'
          value={this.state.subreddit}
          onChange={this.handleSearchChange}
        />
        <button type="submit">Submit</button>
      </form>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
    this.fetchSubreddit = this.fetchSubreddit.bind(this);
  }


  fetchSubreddit(subreddit, limit) {
    superagent.get(`${API_URL}/${subreddit}.json?limit=${limit}`)
    .then((rsp) => {
      console.log(rsp);
    })
    .catch((err) => { console.error(err) })
  }

  componentDidUpdate() {
    console.log('::::::::::::::::::STATE::::::::::::::::::::::::', this.state)
  }

  render() {
    return (
      <div>
        <h1>Reddit Form</h1>
        <RedditSearchForm fetchSubreddit={this.fetchSubreddit}/>
        {/* <SearchResults /> */}
      </div>
    )
  }
}

const container = document.createElement('div');
document.body.appendChild(container);
ReactDOM.render(<App />, container, function () {
  console.log('should render');
})