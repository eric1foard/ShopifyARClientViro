import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';
import { nextInstruction } from '../actions';

const {
  height: WINDOW_HEIGHT,
  width: WINDOW_WIDTH
} = Dimensions.get('window');
const CARD_HEIGHT = WINDOW_HEIGHT / 4;

class InstructionCard extends PureComponent {
  render() {
    const {
      step,
      buttonTitle,
      NUM_STEPS,
      stepText,
      dismissed
    } = this.props.instructions;

    if (dismissed) {
      return null;
    }
    return (
      <View style={localStyles.view}>
        <Card
          title={`Step ${step} of ${NUM_STEPS}`}
        >
          <Text>{stepText}</Text>
          <Button
            backgroundColor='#03A9F4'
            buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0 }}
            title={buttonTitle}
            onPress={() => this.props.nextInstruction(step < NUM_STEPS ? step + 1 : NUM_STEPS)}
            />
        </Card>
      </View>
    );
  }
}

var localStyles = StyleSheet.create({
  view: {
    position: 'absolute',
    top: WINDOW_HEIGHT - CARD_HEIGHT,
    left: 0,
    width: WINDOW_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: 'transparent',
    opacity: 0.8
  }
});

const mapStateToProps = ({ instructions }) => ({
  instructions
});

const mapDispatchToProps = dispatch => {
  const actions = { nextInstruction };
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(InstructionCard);