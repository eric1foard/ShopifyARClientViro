import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SearchInput from './SearchInput'
import ProductGrid from './ProductGrid';
import {
  getProducts,
  showListLoading,
  handleClearText,
  updateSearchText
} from '../actions';


class SearchView extends Component {
  constructor(props) {
    super(props);
    this.getNextPageProducts = this.getNextPageProducts.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
  }

  renderSearchInput() {
    return (
      <SearchInput
        value={this.props.search.searchStr}
        handleChangeText={this.handleChangeText}
        handleClearText={this.props.handleClearText}
      />
    )
  }

  render() {
    return (
      <ProductGrid
        {...this.props.search}
        navigation={this.props.navigation}
        listHeader={this.renderSearchInput()}
        getNextPageProducts={this.getNextPageProducts}
        showListLoading={this.props.showListLoading}
      />
    );
  }

  handleChangeText(text) {
    this.props.updateSearchText(text || '');
    if (!text) return;
    const {
      shop: { name },
      search: { pageSize }
    } = this.props;
    this.props.getProducts({
      pageNum: 0,
      pageSize,
      searchStr: text,
      shopName: name
    });
  }
    
  getNextPageProducts() {
    const {
      shop: { name },
      search: { pageNum, pageSize, searchStr }
    } = this.props;
    this.props.getProducts({ pageNum, pageSize, searchStr, shopName: name });
  }
}

const mapStateToProps = ({ search, shop }) => ({ search, shop });

const mapDispatchToProps = dispatch => {
  const actions = {
    getProducts,
    showListLoading,
    handleClearText,
    updateSearchText
  };
  return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchView);