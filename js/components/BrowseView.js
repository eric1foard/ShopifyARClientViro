import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ProductGrid from './ProductGrid';
import { getProducts, showListLoading } from '../actions';

class BrowseView extends Component {
  constructor(props) {
    super(props);
    this.getNextPageProducts = this.getNextPageProducts.bind(this);
  }

  componentWillMount() {
    this.getNextPageProducts();
  }

  render() {
    const { browse, navigation, showListLoading } = this.props;
    return (
      <ProductGrid
        {...browse}
        navigation={navigation}
        listHeader={null}
        getNextPageProducts={this.getNextPageProducts}
        showListLoading={showListLoading}
      />
    );
  }
    
  getNextPageProducts() {
    const {
      shop: { name },
      browse: { pageNum, pageSize }
    } = this.props;
    this.props.getProducts({ pageNum, pageSize, shopName: name });
  }
}

const mapStateToProps = ({ browse, shop }) =>
  ({
    browse,
    shop
  });

const mapDispatchToProps = dispatch => {
  const actions = { getProducts, showListLoading };
  return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(BrowseView);