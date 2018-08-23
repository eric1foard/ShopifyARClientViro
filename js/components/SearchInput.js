import React, { Component } from 'react';
import { SearchBar } from 'react-native-elements'

class SearchInput extends Component {
  render() {
    return (
      <SearchBar
        // showLoadingIcon
        lightTheme
        value={this.props.value}
        onChangeText={this.props.handleChangeText}
        icon={{ type: 'ionicons', name: 'search' }}
        placeholder='Type Here...'
        clearButtonMode={'always'} // TODO: this will work for ios only, use next line for anroid
        // clearIcon={{ type: 'ionicons', name: 'close' }}
        />
    );
  }
}

export default SearchInput;