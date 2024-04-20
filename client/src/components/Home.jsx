import React, { useEffect } from 'react'
import {connect} from 'react-redux'
import initialize from '../data/game'

/**
 * COMPONENT
 */
export const Home = ({username}) => {
  useEffect(initialize, [])

  return (
    <div>
      <h3>Welcome, {username}</h3>
      <p>    
    <span>Score:</span> <span id="score">0</span></p>
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
