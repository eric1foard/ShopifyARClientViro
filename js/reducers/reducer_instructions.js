import { SELECT_PRODUCT, NEXT_INSTRUCTION } from '../actions/types';

const NUM_STEPS = 4;
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
  step: 1, // don't confuse user with 0-based index
  dismissed: false,
  buttonTitle: 'Next',
  stepText: STEP_TEXT[1],
  NUM_STEPS
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case SELECT_PRODUCT:
      return initState;
    case NEXT_INSTRUCTION:
      const nextStep = state.step < NUM_STEPS ? state.step + 1 : NUM_STEPS;
      return {
        ...state,
        step: nextStep,
        buttonTitle: nextStep < NUM_STEPS ? 'Next' : 'Dismiss',
        stepText: STEP_TEXT[nextStep] || '',
        dismissed: state.step >= NUM_STEPS ? true : false
      };
  }
  return state;
}