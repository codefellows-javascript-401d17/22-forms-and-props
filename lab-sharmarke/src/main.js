import './style/main.scss'
import React from 'react'
import ReactDom from 'react-dom'
import superagent from 'superagent'

const API_URL = `http://www.reddit.com/r`

class SearchForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      board: '',
      limit: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleBoardChange = this.handleBoardChange.bind(this)
    this.handleLimitChange = this.handleLimitChange.bind(this)
  }
  handleBoardChange(e) {
    this.setState({board: e.target.value})
  }
  handleLimitChange(e) {
    this.setState({limit: e.target.value})
  }
  handleSubmit(e) {
    e.preventDefault()
    this.props.searchReddit(this.state.board, this.state.limit)
  }
  render(){
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type='text'
          name='redditSearch'
          placeholder='search board'
          value={this.state.board}
          onChange={this.handleBoardChange}
          />
        <input
          type='number'
          name='limit'
          placeholder='0-100'
          min='0'
          max='100'
          value={this.state.limit}
          onChange={this.handleLimitChange}
          />
        </form>
    )
  }
}

class SearchResultList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }
  render(){
    let listItems = this.props.topics.map((item) => {
      return (
        <li key={item.data.id}>
        <a href={`http://www.reddit.com/${item.data.permalink}`}  target="_blank">
            <h1>{item.data.title}</h1>
            <p>{item.data.ups}</p>
          </a>
        </li>
      )
    })
    return (
      <div className="results">
        <h1> Results </h1>
        <ul>
            {listItems}
        </ul>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      topics: [],
    }
    this.searchReddit = this.searchReddit.bind(this);
  }

  searchReddit(name, limit){
    superagent.get(`${API_URL}/${name}.json?limit=${limit}`)
    .then(res => {
      this.setState({
        topics: res.body.data.children
      })
    })
  }

  render(){
    return (
      <div className="search-form">
        <h1> Search Reddit </h1>

        <SearchForm searchReddit={this.searchReddit} />

        <SearchResultList topics={this.state.topics}/>
      </div>
    )
  }
}

const container = document.createElement('div')
document.body.appendChild(container)
ReactDom.render(<App />, container)
