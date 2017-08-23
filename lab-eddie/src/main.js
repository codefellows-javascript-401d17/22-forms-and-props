
import React from 'react'
import ReactDom from 'react-dom';
import superagent from 'superagent';


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
    console.log('XXXXXXX')
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
      <form onSubmit={this.clickHandler}>
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
    return(
      !this.props.result ?
      <li></li>:
      <li></li>
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
    if(limit >= 0) {
      return this.setState({queryError: true})
    }
    superagent.get(`https://www.reddit.com/r/${channel}.json?limit=${limit - 1}`)
    .then(res => {
      this.setState({
        queryError: null,
        currentQuery: res.body
      })


    }).catch(err => {
      this.setState({queryError: err});
    })
  }

  render() {
    return(
      <SearchForm redditQuery={this.redditQuery}/>
    )
  }
}


ReactDom.render(<App />, document.getElementById('root'));
