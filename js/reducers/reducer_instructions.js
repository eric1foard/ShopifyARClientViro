import {
  SELECT_PRODUCT,
  NEXT_INSTRUCTION,
  ANCHOR_FOUND,
  SET_IMAGE_HEIGHT
} from '../actions/types';
import { STEPS_ENUM } from '../util/constants';

const NUM_STEPS = Object.keys(STEPS_ENUM).length;
const STEP_TEXT = [
  '',
  'Face the wall you\'d like to see the piece displayed on',
  'Point your camera at the floor and move it around slowly',
  'using one finger to drag and two to rotate, place the line ' +
  'where the floor meets the wall',
  'Tilt to adjust height',
  'You can walk around the room to view the piece from different angles'
];

const initState = {
  step: STEPS_ENUM.FACE_WALL, // don't confuse user with 0-based index
  dismissed: false,
  buttonTitle: 'Next',
  stepText: STEP_TEXT[STEPS_ENUM.FACE_WALL],
  NUM_STEPS,
  buttonDisabled: false,
  showCheck: false,
  reviewState: false
};

const nextStateForStep = (nextStep, state) => {
  const buttonDisabled = nextStep === STEPS_ENUM.DETECT_FLOOR;
  return {
    ...state,
    step: nextStep,
    buttonTitle: buttonDisabled ? '' : nextStep < NUM_STEPS ? 'Next' : 'Dismiss',
    stepText: STEP_TEXT[nextStep] || '',
    dismissed: state.step >= NUM_STEPS ? true : false,
    showCheck: false,
    buttonDisabled,
    reviewState: nextStep === STEPS_ENUM.REVIEW
  };
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case SELECT_PRODUCT:
      return initState;
    case NEXT_INSTRUCTION:
      return nextStateForStep(action.payload, state);
    case SET_IMAGE_HEIGHT:
      return nextStateForStep(STEPS_ENUM.REVIEW, state);
    case ANCHOR_FOUND:
      return {
        ...state,
        buttonDisabled: false,
        showCheck: true
      }
  }
  return state;
}