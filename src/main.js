import React from 'react';
import ReactDom from 'react-dom';
import superagent from 'superagent';

const API_URL='https://www.reddit.com/r';

class SearchForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchBoard: '',
      searchLimit: '',
      success: true
    }

    this.handleBoardChange = this.handleBoardChange.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleBoardChange(e) {
    this.setState({ searchBoard: e.target.value });
  }

  handleLimitChange(e) {
    this.setState({ searchLimit: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.boardSelect(this.state.searchBoard)

    superagent.get(`${API_URL}/${this.state.searchBoard}.json?limit=${this.state.searchLimit}`)
    .then( res => {
      let posts = res.body.data.children;

      this.setState({ success: true })
      return this.props.renderPosts(posts);
    })
    .catch(err => {
      this.setState({ success: false })
      console.error(err)
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
          className={this.state.success ? 'valid' : 'invalid'}
          type='text'
          name='board'
          placeholder='search for a board'
          value={this.state.searchBoard}
          onChange={this.handleBoardChange}
          required
          />
          <input
          className={this.state.success ? 'valid' : 'invalid'}
          type='number'
          name='limit'
          min='0'
          max='100'
          value={this.state.searchLimit}
          onChange={this.handleLimitChange}
          required
          />
          <input type='submit'/>
        </form>
      </div>
    )
  }
}

class SearchResultList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ul id='posts'>
          {this.props.posts.map((item, i) => {
            return (
              <li key={i}>
                <a href={item.data.url}>
                  <h2>{item.data.title}</h2>
                </a>
                <p>Ups: {item.data.ups}</p>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      boardSelected: null,
      boardNameError: null
    }

    this.renderPosts = this.renderPosts.bind(this);
    this.boardSelect = this.boardSelect.bind(this);
  }

  renderPosts(posts) {
    this.setState({ posts: posts });
  }

  boardSelect(name) {
    if(!this.state.posts) {
      this.setState({
        boardSelected: null,
        boardNameError: name
      });
    } else {
      this.setState({
        boardSelected: this.state.posts,
        boardNameError: null
      });
    }
  }

  componentDidUpdate() {
    console.log('__STATE__', this.state);
  }

  render() {
    return (
      <section>
        <h1>Reddit Search</h1>
        <SearchForm
          boardSelect={this.boardSelect}
          renderPosts={this.renderPosts}
        />

        { this.state.boardNameError ?
          <div>
            <h3>Selected: {this.state.boardNameError}</h3>
            <p>select a valid board</p>
          </div>  :
          <div>
          { this.state.boardSelected ?
            <div>
              <h3>Selected: {this.state.boardSelected}</h3>
              <SearchResultList
                posts={this.state.posts}
              />
            </div>  :
            <div>
              <p>select a board</p>
            </div>
          }
          </div>
        }
      </section>
    )
  }
}

ReactDom.render(<App />, document.getElementById('root'));
