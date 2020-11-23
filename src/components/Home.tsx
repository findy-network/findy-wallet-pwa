import React from 'react'
import { Heading } from 'grommet'
import Events from './Events'
import Jobs from './Jobs'

function Home() {
  return (
    <>
      <Heading level={2}>Home</Heading>
      <Jobs />
      <Events />
    </>
  )
}

export default Home
