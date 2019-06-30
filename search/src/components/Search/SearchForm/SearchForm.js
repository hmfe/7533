import React, { Component } from 'react';

class SearchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownVisible: true
    }

    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick(e) {
    if (this.node.contains(e.target)) {
      this.setState({ dropdownVisible: true })
      return;
    }

    this.setState({ dropdownVisible: false })
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick)
  }

  render() {
    return (
      <form ref={node => this.node = node}
        action="#" method="get"
        onSubmit={this.props.onSubmit}
        onKeyDown={this.props.onKeyDown}
      >
        <input type="search"
          autoComplete="off"
          className="search__input"
          onChange={this.props.onChange}
          value={this.props.input}
        />
        {this.props.error !== "" ? <p className="search__error">{this.props.error}</p> : null}
        {this.state.dropdownVisible ?
          <Dropdown 
            suggestions={this.props.suggestions}
            selected={this.props.selected}
            onSubmit={this.props.onSubmit}
          /> : null}
      </form> 
    );
  }
}

class Dropdown extends Component {
  componentDidUpdate() {
    const { selected, suggestions } = this.props;

    if (selected >= 0 && suggestions.length > 0) {
      this.node.children[selected].scrollIntoView();
    }
  }
  
  render() {
    const { suggestions, selected, onSubmit } = this.props

    if (suggestions.length === 0) return null;

    return (
      <ul className="dropdown" ref={node => this.node = node}>
        {suggestions.map((suggestion, i) =>
          <li key={'suggestion_'+suggestion}
            className={`dropdown__item${selected === i ? "--selected" : ""}`}
            onClick={() => onSubmit({ suggestion })}
          >
            {suggestion}
          </li>
        )}
      </ul>
    )  
  }
}

export default SearchForm;