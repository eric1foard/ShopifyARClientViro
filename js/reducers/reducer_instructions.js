import { SELECT_PRODUCT, NEXT_INSTRUCTION, HIDE_CHECK, ANCHOR_FOUND } from '../actions/types';
import { STEPS_ENUM } from '../util/constants';

const NUM_STEPS = Object.keys(STEPS_ENUM).length;
const STEP_TEXT = [
  '',
  'Face the wall you\'d like to see the piece displayed on',
  'Point your camera at the floor and move it around slowly',
  'using one finger to drag and two to rotate, place the line ' +
  'where the floor meets the wall',
  'Drag the work to the desired spot on the wall. You can walk ' +
  'around the room to view the piece from different angles'
];

const initState = {
  step: STEPS_ENUM.FACE_WALL, // don't confuse user with 0-based index
  dismissed: false,
  buttonTitle: 'Next',
  stepText: STEP_TEXT[STEPS_ENUM.FACE_WALL],
  NUM_STEPS,
  showCheck: false
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case SELECT_PRODUCT:
      return initState;
    case NEXT_INSTRUCTION:
      const nextStep = action.payload;
      return {
        ...state,
        step: nextStep,
        buttonTitle: nextStep < NUM_STEPS ? 'Next' : 'Dismiss',
        stepText: STEP_TEXT[nextStep] || '',
        dismissed: state.step >= NUM_STEPS ? true : false
      };
    case ANCHOR_FOUND:
      return {
        ...state,
        showCheck: true
      };
    case HIDE_CHECK:
      return {
        ...state,
        showCheck: false
      };
  }
  return state;
}