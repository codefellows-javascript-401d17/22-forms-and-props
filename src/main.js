import React from 'react';
import ReactDOM from 'react-dom';
import superagent from 'superagent';

const API_URL = 'http://reddit.com/r';

class RedditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redditSearch: '',
      redditLimit: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRedditSearchChange = this.handleRedditSearchChange.bind(this);
    this.handleRedditLimitChange = this.handleRedditLimitChange.bind(this);

  }

  handleRedditSearchChange(e) {
    this.setState({redditSearch: e.target.value})
  }

  handleRedditLimitChange(e) {
    this.setState({redditLimit: e.target.value})
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.state.redditSearch, this.state.redditLimit);
    // this.props.redditSelect(this.state.redditSearch, this.state.redditLimit);
  }

  render() {
    return (
      <section>

        <form onSubmit={this.handleSubmit}>
          <input
            type='text'
            name='redditSearch'
            placeholder='Search for a Reddit Board'
            value={this.state.redditSearch}
            onChange={this.handleRedditSearchChange} />
          <input
            type='number'
            name='redditLimit'
            placeholder='Enter a number betweek 1 and 100'
            value={this.state.redditLimit}
            onChange={this.handleRedditLimitChange} />
        </form>
      </section>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redditLookup: {},
      redditSearchQuery: null,
      redditSearchQueryError: null,
      redditSearchLimit: null,
      redditSearchLimitError: null
    }

    // TODO
  }

  componentDidUpdate() {
    console.log('__STATE__', this.state);
  }

  redditSelect(name,limit) {
    if(localStorage.redditLookup) {
      try {
        let pokemonLookup = JSON.parse(localStorage.redditLookup);
        this.setState({redditLookup})
      } catch (err){
        console.error(err);
      }
    } else {
      superagent.get
    }
  }
}

ReactDOM.render(<RedditForm />, document.getElementById('root'))
