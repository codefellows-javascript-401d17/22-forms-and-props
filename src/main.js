import React from 'react';
import ReactDom from 'react-dom';
import superagent from 'superagent'

const API_URL=`https://www.reddit.com/r/dota2.json?limit=${50}`

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: '',
      limit: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQueryNameChange = this.handleQueryNameChange.bind(this);
  }

  handleQueryNameChange(e) {
    this.setState({post: e.target.value})
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.postSelect(this.state.post)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type='text'
          name='post'
          placeholder='search for posts'
          value={this.state.post}
          onChange={this.handleQueryNameChange}
          />
      </form>
    )
  }
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      topics: [],
      postSelected: null,
      postNameError: null
    }

    this.postSelect = this.postSelect.bind(this);
  }

  componentDidUpdate() {
    console.log('__STATE__', this.state);
  }

  componentDidMount() {

    if (localStorage.topic) {
      try {
        let post = JSON.parse(localStorage.post);
        this.setState({topic})
      } catch (err) {
        console.error(err);
      }
    } else{
      superagent.get(`${API_URL}`)
      .then( res => {
        console.log(res.body);
        let post = res.body.data.children.reduce((post, n) => {
          post[n.data.title];
          post[n.data.url];
          post[n.data.ups];
          return post;
        }, {});

        try {
          localStorage.post = JSON.stringify(post);
          this.setState({post});
        } catch (err) {
          console.error(err);
        }
      })
      .catch(console.error)
    }
  }

  postSelect(title) {
    if (!this.state.post[title]) {
      this.setState({
        postSelected: null,
        postNameError: title
      });
    } else {
      superagent.get(this.state.post[title])
      .then( res => {
        this.setState({
          postSelected: res.body,
          postNameError: null
        })
      })
      .catch(console.error);
    }
  }

  render() {
    return (
      <section>
        <h1>Dota 2 Form</h1>
        <SearchForm postSelect={this.postSelect} />

        { this.state.postNameError ?
          <div className="error">
            <h2>Selected: {this.state.postNameError} does not exist.</h2>
            <h3>Please make another request</h3>
          </div> :
          <div>
          { this.state.postSelected ?
            <div>
              <h2>Selected: {this.state.postSelected.name}</h2>
              <h3>Comments:</h3>
              <ul>
                {this.state.postSelected.comments.map((item, i) => {
                  return (
                    <li key={i}>
                      <a href="topic.url"><span>topic.ups</span>{item.comment.name}
                        <h2>topic.title</h2>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div> :
            <div>
              <p>please make a request to see dota 2 data</p>
            </div>
          }
          </div>
        }
      </section>
    )
  }
}

const container = document.createElement('main');
document.body.appendChild(container);
ReactDom.render(<App />, container);
