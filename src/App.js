import React from 'react'
import "./App.css"
import {Routes, Route} from "react-router-dom"
import AdminPage from './pages/Administracion/AdminPage'
function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<AdminPage/>}/>   
      </Routes>
    </>
  )
}

export default App