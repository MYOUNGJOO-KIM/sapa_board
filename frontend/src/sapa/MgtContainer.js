// MgtContainer.js
//
// VIEW: /mgt, 관리항목 관리
// TODO: 
// FIXME: 유효성 변경 시 필요에 맞게 mgtRegex(serviceRegex) 수정 필요.
// HACK: 
// NOTE: 
// REFACTOR: 비동기 함수를 실행할 때 iParam, uParam 등을 사용하는 로직이므로, 이후 리팩토링 필요 
// IMPORTANT: 
// INDT: 2024.12.24
// INID: MJK


import React, {useEffect, useState, useRef} from 'react'; 
import { useForm } from 'react-hook-form';
import axios from 'axios';

import { CategoryContext, useCategoryContext } from '../CategoryContexts';
import { mgtRegex } from './../utils/serviceRegex';
import { MGT_MAX_LENGTH } from './../utils/serviceMaxLength';
import Header from './Header';
import Input from '../board/FormInput';  
import BoardList from '../board/BoardList';
import Select from './../board/FormSelect'
import BoardButton from './../board/BoardButton';

import CategoryListTree from './CategoryListTree';
import ReactJsPg from './ReactJsPg';

import './../assets/css/app.css';
import './../assets/css/mgt_container.css';



function MgtContainer( properties ){
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId') || "anonymous";

    const { cleanParam, CategoryList, CategoryListLoading, CategoryListError } = useCategoryContext();
    const [categoryListTreeList, setCategoryListTreeList] = useState([]);
    const [mgtList, setMgtList] = useState([]);
    
    const [isTreeOpen, setIsTreeOpen] = useState(true);
    const [treeMgtYn, setTreeMgtYn] = useState('y');
    const [treePrintYn, setTreePrintYn] = useState('');

    const [selectedKeys, setSelectedKeys] = useState([]);
    const [selectedInfo, setSelectedInfo] = useState(null);

    const [rowClickMgtSeq, setRowClickMgtSeq] = useState('');

    const [mgtSeq, setMgtSeq] = useState('');
    const [inputCatCd, setInputCatCd] = useState('');
    const [inputCatNm, setInputCatNm] = useState('');
    const [inputMgtNm, setInputMgtNm] = useState('');
    const [selectDataType, setSelectDataType] = useState('');
    const [inputMgtOrderSeq, setInputMgtOrderSeq] = useState('');
    
    const [showDelBtn, setShowDelBtn] = useState(false);
    
    const [formDisabled, setFormDisabled] = useState(true);

    const [reactJsPgShow, setReactJsPgShow] = useState(false);
    const [totalListSize, setReactJsPgListSize] = useState(0);

    const [requestHeader, setRequestHeader] = useState({
      activePage: 1,
      listSize: 0,
      size: 10,
      searchKey: '',
      searchStr: ''
    });

    const getCategoryListTreeList = async ( ) => {
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

    const dataTypeSelectOptions = [
      {key : '', value : '선택없음'}
      , {key : 'yyyyMMddhhmmss', value : '연월일시(DATE)'}
      , {key : 'yyyy', value : '연도(YEAR)'}
      , {key : 'MM', value : '월(MONTH)'}
      , {key : 'dd', value : '일자(DAY)'}
      // , {key : 'hh', value : '시간(HOUR)'}
      // , {key : 'hhmmss', value : '시분초(TIME)'}
      // , {key : 'date', value : '연월일자(DATE)'}
      // , {key : 'datetime', value : '연월일시간(DATETIME)'}
      // , {key : 'dayoftheweek', value : '요일(DAYOFTHEWEEK)'}
      , {key : 'text', value : '텍스트 입력'}
      , {key : 'number', value : '숫자 입력'}
    ];

    const getMgtList = async (requestHeaderParam, requestBody) => {
      const rqHeader = cleanParam(requestHeaderParam);
      const rqBody = cleanParam(requestBody);
      let response;

      try {
        if (!properties.loadYn){properties.setLoadYn(true);}
        reactJsPgClear();
        response = (await axios.post(`${apiBaseUrl}/category_mgt/get`, rqBody, {params:rqHeader}));//`${apiBaseUrl}/category_mgt/get`
        
        let totalCnt = 0;

        if(response.data != null && response.data != ''){
          totalCnt = response.data[0].totalCnt;

          response.data.map((data, i)=>{
            dataTypeSelectOptions.map((pattern, i)=> {
              if(data.dataType == pattern.key){
                data['mappedDataType'] = pattern.value;
              }
            })
          });

          setMgtList(response.data);
          reactJsPgSet({...rqHeader, totalCnt:totalCnt, show:true});
        } else {

        }

      } catch (error) {
        response = error;
      } finally {
        properties.setLoadYn(false);
        return response;
      }
    };

    const saveMgt = async (requestHeaderParam, requestBody) => {
      if(validation(requestBody)){
        requestBody.chgId = userId;

        const rqHeader = cleanParam(requestHeaderParam);
        const rqBody = cleanParam(requestBody);

        let response;
        try {
          if (!properties.loadYn){properties.setLoadYn(true);}
          if(mgtSeq > 0){
            response = (await axios.put(`${apiBaseUrl}/category_mgt/put`, rqBody, {params:rqHeader}));
          } else {
            rqBody.inId = userId;
            response = (await axios.post(`${apiBaseUrl}/category_mgt/post`, rqBody, {params:rqHeader}));
          }
          
          alert("관리항목 업데이트 완료");
        } catch (error) {
          response = error;
          alert("관리항목 업데이트 실패");
        } finally {
          onCancelBtnClick();
          properties.setLoadYn(false);
          return response;
        }
      }
    };

    const onSaveBtnClick = function () {
      let uParam = {
        mgtSeq : mgtSeq
        , catCd : inputCatCd
        , catNm : inputCatNm
        , mgtNm : inputMgtNm
        , dataType : selectDataType
        , mgtOrderSeq : inputMgtOrderSeq
      };
      saveMgt(requestHeader, uParam);
    }
  
    const deleteMgt = async (requestHeaderParam, requestBody) => {
      if(validation(requestBody)){
        requestBody.chgId = userId;

        const rqHeader = cleanParam(requestHeaderParam);
        const rqBody = cleanParam(requestBody);
    
        let response;
        try {
          if (!properties.loadYn){properties.setLoadYn(true);}
          response = (await axios.put(`${apiBaseUrl}/category_mgt/delete`, rqBody, {params:rqHeader}));

          alert("관리항목 삭제 완료");
        } catch (error) {
          response = error;
          alert("관리항목 삭제 실패");
        } finally {
          onCancelBtnClick();

          properties.setLoadYn(false);
          return response;
        }
      }
    };

    const onDeleteBtnClick = function () {
      let uParam;
  
      if(rowClickMgtSeq){
        uParam = {
          mgtSeq : mgtSeq
          , catCd : inputCatCd
          , catNm : inputCatNm
          , mgtNm : inputMgtNm
          , dataType : selectDataType
          , mgtOrderSeq : inputMgtOrderSeq
        };
      } 
      deleteMgt(requestHeader, uParam);
    }
          
    const stateSelectedClear = function (){
      setSelectedKeys([]);
      setSelectedInfo(null);
    }
    
    const stateClear = function(){
      setMgtSeq('');
      setRowClickMgtSeq('');
      setShowDelBtn(false);
      setMgtList([]);
      btnView('r');
      setFormDisabled(true);
    }
    
    const stateSet = (state) => {
      if (state.mgtSeq || state.mgtSeq == '') {
        setMgtSeq(state.mgtSeq);
      }
      if (state.selectedKeys || state.selectedKeys == '') {
        setSelectedKeys(state.selectedKeys);
      }
      if (state.selectedInfo || state.selectedInfo == '') {
        setSelectedInfo(state.selectedInfo);
      }
      if (state.rowClickMgtSeq || state.rowClickMgtSeq == '') {
        setRowClickMgtSeq(state.rowClickMgtSeq);
      }
    }

    const inputClear = function(){
      setInputCatCd('');
      setInputCatNm('');
      setInputMgtNm('');
      setSelectDataType('');
      setInputMgtOrderSeq('');
    }
    
    const inputSet = function (mgt){
      if (mgt.catCd) {
        setInputCatCd(mgt.catCd);
      }
      if (mgt.catNm) {
        setInputCatNm(mgt.catNm);
      }
      if (mgt.mgtNm) {
        setInputMgtNm(mgt.mgtNm);
      }
      if (mgt.dataType) {
        setSelectDataType(mgt.dataType);
      }
      if (mgt.mgtOrderSeq) {
        setInputMgtOrderSeq(mgt.mgtOrderSeq);
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
        ...requestHeader, 
        activePage: pageNumber,
      };
  
      setRequestHeader({
        ...requestHeader,
        activePage: pageNumber
      });
  
      const updatedRequestBody = {
        catCd : selectedInfo.node.key
        , catNm : selectedInfo.node.title
      };
      getMgtList(requestHeaderParam, updatedRequestBody);
      btnView('i');
    };

    const btnView = function (state){
      switch(state){
        case 'i' : 
          setShowDelBtn(false);
        break;
        case 'u' :
          setShowDelBtn(true);
        break;
        case 'r' :
          setShowDelBtn(false);
        break;
      }
    }

    const cancel = function () {
      stateSelectedClear();
      stateClear();
      inputClear();
    }
  
    const onCancelBtnClick = function () {
      cancel();
      reactJsPgClear();
    }

    const editCancel = function(){
      inputClear();
    }

    const onSelectChange = function(e){
      if(e.target.value == null){
        setSelectDataType('');
      } else{ 
        setSelectDataType(e.target.value);
      }
    }

    const validation = function (data) {
      if (data.catCd.length > MGT_MAX_LENGTH.catCd) {
        alert('카테고리 코드의 최대 글자 수를 '+ (data.catCd.length - MGT_MAX_LENGTH.catCd)+' 만큼 초과하였습니다. (최대 글자수 : '+MGT_MAX_LENGTH.catCd+' 자)');
        return false;
      }
      if (!mgtRegex.catCd.test(data.catCd)) {
        alert('카테고리 코드가 잘못 입력되었습니다.');
        return false;
      }
      if (data.catNm.length > MGT_MAX_LENGTH.catNm) {
        alert('카테고리명의 최대 글자 수를 '+ (data.catNm.length - MGT_MAX_LENGTH.catNm)+' 만큼 초과하였습니다. (최대 글자수 : '+MGT_MAX_LENGTH.catNm+' 자)');
        return false;
      }
      if (!mgtRegex.catNm.test(data.catNm)) {
        alert('카테고리명이 잘못 입력되었습니다.');
        return false;
      }
      if (data.mgtNm.length > MGT_MAX_LENGTH.mgtNm) {
        alert('관리항목명의 최대 글자 수를 '+ (data.mgtNm.length - MGT_MAX_LENGTH.mgtNm)+' 만큼 초과하였습니다. (최대 글자수 : '+MGT_MAX_LENGTH.mgtNm+' 자)');
        return false;
      }
      if (!mgtRegex.mgtNm.test(data.mgtNm)) {
        alert('관리항목명이 잘못 입력되었습니다.');
        return false;
      }
      if (data.dataType.length > MGT_MAX_LENGTH.dataType) {
        alert('관리항목 형식의 최대 글자 수를 '+ (data.dataType.length - MGT_MAX_LENGTH.dataType)+' 만큼 초과하였습니다. (최대 글자수 : '+MGT_MAX_LENGTH.dataType+' 자)');
        return false;
      }
      if (!mgtRegex.dataType.test(data.dataType)) {
        alert('관리항목 형식이 잘못 선택되었습니다.');
        return false;
      }
      if (Number(data.mgtOrderSeq) < MGT_MAX_LENGTH.mgtOrderSeqMinSize || Number(data.mgtOrderSeq) > MGT_MAX_LENGTH.mgtOrderSeqMaxSize) {
        alert('항목순서의 범위는 '+ MGT_MAX_LENGTH.mgtOrderSeqMinSize +' ~ '+MGT_MAX_LENGTH.mgtOrderSeqMaxSize+' 입니다.');
        return false;
      }
      if (!mgtRegex.mgtOrderSeq.test(data.mgtOrderSeq)) {
        alert('항목순서가 잘못 입력되었습니다.');
        return false;
      }
      return true;
    }

    const onTreeSelect = (selectedKeys, selectedInfo) => {
      cancel();
      let iParam = {};
      let stateSetParam = {};
      const requestHeaderParam = {
        activePage: 1,
        listSize: 0,
        size: 10
      };
      if(selectedKeys.length > 0){
        iParam = {
          catCd : selectedKeys[0]
          , catNm : selectedInfo.node.title
          // , mgtNm : inputMgtNm
          // , dataType : selectDataType
          // , mgtOrderSeq : selectedInfo.node.inputMgtOrderSeq
        }
        
        stateSetParam = {mgtSeq : selectedInfo.node.mgtSeq, selectedKeys : selectedKeys, selectedInfo : selectedInfo};
        stateSet(stateSetParam);
        inputSet(iParam);

        getMgtList(requestHeaderParam, iParam);
        setFormDisabled(false);
      } else {
        reactJsPgClear();
        setFormDisabled(true);
      }
    };
    
    const onRowClick = function(selectedObj){
      //u, i
      editCancel();
      let uParam = {};
      let stateSetParam = {};
      let btnViewState = '';

      if (rowClickMgtSeq != selectedObj.mgtSeq) {

        btnViewState = 'u';

        stateSetParam = {rowClickMgtSeq : selectedObj.mgtSeq, mgtSeq : selectedObj.mgtSeq};

        stateSet(stateSetParam);
        inputSet(selectedObj);
      } else {
        btnViewState = 'i';
        rowClickCancel();
      }
      btnView(btnViewState);
    }

    const rowClickCancel = function () {
      //ti, i
      const stateSetParam = {rowClickMgtSeq : '', mgtSeq : ''};
      stateSet(stateSetParam);
      inputClear();
    }
    

    return (
    <div className='root_box admin'>
      <div className='mgt'>
        <Header title='관리항목 관리'/>
        <div className='contents_box'>
          <div className='content_box category_box'>
            <div className='content_header'>트리뷰</div>
            <CategoryListTree onClick={onTreeSelect} selectedKeys={selectedKeys} mgtYn={treeMgtYn} treeData={categoryListTreeList}/>
          </div>
          <div className='dnm_content'>
            <div className='content_box cat_in'>
                <div className='content_header'>관리항목 관리
                    <div className='button_box'>{/* className={showDelBtn ? 'button_box n3' : 'button_box n2'} */}
                        <BoardButton type="cancel" color="white" onClick={onCancelBtnClick} disabled={formDisabled}/>
                        <BoardButton type="save" color="orange" onClick={onSaveBtnClick} disabled={formDisabled}/>
                        <BoardButton type="delete" color="white" show={showDelBtn} onClick={onDeleteBtnClick} disabled={formDisabled}/>
                    </div>
                </div>
                <div className='input_container_box'>
                    <Input type = 'text' value={inputCatNm} onChange={(event)=>{setInputCatNm(event.target.value);}} label_str = '카테고리명' placeholder_str='카테고리명을 입력하세요.' disabled={true}/>
                    <Input type = 'text' value={inputCatCd} onChange={(event)=>{setInputCatCd(event.target.value);}} label_str = '코드' placeholder_str='코드를 입력하세요.' disabled={true}/>
                </div>
                <div className='input_container_box'>
                    <Input type = 'text' value={inputMgtNm} onChange={(event)=>{setInputMgtNm(event.target.value);}}  label_str = '관리항목명' placeholder_str='관리항목명을 입력하세요.' disabled={formDisabled}/>
                    <div className="input_container select"><span className='ol_dot'/><label>관리항목형식</label>
                      <Select value={selectDataType} options = {dataTypeSelectOptions} onChange = {(e)=>{onSelectChange(e)}} disabled={formDisabled}/>
                    </div>
                </div>
                <div className='input_container_box'>
                  <Input type = 'number' value={inputMgtOrderSeq} onChange={(event)=>{setInputMgtOrderSeq(event.target.value);}}  label_str = '항목순서' placeholder_str='항목순서를 숫자로 입력하세요.' disabled={formDisabled}/>
                </div>
            </div>
            <div className='content_box cat_sel'>
                <div className='content_header'><span className='title'>관리항목</span></div>
                
                <BoardList type="DtAttach" placeholder_str='검색옵션 선택 후 검색어를 입력하세요.'  thead={[{key : 'mgtNm', value : '관리항목명'},{key : 'mappedDataType', value : '자료형식'}]} tbody={mgtList} onRowClick={onRowClick} selectedId={rowClickMgtSeq} />
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

export default MgtContainer;
