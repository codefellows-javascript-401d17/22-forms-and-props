
import React from 'react'
import ReactDom from 'react-dom';


class SearchForm extends React.Component {
  constructor(props) {
    super(props)
    this.state({
      channel: '',
      limit: '',
    })
    super(props);

    this.clickHandler = this.clickHandler.bind(this);
    this.onLimitChange = this.onLimitChange.bind(this);
    this.onChannelChange = this.onChannelChange.bind(this);
  }

  clickHandler(e) {
    e.preventDefault();
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
      <form onClick={this.clickHandler}>
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
      <div></div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div></div>
    )
  }
}


ReactDom.render(<App />, document.getElementById('root'));
