import React from 'react';
import ReactDOM from 'react-dom';

class RedditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subreddit: ''
    }
  }

  render() {
    return (
      <form>
        <input 
          type='text' 
          name='subreddit'
          placeholder='enter a subreddit' 
          value={this.state.subreddit}
          />

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
        <RedditForm />
      </div>
    )
  }
}

const container = document.createElement('div');
document.body.appendChild(container);
ReactDOM.render(<App />, container, function() {
  console.log('should render');
})