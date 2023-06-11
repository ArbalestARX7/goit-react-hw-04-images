import React, { Component } from 'react';
import { Report } from 'notiflix';
import PropTypes from 'prop-types';
import css from './Searchbar.module.css';

class Searchbar extends Component {
  state = {
    querry: '',
  };

  getQuerry = e => {
    this.setState({ querry: e.currentTarget.value.toLowerCase() });
  };

  handleSubmit = e => {
    e.preventDefault();

    const { onSearch } = this.props;
    const { querry } = this.state;

    if (querry.trim() === '') {
      Report.info(
        'You need to write a request',
        'At your request, cool pictures will be uploaded :)',
        'OK'
      );
    }

    onSearch(querry);
  };

  render() {
    return (
      <header className={css.Searchbar}>
        <form className={css.SearchForm}>
          <button
            type="submit"
            className={css.SearchFormButton}
            onClick={this.handleSubmit}
          >
            <span className={css.SearchFormButtonLabel}>Search</span>
          </button>

          <input
            className={css.SearchFormInput}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            onChange={this.getQuerry}
            value={this.state.querry}
          />
        </form>
      </header>
    );
  }
}

export default Searchbar;

Searchbar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};
