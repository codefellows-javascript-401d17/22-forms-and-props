import React from 'react';
import ReactDOM from 'react-dom';

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
      search: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('clicked!', e);
  }

  handleSearchChange(e) {
    this.setState({search: e.target.value});
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
  }

  render() {
    return (
      <div>
        <h1>Reddit Form</h1>
        <RedditSearchForm />
        {/* <SearchResults /> */}
      </div>
    )
  }
}

const container = document.createElement('div');
document.body.appendChild(container);
ReactDOM.render(<App />, container, function() {
  console.log('should render');
})