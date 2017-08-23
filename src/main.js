import './style/main.scss';
import React from 'react';
import ReactDom from 'react-dom';
import superagent from 'superagent';

const API_URL = 'http://www.reddit.com/r';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: [],
    };
    this.topics = this.topics.bind(this);
  }

  componentDidUpdate() {
    console.log('__STATE__', this.state);
  }

  topics(redditResults) {
    this.setState({
      topics: redditResults,
    });
  }
  render() {
    return (
      <div>
        <h1>Reddit Search Engine</h1>
        <SearchForm topics = {this.topics} />
        <SearchResultList topics = {this.state.topics} />
      </div>
    );
  }
}

class SearchForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      board: '',
      limit: '',
      failed: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBoardNameChange = this.handleBoardNameChange.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
  }
  handleBoardNameChange(event) {
    this.setState({board: event.target.value});
  }

  handleLimitChange(event) {
    this.setState({limit: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    superagent.get(`${API_URL}/${this.state.board}.json?limit=${this.state.limit}`)
    .then((res) => {
      let topics = res.body.data.children.reduce((processedPosts, post) => {
        let newPost = {
          title: post.data.title,
          url: post.data.url,
          ups: post.data.ups
        }

        processedPosts.push(newPost);

        return processedPosts
      }, []);
      try {
        this.props.topics(topics);
      } catch (err) {
        console.error(err);
        this.setState({ failed: true })
      }
    })
    .catch((err) => {
      this.setState({
        failed: true,
      });
    });
  }


  render() {
    return (
      <form onSubmit={this.handleSubmit}  >
        <input
          className={ this.state.failed ? 'error' : ''}
          type='text'
          name='board'
          placeholder='Board Name'
          value={this.state.board}
          onChange={this.handleBoardNameChange}
          />
        <input
          className={ this.state.failed ? 'error' : ''}
          type='number'
          min='0'
          max='100'
          name='limit'
          placeholder='Limit [0-100]'
          value={this.state.limit}
          onChange={this.handleLimitChange}
          min='0'
          max='100'
          />
        <input type="submit" />
      </form>
    );
  }
}

class SearchResultList extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div>
        <ul>
          {this.props.topics.map((item, i) => {
            return (
              <li key = {i}>
                <a href = {item.url}>
                  <h2>{item.title}</h2>
                </a>
                <span>
                  <p>{item.ups}</p>
                </span>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
}
}


ReactDom.render(<App />, document.getElementById('root'));
