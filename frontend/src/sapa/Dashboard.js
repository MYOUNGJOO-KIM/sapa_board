import React, {useEffect, useRef, useState} from 'react';  
import './../assets/css/app.css';
import './../assets/css/common.css';
import FontAwesomeIcon from './../assets/images/wrench-solid.svg';
import axios from 'axios';
import { CategoryContext, useCategoryContext } from '../CategoryContexts';

axios.defaults.withCredentials = true;

function Container( props ){ 
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId') || "anonymous";

  const { cleanParam } = useCategoryContext();


  return ( 
    <div className='root_box common dashboard'>
      <div className='txt_box'>
        <img src={FontAwesomeIcon}/>
        <h1>Now under destruction.</h1>
        <h3>해당 메뉴는 사이트 리뉴얼을 진행중입니다.</h3>
      </div>
    </div>
  );
}

export default Container;

