
import React from 'react'
import ReactDom from 'react-dom';
import superagent from 'superagent';
require('./style/main.scss');


class SearchForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      channel: '',
      limit: '',
    };
    super(props);

    this.clickHandler = this.clickHandler.bind(this);
    this.onLimitChange = this.onLimitChange.bind(this);
    this.onChannelChange = this.onChannelChange.bind(this);
  }

  clickHandler(e) {
    e.preventDefault();
    console.log(this.props.error)
    return this.props.redditQuery(this.state.channel, this.state.limit);
  }

  onChannelChange(e) {
    return this.setState({channel: e.target.value});
  }

  onLimitChange(e) {
    return this.setState({limit: e.target.value});
  }

  render() {
    return(
      <form onSubmit={this.clickHandler} className={this.props.error ? 'error' : ''}>
        <input
          type='text'
          name='channel'
          placeholder='Enter a Reddit Channel to Search'
          value={this.state.channel}
          onChange={this.onChannelChange}
        />
        <input
          type='text'
          name='limit'
          placeholder='Enter Number of Seach Items Between 1 and 100'
          value={this.state.limit}
          onChange={this.onLimitChange}
        />
        <button type='submit'>'Click ME'</button>
      </form>

    )
  }
}

class SearchResult extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props)
    return(
      <ul>
        {!this.props.error ?
        (this.props.result ?
        this.props.result.map((listing, ind) => {
          return (
          <li key={ind}>
            <a href={listing.data.url}>
              <h2>{listing.data.title}</h2>
              <span>{`Number of upvotes: ${listing.data.ups}`}</span>
            </a>
          </li>
          )
        }):
        <li></li>):
        <li>'Bad Request'</li>}
      </ul>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryError: null,
      currentQuery: ''
    }
    this.redditQuery = this.redditQuery.bind(this);
  }

  redditQuery(channel, limit) {
    if((limit <= 0 || limit > 100) || !channel) {
      return this.setState({
        queryError: true,
        currentQuery: null
      })
    }
    superagent.get(`https://www.reddit.com/r/${channel}.json?limit=${limit - 1}`)
    .then(res => {
      this.setState({
        queryError: null,
        currentQuery: res.body.data.children
      })


    }).catch(err => {
      this.setState({queryError: err});
    })
  }

  render() {
    return(
      <div>
        <SearchForm redditQuery={this.redditQuery} error={this.state.queryError}/>
        <SearchResult result={this.state.currentQuery} error={this.state.queryError} />
      </div>
    )
  }
}


ReactDom.render(<App />, document.getElementById('root'));
