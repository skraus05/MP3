import React, { useEffect } from 'react'
import {connect} from 'react-redux'
import initialize from '../data/game'
import { fetchHighScore } from '../store/auth'

/**
 * COMPONENT
 */
export const Home = ({username}) => {
  useEffect(initialize, [])

  // we need to find a way to resolve this promise from fetchHighScore()
;  const test = fetchHighScore();
  console.log('HIGH SCORE HEREE', test);

  return (
    <div>
      <h3>Welcome, {username}</h3>
      <p>    
    <span>Current Score:</span> <span id="score">0</span>
    <span>High Score:</span> <span id="score">0</span>
    </p>
    <canvas width="1920" height="950">
    </canvas>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    username: state.auth.username
  }
}

export default connect(mapState)(Home)
