import React, { createContext, useReducer } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import Logout from "./Logout";
import Register from "./Register";
import Nav from "./Nav";
import Task from "./Task";
import {initialState, reducer} from "./reducer"

export const UserContext=createContext();

const App = () => {
 const [state,dispatch]=useReducer(reducer,initialState);
  return (
    <>  
   
    <UserContext.Provider value={{state,dispatch}}>
    <Nav />  
    <Routes>
    <Route exact path="/" element={<Task />} />
    <Route path="/login" element={<Login />} /> 
    <Route path="/register" element={<Register />} />
    <Route path="/logout" element={<Logout />} />
    
  </Routes>
        
      </UserContext.Provider>
    </>
  );
};
export default App;

