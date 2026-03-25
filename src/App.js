import { Route, Routes } from 'react-router-dom';
import './css/App.css';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import { useContext } from 'react';
import { DContext } from './context/Datacontext';
import LoadingPage from './components/pages/Loading';

import Header from './components/blocks/Header';


import { MotorTest } from './components/pages/MotorTest';

function App() {

  const {isAuth, currentUser} = useContext(DContext)

  if(isAuth===null || !currentUser){
    return <LoadingPage/>
  }

  return (
    <div className="container-fluid p-0">
      <Header/>
      <Routes>
        <Route path="/" element={isAuth?<MotorTest/>:<Login/>} />
        <Route path="/dashboard" element={<MotorTest/>} />
        <Route path="/login" element={isAuth?<MotorTest/>:<Login/>} />
        <Route path='/register' element={isAuth?<MotorTest/>:<Register/>} />
   
        <Route path='/test' element={<LoadingPage/>} />
      </Routes>
      {/* <Footer/> */}
    </div>
  );
}

export default App;
