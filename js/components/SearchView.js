import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SearchInput from './SearchInput'
import ProductGrid from './ProductGrid';
import {
  getProducts,
  showListLoading,
  handleClearText,
  updateSearchText,
  handleProductSelect
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
    const { search, navigation, showListLoading, handleProductSelect } = this.props;
    return (
      <ProductGrid
        {...search}
        navigation={navigation}
        listHeader={this.renderSearchInput()}
        getNextPageProducts={this.getNextPageProducts}
        showListLoading={showListLoading}
        handleProductSelect={handleProductSelect}
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
    updateSearchText,
    handleProductSelect
  };
  return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchView);