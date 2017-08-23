# 22: Forms and Props
======


The App component is the parent component and it has two children components, SearchForm and SearchResultList.

The App component has a state with a topics property that is initially an empty array. It can be populated when the function topics is called with the appropriate arguments. In the App components render we return the SearchForm which is passed the function topics as a prop, and the SearchResultList which is passed the topics as a prop.

The SearchForm component has a state with the properties board (empty string), limit (empty string) and failed(null). It renders a form of input type text that takes the board and a form of input type number that takes the number of limit. Changes in these values are handled by the functions handleBoardNameChange and handleLimitChange, which control the inputs. Upon form submit, handleSubmit is called, which performs the reddit search at  http://www.reddit.com/r/{board}.json?limit={limit} . On success this data is passed back to app to be set in the state by calling the topics prop. On error, the failed value is set to true and the error class is added to both inputs making their borders red.

SearchResultList populates the data from the search results. When the topics array is populated with data it renders the url in an anchor tag, along with an h2 heading of the title and a p tag with the number of ups.
