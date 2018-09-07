import { NEXT_INSTRUCTION, ANCHOR_FOUND } from '../actions/types';
import { STEPS_ENUM } from '../util/constants';

const initState = {
  showARScene: false,
  showPointClound: false
};

export default function reducer(state = initState, action) {
  switch (action.type) {
      case NEXT_INSTRUCTION:
          return {
            ...state,
            showPointClound: action.payload === STEPS_ENUM.DETECT_FLOOR,
            showARScene: action.payload === STEPS_ENUM.DETECT_FLOOR,
          };
      case ANCHOR_FOUND:
          return {
            ...state,
            showPointClound: false // hide point cloud when anchor found
          }
  }
  return state;
}