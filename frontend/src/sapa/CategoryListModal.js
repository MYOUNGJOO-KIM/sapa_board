import React, {useEffect, useRef, useState} from 'react';
import BoardList from '../board/BoardList';
import SearchBox from "./../board/SearchBox";
import icon_x_white from './../assets/images/icon_x_white.svg';
import axios from 'axios';
import ReactJsPagination from "react-js-pagination";
import { CategoryContext, useCategoryContext } from '../CategoryContexts';
import ReactJsPg from './ReactJsPg';


function CategoryListModal (properties) {

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const [isRequestHeaderUpdated, setIsRequestHeaderUpdated] = useState(false);
  
  const { cleanParam } = useCategoryContext();
  const [ChildCategoryList, setChildCategoryList] = useState([]);
  
  const [selectSearchKey, setSelectSearchKey] = useState('');//select
  const [inputSearchStr, setInputSearchStr] = useState('');//text
  
  const [totalListSize, setReactJsPgListSize] = useState(0);
  
  const [reactJsPgShow, setReactJsPgShow] = useState(false);
  const [requestHeader, setRequestHeader] = useState({
    activePage: 1
    , listSize: 0
    , size: 10
    , searchKey : ''
    , searchStr : ''
  });

  const selectOptions = [
    {key : 'catCd', value : '카테고리 코드'}
    , {key : 'catNm', value : '카테고리 이름'}
  ];

  //const thead=[{key : 'catCd', value : '카테고리 코드'},{key : 'catNm', value : '카테고리 이름'}] ;
  
  const getChildCategoryList = async (requestHeaderParam, requestBody) => {

    let rqHeader = cleanParam(requestHeaderParam);
    let response;

    try {
      if (!properties.loadYn){properties.setLoadYn(true);}
      reactJsPgClear();
      response = await axios.post(`${apiBaseUrl}/category/getChildCategoryList`, requestBody, {
          params : rqHeader
      });

      let totalCnt = 0;

      if(response.data != null && response.data != ''){
        totalCnt = response.data[0].totalCnt;
        setChildCategoryList(response.data);
        reactJsPgSet({...rqHeader, totalCnt:totalCnt, show:true});

      } else {
        stateClear();
      }
        
    } catch (error) {
        response = error;
    } finally {
      properties.setLoadYn(false);
      return response;
    }
  };
  
  useEffect(() => {
    if(properties.isOpen){
      setSelectSearchKey(properties.searchKey);
      setInputSearchStr(properties.searchStr);
      setIsRequestHeaderUpdated(true);
      
    } 
  }, [properties.isOpen, properties.searchKey, properties.searchStr]);

  useEffect(() => {
    if(isRequestHeaderUpdated){
      search();
      setIsRequestHeaderUpdated(false);
    }
  }, [setSelectSearchKey, setInputSearchStr, isRequestHeaderUpdated]);

  if (!properties.isOpen) return null;


  const stateClear = function (){
    setChildCategoryList([]);
  }

  const reactJsPgClear = function (state) {
    setReactJsPgListSize(0);
    setReactJsPgShow(false);

    setRequestHeader({
      ...requestHeader,
      activePage: 1,
      listSize: 0,
      size: 10
    });
  }

  const reactJsPgSet = function (state) {
    setReactJsPgListSize(state.totalCnt);
    setReactJsPgShow(true);

    setRequestHeader({
      ...requestHeader,
      activePage : state.activePage,
      listSize : state.totalCnt
    });
  }

  const reactJsPgChange = (pageNumber) => {
    //rowClickCancel();

    const requestHeaderParam = {
      ...requestHeader, 
      searchKey: selectSearchKey,
      searchStr: inputSearchStr,
      activePage: pageNumber
    };

    setRequestHeader({
      ...requestHeaderParam
    });

    getChildCategoryList(requestHeaderParam, {});
  };

  const search = function(){
    let requestHeaderParam = {
      searchKey: selectSearchKey,
      searchStr: inputSearchStr,
      activePage: 1,
      listSize: 0,
      size: 10
    };
    getChildCategoryList(requestHeaderParam, {});
  }

  const searchReset = function(e){
    setSelectSearchKey(''); 
    setInputSearchStr('');
    setRequestHeader({
      searchKey : '', 
      searchStr : '',
      activePage: 1,
      listSize: 0,
      size: 10
    });
  }

  const handleSearchKeyChange = (e) => {
    const newSearchKey = e.target.value;
    setSelectSearchKey(newSearchKey); 
    
    setRequestHeader((prevRequestHeader) => ({
      ...prevRequestHeader,
      searchKey: newSearchKey
    }));
  }

  const handleSearchStrChange = (e) => {
    const newSearchStr = e.target.value;
    setInputSearchStr(newSearchStr);

    setRequestHeader((prevRequestHeader) => ({
      ...prevRequestHeader,
      searchStr: newSearchStr
    }));
  }

  const onClickSearchResetBtn = function(e){
    let requestHeaderParam = {
      activePage: 1,
      listSize: 0,
      size: 10
    }
    searchReset();
    getChildCategoryList(requestHeaderParam, {});
  }

  const inputSearchStrOnKeyUp = function(e){
    if(e.key == 'Enter'){
      search();
    }
  }

  return(
    <div className='modal category_list_modal'>
        <div className="modal_child">
            <div className="header">
                <div className="x" onClick={properties.onClose}><img src={icon_x_white}/></div>
            </div>
            <div className='search_box_parent'>
                <SearchBox searchSelectValue={selectSearchKey} searchTextValue={inputSearchStr} searchTextOnChange={(e)=>{handleSearchStrChange(e)}} searchSelectOnChange={(e)=>{handleSearchKeyChange(e)}} searchTextOnKeyUp={(e)=>{inputSearchStrOnKeyUp(e)}} options = {selectOptions} search={search} reset={onClickSearchResetBtn} placeholder_str='검색옵션 선택 후 검색어를 입력하세요.' />
            </div>
            <BoardList type="DtAttach"  placeholder_str='검색옵션 선택 후 검색어를 입력하세요.' thead={selectOptions} tbody={ChildCategoryList} onRowClick={properties.onRowClick}/>
            <div className='pagenation_box'>
                <div className='label'>총 카운트 {totalListSize}</div>
                <div className={reactJsPgShow ? 'pg show' : 'pg hide'}>
                  <ReactJsPg reactJsPgChange={reactJsPgChange} requestHeader={requestHeader}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CategoryListModal;
