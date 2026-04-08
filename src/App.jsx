import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Nopage from './pages/Nopage'


const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='*' element={<Nopage/>} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App