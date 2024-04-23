import axios from 'axios';

const UPDATE_SCORE = 'SHOW_FACILITIES';

const updateScores = (score) => {
  return {
    type: UPDATE_SCORE,
    scores: score,
  };
};

/// THUNKS
export const updateHighScore = (score) => async (dispatch) => {
  try {
    console.log('trucks', score)
    const res = await axios.post('/auth/highscore', {
      score,
    });
  } catch (error) {
    return error;
  }
};

// async function updateHighScore(score) {
//     return await axios.post('/auth/highscore', {
//         score,
//       });
// }

// REDUCER
export default function updateScoresReducer(state = [], action) {
  switch (action.type) {
    case UPDATE_SCORE:
      return state;
    default:
      return state;
  }
}