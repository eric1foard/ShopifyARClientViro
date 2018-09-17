import {
  NEXT_INSTRUCTION,
  ANCHOR_FOUND,
  SET_PLANE_POINT,
  SET_IMAGE_HEIGHT
} from '../actions/types';
import { STEPS_ENUM } from '../util/constants';

const initState = {
  showARScene: false,
  showPointClound: false,
  anchorPt: [0, 0, 0],
  showImage: false,
  planePoint: [0, 0, 0],
  enableHeightAdjustment: false,
  planeRotation: [0, 0, 0]
};

const nextInstruction = (nextStep, state) => {
  return {
    ...state,
    showPointClound: nextStep === STEPS_ENUM.DETECT_FLOOR,
    showARScene: nextStep === STEPS_ENUM.DETECT_FLOOR,
    showImage: nextStep >= STEPS_ENUM.ADJUST_HEIGHT,
    enableHeightAdjustment: false
  };
}

export default function reducer(state = initState, action) {
  switch (action.type) {
    case NEXT_INSTRUCTION:
      return nextInstruction(action.payload, state);
    case SET_IMAGE_HEIGHT:
      return nextInstruction(STEPS_ENUM.REVIEW, state);
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
        enableHeightAdjustment: true
      };
    case SET_IMAGE_HEIGHT:
      
  }
  return state;
}