
import './reset.css';

import React, {useState} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CategoryProvider } from './CategoryContexts';


import Container from './sapa/Container';
import MgtContainer from './sapa/MgtContainer';
import FormContainer from './sapa/FormContainer';
import DtAttachContainer from './sapa/DtAttachContainer';
import PreviewPopUp from './sapa/PreviewPopUp';

import styled from 'styled-components';//공용 스타일 컴포넌트

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function App() {

  const [loadYn, setLoadYn] = useState(false);

  const propsForContainer = {
    loadYn : loadYn,
    setLoadYn : setLoadYn
  };

  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId') || "anonymous";
  setCookie("userId", userId, 7);

  return (
    <CategoryProvider>
      <div className={`loader_box ${loadYn ? '' : 'hide'}`}>
        <div className='loader loader-black loader-5'></div>
      </div>
      <AppBox className="app_box" width={`${window.innerWidth}px`} height={`${window.innerHeight}px`} fontSize="14px">{/* width="1670px" height="900px" */}
        <BrowserRouter>
          <Routes>
            <Route path="/category" element={<Container {...propsForContainer}/>} ></Route>
            <Route path="/mgt" element={<MgtContainer {...propsForContainer}/>} ></Route>
            <Route path="/form" element={<FormContainer {...propsForContainer}/>} ></Route>
            <Route path="/dt/sapa/attach" element={<DtAttachContainer {...propsForContainer}/>} ></Route>
            <Route path="/dt/sapa/attach/preview" element={<PreviewPopUp {...propsForContainer}/>} ></Route>
            <Route path="/dashboard" element={<Dashboard {...propsForContainer}/>} ></Route>
            </Routes> 
        </BrowserRouter>
      </AppBox>
    </CategoryProvider>
  );
}

export default App;

const AppBox = styled.div`
  width: ${props => props.width || '1920px'};
  height: ${props => props.height || '945px'};
  font-size: ${props => props.fontSize || '14px'};
`;
