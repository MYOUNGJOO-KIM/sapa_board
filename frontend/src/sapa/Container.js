import React, {useEffect, useRef, useState} from 'react'; 
import { useForm } from 'react-hook-form';
import axios from 'axios';

import { CategoryContext, useCategoryContext } from '../CategoryContexts';
import { categoryRegex } from './../utils/serviceRegex';
import { DATA_MAX_LENGTH, DATA_MGT_MAX_LENGTH } from './../utils/serviceMaxLength';
import { datePattern01, datePattern02, datePattern03, datePattern04 } from './../utils/patterns';
import Header from './Header'; 
import Input from '../board/FormInput'; 
import BoardList from '../board/BoardList';
import Select from './../board/FormSelect'
import BoardButton from './../board/BoardButton';
import ReactJsPagination from "react-js-pagination";
import SearchBox from "./../board/SearchBox";

import CategoryListTree from './CategoryListTree';

import './../assets/css/app.css';
import './../assets/css/container.css';



axios.defaults.withCredentials = true;

function Container( properties ){ 
  
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId') || "anonymous";

  const { cleanParam } = useCategoryContext();
  const [categoryListTreeList, setCategoryListTreeList] = useState([]);
  const [categoryListTreeUpdateList, setCategoryListTreeUpdateList] = useState([]);
  const [ChildCategoryList, setChildCategoryList] = useState([]);
  const [upCatSelectOptions, setUpCatSelectOptions] = useState([{key : '', value : '선택 없음'}]);

  const [isTreeOpen, setIsTreeOpen] = useState(false);
  const [treeMgtYn, setTreeMgtYn] = useState('');
  const [treePrintYn, setTreePrintYn] = useState('');

  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null);
  
  const [rowClickCatCd, setRowClickCatCd] = useState('');
  const [rowClickCatSeq, setRowClickCatSeq] = useState('');

  const [catSeq, setCatSeq] = useState('');
  const [inputCatCd, setInputCatCd] = useState('');
  const [inputCatNm, setInputCatNm] = useState('');
  const [inputUpCatCd, setInputUpCatCd] = useState('');
  const [inputUpCatNm, setInputUpCatNm] = useState('');
  const [inputPrintYn, setInputPrintYn] = useState('y');//false
  const [inputMgtYn, setInputMgtYn] = useState('y');//false
  const [od, setOd] = useState('');

  const [selectSearchKey, setSelectSearchKey] = useState('');//select
  const [inputSearchStr, setInputSearchStr] = useState('');//text
  
  const [showCancelBtn, setShowCancelBtn] = useState(false);
  const [showDelBtn, setShowDelBtn] = useState(false);
  const [showEditBtn, setShowEditBtn] = useState(false);
  const [showEditCancelBtn, setShowEditCancelBtn] = useState(false);

  const [reactJsPgShow, setReactJsPgShow] = useState(false);
  const [totalListSize, setReactJsPgListSize] = useState(0);

  const [requestHeader, setRequestHeader] = useState({
    activePage: 1,
    listSize: 0,
    size: 10,
    searchKey: '',
    searchStr: ''
  });

  const selectOptions = [
    {key : 'catNm', value : '카테고리 이름'}
    , {key : 'catCd', value : '카테고리 코드'}
  ];

  const getCategoryListTreeList = async () => {
    let response;
    try {
      if (!properties.loadYn){properties.setLoadYn(true);}
      response = await axios.post(`${apiBaseUrl}/category/getTree`, {mgtYn:treeMgtYn, printYn:treePrintYn});
      if(response.data.length > 0){
        setCategoryListTreeList(response.data);
        setIsTreeOpen(true);
      }
    } catch (error) {
      response = error;
    } finally {
      properties.setLoadYn(false);
      return response;
    }
  }

  useEffect(() => {
    getCategoryListTreeList();
  }, []);

  useEffect(() => {
    if (isTreeOpen) {
      getChildCategoryList(requestHeader, {});
      getParentCategoryList({},{});
    }
  }, [isTreeOpen]);

  const getChildCategoryList = async (requestHeaderParam, requestBody) => {
    let rqHeader = cleanParam(requestHeaderParam);
    let rqBody = cleanParam(requestBody);
    let response;

    try {
      if (!properties.loadYn){properties.setLoadYn(true);}
      reactJsPgClear();
      response = await axios.post(`${apiBaseUrl}/category/getChildCategoryList`, rqBody, {params:rqHeader});

      let totalCnt = 0;

      if(response.data != null && response.data != ''){
        totalCnt = response.data[0].totalCnt;
        setChildCategoryList(response.data);
        reactJsPgSet({...rqHeader, totalCnt:totalCnt, show:true});
        
      } else {
        setChildCategoryList([]);
      }
      
    } catch (error) {
      response = error;
    } finally {
      properties.setLoadYn(false);
      return response;
    }
  };

  const getParentCategoryList = async (requestHeader, requestBody) => {

    let response;

    try {
      if (!properties.loadYn){properties.setLoadYn(true);}
      response = await axios.post(`${apiBaseUrl}/category/getParentCategoryList`, requestHeader, requestBody);
      
      if(response.data != null && response.data != ''){
        
        response.data.forEach(function(category) {
          category.value = "---".repeat(category.level)+' '+category.value;
        });
        response.data.unshift({key : '', value : '선택 없음'});
        setUpCatSelectOptions(response.data);
      }
      
    } catch (error) {
      response = error;
    } finally {
      properties.setLoadYn(false);
      return response;
    }
  };

  const saveCategory = async (requestHeaderParam, requestBody) => {
    if(validation(requestBody)){
      requestBody.chgId = userId;//테스트 때문에

      const rqHeader = cleanParam(requestHeaderParam);
      const rqBody = cleanParam(requestBody);

      let response;
      try {
        if (!properties.loadYn){properties.setLoadYn(true);}
        if(catSeq > 0){
          response = (await axios.put(`${apiBaseUrl}/category/put`, rqBody, {params:rqHeader}));
        } else {
          rqBody.inId = userId;
          response = (await axios.post(`${apiBaseUrl}/category/post`, rqBody, {params:rqHeader}));
        }

        alert("카테고리 업데이트 완료");
      } catch (error) {
        response = error;
        alert("카테고리 업데이트 실패\n"+response.response.data.message);
      } finally {

        cancel();
        getCategoryListTreeList();
        getParentCategoryList({},{});
        getChildCategoryList(requestHeaderParam, {});
        
        properties.setLoadYn(false);
        return response;
      }
    }
  };

  const onSaveBtnClick = function () {
    let uParam = {
      catSeq : catSeq 
      , catCd : inputCatCd
      , catNm : inputCatNm
      , upCatCd : inputUpCatCd
      , upCatNm : inputUpCatNm
      , printYn : inputPrintYn
      , mgtYn : inputMgtYn
      , od : od
    };
    saveCategory(requestHeader, uParam);
  }

  const deleteCategory = async (requestHeaderParam, requestBody) => {
    if(validation(requestBody)){
      requestBody.chgId = userId;//테스트 때문에
      const rqHeader = cleanParam(requestHeaderParam);
      const rqBody = cleanParam(requestBody);
  
      let response;
      try {
        if (!properties.loadYn){properties.setLoadYn(true);}
        response = (await axios.put(`${apiBaseUrl}/category/delete`, rqBody, {params:rqHeader}));
        alert("카테고리 삭제 완료");
      } catch (error) {
        response = error;
        alert("카테고리 삭제 실패\n"+response.response.data.message);
      } finally {

        cancel();
        getCategoryListTreeList();
        getParentCategoryList({},{});
        getChildCategoryList(requestHeaderParam, {});

        properties.setLoadYn(false);
        return response;
      }
    }
  };

  const onDeleteBtnClick = function () {
    let uParam;

    if(rowClickCatSeq){
      uParam = {
        catSeq : catSeq 
        , catCd : inputCatCd
        , catNm : inputCatNm
        , upCatCd : inputUpCatCd
        , upCatNm : inputUpCatNm
      };
    } else {
      uParam = {
        catSeq : selectedInfo.node.catSeq 
        , catCd : selectedKeys[0]
        , catNm : selectedInfo.node.title
        , upCatCd : selectedInfo.node.upCatCd
        , upCatNm : selectedInfo.node.upCatNm
      };
    }
    deleteCategory(requestHeader, uParam);
  }

  const stateSelectedClear = function (){
    setSelectedKeys([]);
    setSelectedInfo(null);
  }

  const stateClear = function (){
    setCatSeq('');
    setOd('');
    setRowClickCatCd('');
    setRowClickCatSeq('');
    btnView('i');
    setChildCategoryList([]);
  }

  const stateSet = (state) => {
    if (state.catSeq || state.catSeq == '') {
      setCatSeq(state.catSeq);
     }
    if (state.od || state.od == '') {
      setOd(state.od);
    }
    if (state.selectedKeys || state.selectedKeys == '') {
      setSelectedKeys(state.selectedKeys);
    }
    if (state.selectedInfo || state.selectedInfo == '') {
      setSelectedInfo(state.selectedInfo);
    }
    if (state.rowClickCatCd || state.rowClickCatCd == '') { 
      setRowClickCatCd(state.rowClickCatCd);
    }
    if (state.rowClickCatSeq || state.rowClickCatSeq == '') {
      setRowClickCatSeq(state.rowClickCatSeq);
    }
  }

  const inputClear = function(){
    setInputCatNm('');
    setInputCatCd('');
    setInputUpCatCd('');
    setInputUpCatNm('');
    setInputPrintYn('y');
    setInputMgtYn('y');
  }

  const inputSet = function (category){
    if (category.catCd) {
      setInputCatCd(category.catCd);
    }
    if (category.catNm) {
      setInputCatNm(category.catNm);
    }
    if (category.upCatCd || category.upCatCd == '') {
      setInputUpCatCd(category.upCatCd);
    }
    if (category.upCatNm) {
      setInputUpCatNm(category.upCatNm);
    }
    if (category.printYn) {
      setInputPrintYn(category.printYn);
    }
    if (category.mgtYn) {
      setInputMgtYn(category.mgtYn);
    }
  }

  const reactJsPgClear = function (state) {
    setReactJsPgListSize(0);
    setReactJsPgShow(false);

    setRequestHeader({
      ...requestHeader,
      activePage : 1,
      listSize : 0
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
    rowClickCancel();

    const requestHeaderParam = {
      ...requestHeader,  // 기존 상태 복사
      activePage: pageNumber,  // 새로운 activePage로 업데이트
    };

    setRequestHeader({
      ...requestHeader,
      activePage: pageNumber
    });

    if (selectedKeys.length > 0) {
      const updatedRequestBody = {
        catSeq: selectedInfo.node.catSeq,
        catCd: selectedInfo.node.key,
        catNm: selectedInfo.node.title,
        upCatCd: selectedInfo.node.upCatCd || '',
        upCatNm: selectedInfo.node.upCatNm,
        od: selectedInfo.node.od,
      };
      getChildCategoryList(requestHeaderParam, updatedRequestBody);
      btnView('ti');
    } else {
      getChildCategoryList(requestHeaderParam, {});
      btnView('i');
    }
  };

  const btnView = function (state){
    switch(state){
      case 'i' : 
        setShowCancelBtn(false);
        setShowEditBtn(false);
        setShowEditCancelBtn(false);
        setShowDelBtn(false);
      break;
      case 'u' :
        setShowCancelBtn(false);
        setShowEditBtn(false);
        setShowEditCancelBtn(true);
        setShowDelBtn(true);
      break;
      case 'ti' : 
        setShowCancelBtn(true);
        setShowEditBtn(true);
        setShowEditCancelBtn(false);
        setShowDelBtn(false);
      break;
      case 'tu' :
        setShowCancelBtn(true);
        setShowEditBtn(false);
        setShowEditCancelBtn(true);
        setShowDelBtn(true);
      break;
    }
  }

  const search = function(e){
    let iParam = {};
    let requestHeaderParam = {
      activePage: 1,
      listSize: 0,
      size: 10,
      searchKey: selectSearchKey,
      searchStr: inputSearchStr
    };
    if(selectedKeys.length > 0){
      iParam = {
        catSeq : selectedInfo.node.catSeq 
        , catNm : selectedInfo.node.title  
        , catCd : selectedKeys[0] 
        , upCatCd : selectedInfo.node.upCatCd 
        , upCatNm : selectedInfo.node.upCatNm 
        , od : selectedInfo.node.od
      }
    }
    getChildCategoryList(requestHeaderParam, iParam);
  }

  const searchReset = function(e){
    setSelectSearchKey(''); 
    setInputSearchStr(''); 
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

  const cancel = function () {
    stateSelectedClear();
    stateClear();
    searchReset();
    inputClear();
  }

  const onCancelBtnClick = function () {
    let requestHeaderParam = {
      activePage: 1,
      listSize: 0,
      size: 10
    }
    cancel();
    getChildCategoryList(requestHeaderParam, {});
  }

  const onEditClick = function(){
    //tu, u
    editCancel();
    let uParam = {};
    let stateSetParam = {};
    let btnViewState = '';

    uParam = {
      catSeq : selectedInfo.node.catSeq 
      , catNm : selectedInfo.node.title 
      , catCd : selectedKeys[0]   
      , upCatCd : selectedInfo.node.upCatCd 
      , upCatNm : selectedInfo.node.upCatNm 
      , printYn : selectedInfo.node.printYn
      , mgtYn : selectedInfo.node.mgtYn  
      , od : selectedInfo.node.od 
    }
    btnViewState = selectedKeys.length > 0 ? 'tu' : 'u';

    stateSet(uParam);

    inputSet(uParam);

    btnView(btnViewState);
  }

  const editCancel = function(){
    inputClear();
  }

  const onEditCancelClick = function(){
    //ti, i
    editCancel();
    let iParam = {};
    let stateSetParam = {};
    if(selectedKeys.length > 0){
      iParam = {
        upCatCd : selectedInfo.node.key 
        , upCatNm : selectedInfo.node.title 
        , printYn : selectedInfo.node.printYn 
        , mgtYn : selectedInfo.node.mgtYn 
      }
      
      btnView('ti');
    } else {
      iParam = {
        upCatCd : ''
        , upCatNm : ''
        , printYn : 'y'
        , mgtYn : 'y'
      }
      btnView('i');
    }
    stateSetParam = {rowClickCatCd : '', rowClickCatSeq : '', catSeq : '', od:''};
    stateSet(stateSetParam);
    inputSet({...iParam, ...stateSetParam});
  }

  const inputSearchStrOnKeyUp = function(e){
    if(e.key == 'Enter'){
      search();
    }
  }

  const onSelectChange = function(e){
    if(e.target.value == null){
      setInputUpCatCd('');
    } else{ 
      setInputUpCatCd(e.target.value);
    }
  }

  const validation = function (data) {
    if (!categoryRegex.catCd.test(data.catCd)) {
      alert('카테고리 코드가 잘못 입력되었습니다.');
      return false;
    }
    if (!categoryRegex.catNm.test(data.catNm)) {
      alert('카테고리명이 잘못 입력되었습니다.');
      return false;
    }
    return true;
  }

  const onTreeSelect = (selectedKeys, selectedInfo, d,e,f) => {
    //ti, i
    cancel();
    let iParam = {};
    let uParam = {};
    let stateSetParam = {};
    const requestHeaderParam = {
      activePage: 1,
      listSize: 0,
      size: 10
    };
    if(selectedKeys.length > 0){
      iParam = {
        upCatCd : selectedKeys[0]
        , upCatNm : selectedInfo.node.title
        , printYn : selectedInfo.node.printYn
        , mgtYn : selectedInfo.node.mgtYn
      }
      uParam = {
        catSeq : selectedInfo.node.catSeq   
        , catNm : selectedInfo.node.title  
        , catCd : selectedKeys[0]   
        , upCatCd : selectedInfo.node.upCatCd  
        , upCatNm : selectedInfo.node.upCatNm  
        // , printYn : selectedInfo.node.printYn //조회 이거 영향받음
        // , mgtYn : selectedInfo.node.mgtYn    //조회 이거 영향받음
        , od : selectedInfo.node.od 
      }
      stateSetParam = {...iParam, selectedKeys : selectedKeys, selectedInfo : selectedInfo};
      stateSet(stateSetParam);
      inputSet(iParam);

      getChildCategoryList(requestHeaderParam, uParam);

      btnView('ti');
    } else {
      getChildCategoryList(requestHeaderParam, {});

      btnView('i');
    }
  };

  const onRowClick = function(selectedObj){
    //tu, u, ti, i
    editCancel();
    let uParam = {};
    let stateSetParam = {};
    let btnViewState = '';

    if (rowClickCatSeq != selectedObj.catSeq) {//정보 세팅

      btnViewState = selectedKeys.length > 0 ? 'tu' : 'u';
      
      stateSetParam = {rowClickCatCd : selectedObj.catCd, rowClickCatSeq : selectedObj.catSeq, catSeq : selectedObj.catSeq, od : selectedObj.od};
      
      stateSet(stateSetParam);
      inputSet(selectedObj);
    } else {//clear

      if(selectedKeys.length > 0){//트리선택
        btnViewState = 'ti';
        uParam = {
          upCatCd : selectedKeys[0]
          , upCatNm : selectedInfo.node.title
          , printYn : selectedInfo.node.printYn
          , mgtYn : selectedInfo.node.mgtYn
        }
        stateSetParam = {rowClickCatCd : '', rowClickCatSeq : '', catSeq : '', od : ''};
        
        stateSet(stateSetParam);
        inputSet({...uParam, ...stateSetParam});
      } else {
        btnViewState = 'i';
        rowClickCancel();
      }
    }
    btnView(btnViewState);
  }

  const rowClickCancel = function () {
    //ti, i
    const stateSetParam = {rowClickCatCd : '', rowClickCatSeq : '', catSeq : '', od : ''};
    stateSet(stateSetParam);
    inputClear();
  }
  

  return ( 
    <div className='root_box admin'>
      <div className='cont'>
        <Header title='카테고리 설정'/>
        <div className='contents_box'>
          <div className='content_box category_box'>
            <div className='content_header'>트리뷰</div>
            <CategoryListTree onClick={onTreeSelect} selectedKeys={selectedKeys} mgtYn={treeMgtYn} treeData={categoryListTreeList} setCategoryListTreeList={setCategoryListTreeList} categoryListTreeUpdateList={categoryListTreeUpdateList} setCategoryListTreeUpdateList = {setCategoryListTreeUpdateList}/>
          </div>
          <div className='dnm_content'>
            <div className='content_box cat_in'>
              <div className='content_header'>카테고리 신규 생성
                  <div className='button_box'>
                      <BoardButton type="cancel" color="white" show={showCancelBtn} onClick={onCancelBtnClick}/>
                      <BoardButton type="cancel_put" color="white" show={showEditCancelBtn} onClick={onEditCancelClick}/>
                      <BoardButton type="put" color="white" show={showEditBtn} onClick={onEditClick}/>
                      <BoardButton type="save" color="orange" onClick={onSaveBtnClick}/>
                      <BoardButton type="delete" color="white" show={showDelBtn} onClick={onDeleteBtnClick}/>
                  </div>
              </div>
              <div className='input_container_box'>
                  <Input type = 'text' value={inputCatNm} onChange={(event)=>{setInputCatNm(event.target.value);}} label_str = '카테고리명' placeholder_str='카테고리명을 입력하세요.'/>
                  <Input type = 'text' value={inputCatCd} onChange={(event)=>{setInputCatCd(event.target.value);}} label_str = '코드' placeholder_str='코드를 입력하세요.'/>
              </div>
              <div className='input_container_box'>
                  <div className="input_container select">
                    <span className='ol_dot'/>
                      <label>상위 카테고리</label>
                      <Select value={inputUpCatCd} options = {upCatSelectOptions} onChange = {(e)=>{onSelectChange(e)}}/>
                  </div>
                  <Input type = 'checkbox' isChecked={inputPrintYn == 'y' ? true : false} label_str = '출력대상여부' imgs = {properties.imgs} onChange = {(event)=>{setInputPrintYn(inputPrintYn == 'y' ? 'n' : 'y');}}/> 
                  <Input type = 'checkbox' isChecked={inputMgtYn == 'y' ? true : false} label_str = '관리항목유무' imgs = {properties.imgs} onChange = {(event)=>{setInputMgtYn(inputMgtYn == 'y' ? 'n' : 'y');}}/>
              </div>
            </div>
            <div className='content_box cat_sel'>
                <div className='content_header'><span className='title'>하위 카테고리명</span></div>
                <div className='search_box_parent'>
                    <SearchBox  searchSelectValue={selectSearchKey} searchTextValue={inputSearchStr} searchTextOnChange={(e)=>{setInputSearchStr(e.target.value);}} searchSelectOnChange={(e)=>{setSelectSearchKey(e.target.value);}} searchTextOnKeyUp={(e)=>{inputSearchStrOnKeyUp(e)}} options={selectOptions} search={search} reset={onClickSearchResetBtn} disabled={showEditCancelBtn ? true : false} placeholder_str='검색옵션 선택 후 검색어를 입력하세요.'/>
                </div>
                <BoardList type="DtAttach" placeholder_str='검색옵션 선택 후 검색어를 입력하세요.' thead={[{key : 'catCd', value : '카테고리 코드'},{key : 'catNm', value : '카테고리 이름'}]} tbody={ChildCategoryList} onRowClick={onRowClick} selectedId={rowClickCatSeq} />
                <div className='pagenation_box'>
                    <div className='label'>총 카운트 {totalListSize}</div>
                    <div className={reactJsPgShow ? 'pg show' : 'pg hide'}>
                      <ReactJsPg reactJsPgChange={reactJsPgChange} requestHeader={requestHeader}/>
                    </div>
                </div>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Container;


class ReactJsPg extends React.Component {
  
  updateActivePage = (newActivePage) => {
    this.setState({activePage : newActivePage});
  }

  updateListSize = (newSize) => {
    this.setState({listSize : newSize});
  }
  
  handlePageChange(pageNumber) {
    this.props.reactJsPgChange(pageNumber);
  }
  
  render() {
    return (
      <ReactJsPagination
        activePage={this.props.requestHeader.activePage}//Required
        totalItemsCount={this.props.requestHeader.listSize}//Required
        itemsCountPerPage={this.props.requestHeader.size}
        onChange={this.handlePageChange.bind(this)}//Required
        pageRangeDisplayed={5}
        innerClass='pagination'//ul className
        itemClass='n5'//li className
        activeClass='active'//li active className
        activeLinkClass=''//a active className
        itemClassFirst='last_item'//<< className
        itemClassPrev='prev_item'//< className
        itemClassNext='next_item'//> className
        itemClassLast='last_item'//>> className
        hideDisabled={false}
      />
    );
  }
}
