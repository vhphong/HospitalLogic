import React from 'react';

import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './components/homepage';
import Mainpage from './components/mainpage';
import CreatePatient from './components/create-patient';
import CreateExpense from './components/create-expense';
import DisplayPatient from './components/display-patient';
import DisplayExpense from './components/display-expense';


function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Mainpage />} ></Route>
          <Route path='/home' element={<Homepage />} />
          <Route path='/create-patient' element={<CreatePatient />} />
          <Route path='/create-expense' element={<CreateExpense />} />
          <Route path='/display-patient' element={<DisplayPatient/>}/>
          <Route path='/display-expense' element={<DisplayExpense/>}/>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
