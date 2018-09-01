import { SELECT_PRODUCT, ANCHOR_FOUND, DRAG } from '../actions/types';

const initState = {
  visible: false,
  position: [0,1.5,0],
  rotation: [0, 0, 0]
};

const initPosition = ([x,y,z]) => ([
  x,
  y: 1.5,
  z: -1
]);

const updateRotationOnDrag = (currPos, dragPos) => {
  const [currX, currY, currZ] = currPos;
  const [nextX, nextY, nextZ] = dragPos;
  return [currX, currY-1, currZ];
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case SELECT_PRODUCT:
      return { ...state, ...action.payload, visible: false }; // TODO: product info and positon/rotation info should each be namepaced under their own keys
    case ANCHOR_FOUND:
      return {
        ...state,
        visible: true,
        // position: initPosition(action.payload.vertices[0])
      };
    case DRAG:
      return {
        ...state,
        rotation: updateRotationOnDrag(state.rotation, action.payload)
      };
  }
  return state;
}