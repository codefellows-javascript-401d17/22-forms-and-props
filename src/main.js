import './style/main.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import superagent from 'superagent';

const API_URL = 'http://www.reddit.com/r';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: '',
      limit: '',
      topics: [],
      failed: false
    }
  }


  render() {
    return (
      <div>
        <SearchResultsList />
      </div>
    );
  }
}

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: '',
      limit: '',
      topics: [],
      failed: false
    }

    this.handleBoardChange = this.handleBoardChange.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleBoardChange(e) {
    this.setState({board: e.target.value})
  }

  handleLimitChange(e) {
    this.setState({limit: e.target.value})
  }

  handleSubmit(e) {
    console.log('hi');
    e.preventDefault();
    this.props.handleSearch(this.state.board, this.state.limit)
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} >
          <input
            type='text'
            name='boardName'
            placeholder='Reddit Board Name'
            value={this.state.board}
            onChange={this.handleBoardChange}
            />
          <input
            type='number'
            name='boardLimit'
            placeholder='number'
            value={this.state.limit}
            onChange={this.handleLimitChange}
            min='0'
            max="100"
            />
          <input
            type="submit"
            value="submit"
            />
        </form>
      </div>
    );
  }
}

class SearchResultsList extends React.Component{
  constructor(props) {
    super(props);

    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(searchFormBoard, searchFormLimit) {
    console.log(searchFormLimit);
    superagent.get(`${API_URL}/${searchFormBoard}.json?limit=${searchFormLimit}`)
    .then( res => {
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
        this.setState({
          topics,
          failed: false
        });
        console.log(topics);
      } catch (err) {
        console.error(err);
        this.setState({ failed: true })
        console.log('1', this.state);
      }
    })
    .catch(err => {
      console.error(err);
      this.setState({ failed: true })
      console.log('2', this.state);
    });
  }

  render() {
    return (
      <div>
        <h1>Reddit Search Engine</h1>
        <SearchForm handleSearch={this.handleSearch} />
      </div>
    );
  }
}



ReactDOM.render(<App />, document.getElementById('root'));
