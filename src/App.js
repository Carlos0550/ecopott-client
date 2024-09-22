import React from 'react'
import "./App.css"
import {Routes, Route} from "react-router-dom"
import AdminPage from './pages/Administracion/pages/AdminPage'
import ViewProducts from './pages/Administracion/pages/ViewProducts'
import PromotionsManager from './pages/Administracion/pages/PromotionsManager'
function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<AdminPage/>}/> 
        <Route path='/view_products/*' element={<ViewProducts/>}/>  
        <Route path='/promotions' element={<PromotionsManager/>}/>
      </Routes>
    </>
  )
}

export default App