import React from 'react'
import Navbar from '../components/Navbar'
import Landing from '../components/home/Landing'
import HeritageHighlights from '../components/home/HeritageHighlights'
import EpicTales from '../components/home/EpicTales'


const Home = () => {
  return (
   <>
    <Navbar/>
    <Landing />
    <HeritageHighlights/>
    <EpicTales/>
   </>
  )
}

export default Home