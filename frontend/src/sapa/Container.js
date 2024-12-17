import React, {useEffect, useRef, useState} from 'react';  
import './../assets/css/app.css';
import './../assets/css/container.css';
import Input from '../board/FormInput'; 
import BoardList from '../board/BoardList';
import Select from './../board/FormSelect'
import BoardButton from './../board/BoardButton';
import ReactJsPagination from "react-js-pagination";
import SearchBox from "./../board/SearchBox";
import CategoryListTree from './CategoryListTree';
import Header from './Header';
import axios from 'axios';
import { CategoryContext, useCategoryContext } from '../CategoryContexts';
import { categoryRegex } from './../utils/serviceRegex';
import { format } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';

axios.defaults.withCredentials = true;

function Container( properties ){ 
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId') || "anonymous";

  const { cleanParam } = useCategoryContext();
  const [categoryListTreeList, setCategoryListTreeList] = useState([]);

  const [ChildCategoryList, setChildCategoryList] = useState([]);
  const [upCatSelectOptions, setUpCatSelectOptions] = useState([{key : '', value : '선택 없음'}]);
  
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [rowClickCatCd, setRowClickCatCd] = useState('');
  const [rowClickCatSeq, setRowClickCatSeq] = useState('');

  const [catSeq, setCatSeq] = useState('');
  const [inputCatNm, setInputCatNm] = useState('');
  const [inputCatCd, setInputCatCd] = useState('');
  const [inputUpCatCd, setInputUpCatCd] = useState('');
  const [inputUpCatNm, setInputUpCatNm] = useState('');
  const [inputPrintYn, setInputPrintYn] = useState('y');//false
  const [inputMgtYn, setInputMgtYn] = useState('y');//false

  const [selectSearchKey, setSelectSearchKey] = useState('');//select
  const [inputSearchStr, setInputSearchStr] = useState('');//text
  
  const [showDelBtn, setShowDelBtn] = useState(false);
  const [showEditBtn, setShowEditBtn] = useState(false);
  const [showEditCancelBtn, setShowEditCancelBtn] = useState(false);

  const [reactJsPgListSize, setReactJsPgListSize] = useState(0);
  const reactJsPgRef = useRef(null);

  const [treeMgtYn, setTreeMgtYn] = useState('');
  const [treePrintYn, setTreePrintYn] = useState('');

  const [isTreeOpen] = useState(true);
  const [reactJsPgShow, setReactJsPgShow] = useState(false);

  const [formStateStr, setFormStateStr] = useState('i');


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
    getCategoryListTreeList();  // 첫 렌더링 시에 getCategoryListTreeList 호출
  }, []);

  useEffect(() => {
    if (isTreeOpen) {
      requestHeader.page=1;requestHeader.size=10;
      getChildCategoryList(requestHeader, {});
      getParentCategoryList({},{}); // category 리스트를 가져오고 상태를 업데이트
    }
  }, [isTreeOpen]);

  const formState = {
    state : formStateStr, 
    treeSelected : {
      selectedKeys : selectedKeys, 
      selectedInfo : selectedInfo}, 
      rowSelected : {
        rowClickCatSeq : rowClickCatSeq, 
        rowClickCatCd : rowClickCatCd
      }
  };
  
  const requestHeader = {
    page: ''//1
    , size: ''//10
    , searchKey : ''//inputSearchKey
    , searchStr : ''//inputSearchStr
  };

  const selectOptions = [
    {key : 'catNm', value : '카테고리 이름'}
    , {key : 'catCd', value : '카테고리 코드'}
  ];

  const getChildCategoryList = async (requestHeader, requestBody) => {
    console.log("몇번 실행되냐 3");

    let rqHeader = cleanParam(requestHeader);
    let rqBody = cleanParam(requestBody);

    // if(requestBody){//신규추가, 수정 이 두 상태가 한 state에 있어야 하는 관계로, 임시 처리
    //   rqBody = cleanParam(requestBody);
    // }
    
    let response;

    try {
      if (!properties.loadYn){properties.setLoadYn(true);}
      reactJsPgClear();
      response = await axios.post(`${apiBaseUrl}/category/getChildCategoryList`, rqBody, {params:rqHeader});

      let totalCnt = 0;

      if(response.data != null && response.data != ''){
        totalCnt = response.data[0].totalCnt;
        //responseRef.current = response;
        setChildCategoryList(response.data);
        reactJsPgSet({totalCnt:totalCnt, show:true});
        
        //setTriggerUpdate(prev => !prev);
        //setReactJsPgShow(true);
        // if(reactJsPgRef.current){
        //   reactJsPgRef.current.updateListSize(totalCnt);
        // }
      } 
      // setReactJsPgListSize(totalCnt);
        
      // if(reactJsPgRef.current){
      //   reactJsPgRef.current.updateListSize(totalCnt);
      // }

      // setChildCategoryList(response.data);
      
    } catch (error) {
      response = error;
    } finally {
      properties.setLoadYn(false);
      return response;
    }
  };

  const getParentCategoryList = async (requestHeader, requestBody) => {//초기화 이후엔 CUD 시 수정된 항목 반영

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

  const saveCategory = async (requestHeader, requestBody) => {
    if(validation(requestBody)){
      requestBody.chgId = userId;//테스트 때문에

      const rqHeader = cleanParam(requestHeader);
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
        delete rqBody.inId;
        delete requestBody.chgId;
        delete rqBody.chgId;

        //onCancelBtnClick(false);
        cancel(false);
        getCategoryListTreeList();
        getParentCategoryList({},{});
        
        properties.setLoadYn(false);
        return response;
      }
    }
  };

  const deleteCategory = async (requestHeader, requestBody) => {
    if(validation(requestBody)){
      requestBody.chgId = userId;//테스트 때문에
      const rqHeader = cleanParam(requestHeader);
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
        delete requestBody.chgId;
        delete rqBody.chgId;

        cancel(false);
        //onCancelBtnClick(false);
        getCategoryListTreeList();
        getParentCategoryList({},{});

        properties.setLoadYn(false);
        return response;
      }
    }
  };

  const stateClear = function (){
    setCatSeq('');
    setOd('');
    setSelectedKeys([]);
    setSelectedInfo(null);
    setRowClickCatCd('');
    setRowClickCatSeq('');
    setShowCancelBtn(false);
    setShowDelBtn(false);
    setShowEditBtn(false);
    setShowEditCancelBtn(false);
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

  // useEffect(() => {
  //   if (isStateSetUpCntUpdated.current) {
  //     // 상태 업데이트가 완료된 후에만 실행
  //     setTimeout(() => {
  //       getChildCategoryList();
  //       isStateSetUpCntUpdated.current = false;  // 다시 플래그를 초기화
  //     }, 0);  // setTimeout을 사용하여 상태 업데이트 후 실행되도록 처리
  //   }
  // }, [stateSetUpCnt]);

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
    reactJsPgRef.current.updateListSize(0);
    reactJsPgRef.current.updateActivePage();
  }

  const reactJsPgSet = function (state) {
    setReactJsPgListSize(state.totalCnt);
    setReactJsPgShow(true);
    reactJsPgRef.current.updateListSize(state.totalCnt);
  }

  

  const search = function(e){
    //reactJsPgClear();

    // setSelectSearchKey(selectSearchKey); 
    // setInputSearchStr(inputSearchStr); 


    // requestHeader.searchKey = selectSearchKey;
    // requestHeader.searchStr = inputSearchStr;
    // if(reactJsPgRef.current){
    //   reactJsPgRef.current.updateActivePage();
    // }
    getChildCategoryList({...requestHeader, searchKey : selectSearchKey, searchStr : inputSearchStr},{});
  }

  const onClickSearchBtn = function(e){
    //reactJsPgClear();
    search();
  }

  const searchReset = function(e){
    //reactJsPgClear();
    setSelectSearchKey(''); 
    setInputSearchStr(''); 
    // requestHeader.searchKey = '';
    // requestHeader.searchStr = '';
    // if(reactJsPgRef.current){
    //   reactJsPgRef.current.updateActivePage();
    // }
  }

  const onClickSearchResetBtn = function(e){
    searchReset();
    getChildCategoryList();
  }

  const cancel = function (isRow) {
    if(!isRow){
      stateClear();
    }
    searchReset();
    inputClear();
  }

  const onCancelBtnClick = function (isRow) {//맹 수정중
    cancel(isRow);
    //reactJsPgClear();
    getChildCategoryList({},{});

    setShowCancelBtn(false);
    setShowEditBtn(false);
    setShowEditCancelBtn(false);
    setShowDelBtn(false);
  }

  const onEditClick = function(){
    //u 상태
    cancel(true);
    let uParam = {};
    let stateSetParam = {};
    const requestHeader = {
      page: 1
      , size: 10
      , searchKey : ''//inputSearchKey
      , searchStr : ''//inputSearchStr
    };
    uParam = {
      catSeq : selectedInfo.node.catSeq     //사용
      , catNm : selectedInfo.node.title    //사용
      , catCd : selectedKeys[0]    //사용
      , upCatCd : selectedInfo.node.upCatCd  //사용
      , upCatNm : selectedInfo.node.upCatNm  //사용
      , printYn : selectedInfo.node.printYn  //사용
      , mgtYn : selectedInfo.node.mgtYn    //사용
      , od : selectedInfo.node.od       //사용
    }
    stateSetParam = {...uParam, selectedKeys : selectedKeys, selectedInfo : selectedInfo};

    inputSet(uParam);

    setShowCancelBtn(true);
    setShowEditBtn(false);
    setShowEditCancelBtn(true);
    setShowDelBtn(true);
  }

  const editCancel = function(){
    searchReset();
    inputClear();
  }

  const onEditCancelClick = function(){
    
    editCancel();
    let iParam = {};
    let stateSetParam = {};

    if(selectedKeys.length > 0){
      iParam = {
        upCatCd : selectedInfo.node.key  //사용
        , upCatNm : selectedInfo.node.title  //사용
        , printYn : selectedInfo.node.printYn  //사용
        , mgtYn : selectedInfo.node.mgtYn    //사용
      }
      setShowCancelBtn(true);
      setShowEditBtn(true);
      setShowEditCancelBtn(false);
      setShowDelBtn(false);
    } else {
      iParam = {
        upCatCd : ''
        , upCatNm : ''
        , printYn : 'y'
        , mgtYn : 'y'
      }
      setShowCancelBtn(false);
      setShowEditBtn(false);
      setShowEditCancelBtn(false);
      setShowDelBtn(false);
    }

    stateSetParam = {rowClickCatCd : '', rowClickCatSeq : ''};
    stateSet(stateSetParam);
    inputSet({...iParam, ...stateSetParam});
  }

  const inputSearchStrOnKeyUp = function(e){
    if(e.key == 'Enter'){
      //reactJsPgClear();
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
    //i 상태
    //onCancelBtnClick(false);
    cancel(false);
    let iParam = {};
    let uParam = {};
    let stateSetParam = {};
    const requestHeader = {
      page: 1
      , size: 10
      , searchKey : ''//inputSearchKey
      , searchStr : ''//inputSearchStr
    };
    if(selectedKeys.length > 0){
      iParam = {
        upCatCd : selectedKeys[0]
        , upCatNm : selectedInfo.node.title
        , printYn : selectedInfo.node.printYn
        , mgtYn : selectedInfo.node.mgtYn
      }
      uParam = {
        catSeq : selectedInfo.node.catSeq     //사용
        , catNm : selectedInfo.node.title    //사용
        , catCd : selectedKeys[0]    //사용
        , upCatCd : selectedInfo.node.upCatCd  //사용
        , upCatNm : selectedInfo.node.upCatNm  //사용
        // , printYn : selectedInfo.node.printYn  //사용 //조회 이거 영향받음
        // , mgtYn : selectedInfo.node.mgtYn    //사용 //조회 이거 영향받음
        , od : selectedInfo.node.od       //사용
      }
      stateSetParam = {...uParam, selectedKeys : selectedKeys, selectedInfo : selectedInfo};
      stateSet(stateSetParam);
      inputSet(iParam);

      getChildCategoryList(requestHeader, uParam);

      setShowCancelBtn(true);
      setShowEditBtn(true);
      setShowEditCancelBtn(false);
      setShowDelBtn(false);
    } else {
      getChildCategoryList(requestHeader, {});

      setShowCancelBtn(false);
      setShowEditBtn(false);
      setShowEditCancelBtn(false);
      setShowDelBtn(false);
    }

  };

  const onRowClick = function(selectedObj){
    //u 상태
    editCancel();
    let iParam = {};
    let stateSetParam = {};
    const requestHeader = {
      page: 1
      , size: 10
      , searchKey : ''//inputSearchKey
      , searchStr : ''//inputSearchStr
    };

    //공통
    if (rowClickCatSeq != selectedObj.catSeq) {
      
      stateSetParam = {rowClickCatCd : selectedObj.catCd, rowClickCatSeq : selectedObj.catSeq};
      
      setShowCancelBtn(true);
      setShowEditBtn(false);
      setShowEditCancelBtn(true);
      setShowDelBtn(true);

      stateSet(stateSetParam);
      inputSet(selectedObj);
    } else {

      if(selectedKeys.length > 0){
        iParam = {
          upCatCd : selectedKeys[0]
          , upCatNm : selectedInfo.node.title
          , printYn : selectedInfo.node.printYn
          , mgtYn : selectedInfo.node.mgtYn
        }
        setShowCancelBtn(true);
        setShowEditBtn(true);
        setShowEditCancelBtn(false);
        setShowDelBtn(false);
      } else {
        iParam = {
          upCatCd : ''
          , upCatNm : ''
          , printYn : 'y'
          , mgtYn : 'y'
        }
        setShowCancelBtn(false);
        setShowEditBtn(false);
        setShowEditCancelBtn(false);
        setShowDelBtn(false);
      }
      
      stateSetParam = {rowClickCatCd : '', rowClickCatSeq : ''};
      
      stateSet(stateSetParam);
      inputSet({...iParam, ...stateSetParam});
    }
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
                      <BoardButton type="save" color="orange" onClick={saveCategory}/>
                      <BoardButton type="delete" color="white" show={showDelBtn} onClick={deleteCategory}/>
                  </div>
              </div>
              <div className='input_container_box'>
                  {/*<Input type = 'hidden' value={catSeq} onChange={(event)=>{setCatSeq(event.target.value);} } />*/}
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
                    <SearchBox  searchSelectValue={selectSearchKey} searchTextValue={inputSearchStr} searchTextOnChange={(e)=>{setInputSearchStr(e.target.value);}} searchSelectOnChange={(e)=>{setSelectSearchKey(e.target.value);}} searchTextOnKeyUp={(e)=>{inputSearchStrOnKeyUp(e)}} options={selectOptions} search={onClickSearchBtn} reset={onClickSearchResetBtn} disabled={showEditCancelBtn ? true : false} placeholder_str='검색옵션 선택 후 검색어를 입력하세요.'/>
                </div>
                <BoardList type="DtAttach" placeholder_str='검색옵션 선택 후 검색어를 입력하세요.' thead={[{key : 'catCd', value : '카테고리 코드'},{key : 'catNm', value : '카테고리 이름'}]} tbody={ChildCategoryList} onRowClick={onRowClick} selectedId={rowClickCatSeq} />
                <div className='pagenation_box'>
                    <div className='label'>총 카운트 {totalListSize}</div>
                    <div className={reactJsPgShow ? 'pg show' : 'pg hide'}>
                      <ReactJsPg ref={reactJsPgRef} getList={getChildCategoryList} requestHeader={requestHeader} rowClick={onRowClick} editCancelClick={onEditCancelClick} rowClickCatSeq={rowClickCatSeq} selectedKeys={selectedKeys} selectedInfo={selectedInfo}/>
                      {/* getChildCategoryList 이거 콜백 필요 없는지 확인 */}
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
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1,
      listSize : 0,
      pageSize : 10
    };
  }

  updateActivePage = () => {
    this.setState({activePage : 1});
  }

  updateListSize = (newSize) => {
    this.setState({listSize : newSize});
  }
  
  handlePageChange(pageNumber) {
    console.log(`Active page is ${pageNumber}`);
    
    this.setState({ activePage: pageNumber }, () => {
      if (this.props.getList) {

        const updatedHeader = {
          searchKey : this.props.requestHeader.searchKey
          , searchStr : this.props.requestHeader.searchStr
          , page: this.state.activePage  // 새로운 activePage로 업데이트
          , size: this.state.pageSize    // 현재 페이지 크기를 사용
        };
        
        if(this.props.selectedInfo.node.upCatCd){
          let updatedRequestBody = {
            catSeq : this.props.selectedInfo.node.catSeq
            , catCd : this.props.selectedKeys[0]
            , catNm : this.props.selectedInfo.node.title
            , upCatCd : this.props.selectedInfo.node.upCatCd == null ? '' : this.props.selectedInfo.node.upCatCd
            , upCatNm : this.props.selectedInfo.node.upCatNm
            , od : this.props.selectedInfo.node.od
          }
          this.props.getList(updatedHeader, updatedRequestBody);
        } else {
          this.props.getList(updatedHeader);
        }
  
      }
    });
  }
  
  render() {
    return (
      <ReactJsPagination
        activePage={this.state.activePage}//Required
        totalItemsCount={this.state.listSize}//Required
        onChange={this.handlePageChange.bind(this)}//Required
        itemsCountPerPage={this.state.pageSize}
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
