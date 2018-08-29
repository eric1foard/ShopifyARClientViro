import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import GridView from 'react-native-super-grid';
import ProductCard from './ProductCard';

const styles = StyleSheet.create({
  gridView: {
    paddingTop: 25,
    flex: 1,
  }
});

class ProdutGrid extends Component {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem = (product) => {
    const { navigation, handleProductSelect } = this.props;
    return (
      <ProductCard
        navigation={navigation}
        handleProductSelect={handleProductSelect}
        product={product}
      />
    );
  };

  renderFooter() {
    if (!this.props.loading) return null;
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  render() {
    const { listHeader, products, getNextPageProducts, pageSize } = this.props;
    return (
      <GridView
        ListHeaderComponent={listHeader}
        items={products}
        renderItem={this.renderItem}
        showsVerticalScrollIndicator={false}
        itemDimension={130}
        style={styles.gridView}
        onEndReached={getNextPageProducts}
        onEndThreshold={0.5}
        initialNumToRender={pageSize}
        ListFooterComponent={this.renderFooter()}
      // ListEmptyComponent TODO: what to show if list is empty?

      // extraData TODO: what to do with this, if anything?
      />
    );
  }
}

export default ProdutGrid;