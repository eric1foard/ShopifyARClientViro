import {
  NEXT_INSTRUCTION,
  ANCHOR_FOUND,
  SET_PLANE_POINT
} from '../actions/types';
import { STEPS_ENUM } from '../util/constants';

const initState = {
  showARScene: false,
  showPointClound: false,
  anchorPt: [0, 0, 0],
  showImage: false,
  planePoint: [0, 0, 0],
  planePointFound: false,
  planeRotation: [0, 0, 0]
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case NEXT_INSTRUCTION:
      return {
        ...state,
        showPointClound: action.payload === STEPS_ENUM.DETECT_FLOOR,
        showARScene: action.payload === STEPS_ENUM.DETECT_FLOOR,
        showImage: action.payload >= STEPS_ENUM.DRAG_PIECE,
        planePointFound: false
      };
    case ANCHOR_FOUND:
      return {
        ...state,
        showPointClound: false,
        anchorPt: action.payload.anchorPt,
        showCheck: true
      };
    case SET_PLANE_POINT:
      const { planePoint, planeRotation } = action.payload;
      return {
        ...state,
        planePoint,
        planeRotation,
        planePointFound: true
      };
  }
  return state;
}