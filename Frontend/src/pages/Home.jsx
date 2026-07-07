import React from 'react'
import Navbar from '../components/Navbar'
import Landing from '../components/home/Landing'
import HeritageHighlights from '../components/home/HeritageHighlights'
import EpicTales from '../components/home/EpicTales'
import Footer from '../components/Footer'

const Home = () => {
  return (
   <>
    <Navbar/>
    <Landing />
    <HeritageHighlights/>
    <EpicTales/>
    <Footer/>
   </>
  )
}

export default Home