import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { StartPage, Register, Login } from './containers';

const App = () => {
  return (
    <div className='LiveAcademy_APP'>
        <BrowserRouter>
            <Routes>
                <Route exact path = '/' element = {<StartPage/>} />
                <Route path = '/register' element = {<Register/>} />
                <Route path = '/login' element = {<Login/>} />
            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App;
