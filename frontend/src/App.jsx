import { useState } from 'react'
import Login from './login';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';


function App() {

  return (
    <div className="App">
        <Login/>
    </div>
  )
}

export default App
