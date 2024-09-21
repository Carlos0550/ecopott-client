import React from 'react'
import "./App.css"
import {Routes, Route} from "react-router-dom"
import AdminPage from './pages/Administracion/pages/AdminPage'
import ViewProducts from './pages/Administracion/pages/ViewProducts'
function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<AdminPage/>}/> 
        <Route path='/view_products/*' element={<ViewProducts/>}/>  
      </Routes>
    </>
  )
}

export default App