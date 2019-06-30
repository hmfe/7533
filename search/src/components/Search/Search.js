import React, { Component } from 'react';
import SearchForm from './SearchForm';

import debounce from 'lodash/debounce';

import './search.css';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestions: [],
      history: [],
      input: "",
      prevInput: "",
      error: "",
      selected: -1,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearHistory = this.clearHistory.bind(this);
    this.removeHistoryItem = this.removeHistoryItem.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSelect = this.handleSelect.bind(this);

    // debounce to ensure that search api is not called on every input change.
    this.fetchSuggestions = debounce(this.fetchSuggestions.bind(this), 300);
  }

  handleKeyDown(event) {
    const key = event.keyCode;
    
    if (!(key === 40 || key === 38)) return;

    let modifier = 0;
    if (key === 40) modifier = 1;  // down
    if (key === 38) modifier = -1; // up
    
    const { suggestions } = this.state
    
    let selected = this.state.selected + modifier;

    // Let selected == -1 denote that we go back to the prevInput field
    if (selected < -1) selected = -1;
    if (selected >= suggestions.length) selected = suggestions.length - 1;

    this.handleSelect(selected)
  }

  handleSubmit(event) {
    const input = event.suggestion || this.state.input;

    if (input === '') return;

    // history is not a hashmap because entries are not necessarily unique
    this.setState({
      history: [
        { name: input, added: new Date() },
        ...this.state.history,
      ],
      suggestions: [],
      input: "",
      prevInput: "",
      selected: -1,
    });
  }

  handleSelect(selected) {
    const { prevInput, suggestions } = this.state;

    this.setState({
      selected: selected,
      input: selected === -1 ? prevInput : suggestions[selected]
    })
  }

  fetchSuggestions(value) {
    if (value === "") {
      this.setState({ suggestions: [] })
      return;
    };

    // some really hacky input sanitization, works great since textContent disallows any non-textNode tags.
    // I would probably use a real package like 'purify' to deal with input sanitization.
    var temp = document.createElement('div');
	  temp.textContent = value;
	  value = temp.innerHTML;

    return this.props.fetchSuggestions(value)
      .then((suggestions) => {
        this.setState({
          suggestions: [...new Set(suggestions)], // ensure distinct elements
          error: ""
        });
      })
      .catch((error) => {
        this.setState({
          suggestions: [],
          error: error
        })
      })
  }

  handleChange(event) {
    const { value } = event.target;

    this.setState({
      input: value,
      prevInput: value,
    })

    this.fetchSuggestions(value);
  }

  removeHistoryItem(index) {
    this.setState({
      history: this.state.history
        .filter((_, i) => i !== index)
    })
  }

  clearHistory() {
    this.setState({ history: [] })
  }

  render() {
    return (
      <section role="search" className="search">
        <SearchForm
          {...this.state}
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onSelect={this.handleSelect}
        />
        <SearchHistory
          onClear={this.clearHistory}
          onRemove={this.removeHistoryItem}
          history={this.state.history}
        />
      </section>
    );
  }
}

const SearchHistory = ({ history, onClear, onRemove }) => 
  <div className="searchhistory">
    <span className="searchhistory__clear" onClick={onClear}>Clear search history</span>
    <h1 className="searchhistory__header">Search history</h1>
    <ul className="searchhistory__list">
      {history.map(({ name, added }, i) =>
        <li className="searchhistory__item"
          key={name + added.toLocaleString() + added.getUTCMilliseconds()}
        >
          <p className="searchhistory__added">{added.toLocaleString()}</p>
          <h1 className="searchhistory__name">{name}</h1>
          <span className="searchhistory__remove" onClick={() => onRemove(i)} />
        </li>
      )}
    </ul>
  </div>

export default Search;