import React, { PureComponent } from 'react';
import { TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements'

class ProductCard extends PureComponent {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
  }

  render() {
    const { title, image } = this.props;
    return (
      <TouchableOpacity onPress={this.handlePress}>
        <Card
          title={title}
          image={{ uri: image }}
          flexDirection={'column-reverse'}
          titleNumberOfLines={1}
          wrapperStyle={{ padding: 0 }}
          containerStyle={{ borderRadius: 5, overflow: 'hidden' }}
        />
      </TouchableOpacity>
    );
  }

  handlePress() {
    this.props.navigation.navigate('ARView');
  }
}

export default ProductCard;