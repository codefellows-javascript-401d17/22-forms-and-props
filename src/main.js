import './style/main.scss'
import React from 'react';
import ReactDom from 'react-dom';
import superagent from 'superagent';

const API_URL='http://www.reddit.com/r';

class RedditForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      topics: [],
      success: true,
      searchRedditBoard: '',
      searchLimit:''
    };

    this.handleSubmit= this.handleSubmit.bind(this);
    this.handleRedditBoardChange = this.handleRedditBoardChange.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
  }

  handleRedditBoardChange(e) {
    this.setState({ searchRedditBoard: e.target.value});
  }
  handleLimitChange(e) {
    this.setState({ searchLimit: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.redditBoardSelect(this.state.redditBoard);

    superagent.get(
      `${API_URL}/${this.state.searchRedditBoard}.json?limit=${this.state.searchLimit}`
    )
    .then(res => {
      this.setState({ success: true});
      let posts = res.body.data.children;

      return this.props.renderPosts(posts)
    })
    .catch(err => {
      console.log(err);
      this.setState({ success: false});
    });
  }

  render() {
    return (
      <form>
        <input
          className={this.state.success ? 'reg' : 'alert'}
          type='text'
          name='board'
          placeholder='search for a board'
          value={this.state.searchRedditBoard}
          onChange={this.handleRedditBoardChange}
          />
          <input
            className={this.state.sucess ? 'reg' : 'alert'}
            type='number'
            name='limit'
            min='1'
            max='100'
            placeholder='how many results you want?'
            value={this.state.searchLimit}
            onChange={this.handleLimitChange}
          />
          <button onClick={this.handleSubmit}>search reddit</button>
      </form>
    );
  }
}

class SearchResults extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <ul id='topics'>
        {this.props.redditTopics.map((item, i) => {
          return(
            <li key={i}>
              <a href={item.data.url}>
                <img src={item.data.thumbnail} />
                <h3>
                  {item.data.title}
                </h3>
                <p>
                  ups: {item.data.ups}
                </p>
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      topics: [],
      redditBoardSelected: null,
      reddictBoardNameError:null
    };

    this.redditBoardSelect = this.redditBoardSelect.bind(this);
    this.renderPosts = this.renderPosts.bind(this);
  }

  renderPosts(posts){
    this.setState({ topics: posts });
  }

  redditBoardSelect(name) {
    if(!this.state.topics[name]){
      this.setState({
        redditBoardSelected: null,
        reddictBoardNameError: name
      });
    } else {
      superagent.get(this.state.topics[name])
      .then( res => {
        this.setState({
          redditBoardSelected: res.body,
          reddictBoardNameError: null
        });
      })
      .catch(console.error);
    }
  }

  render() {
    return (
      <div>
        <h1> find yo subred</h1>

        <RedditForm
          redditBoardSelect={this.redditBoardSelect}
          renderPosts={this.renderPosts}
        />
        <SearchResults redditTopics={this.state.topics} />
      </div>
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);
ReactDom.render(<App />, container);
