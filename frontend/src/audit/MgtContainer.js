import React, {useEffect, useState, useRef} from 'react'; 
import styled from 'styled-components';
import './../assets/css/app.css';
import './../assets/css/mgt_container.css';
import Input from '../board/FormInput';  
import BoardList from '../board/BoardList';
import Select from './../board/FormSelect'
import BoardButton from './../board/BoardButton';
import axios from 'axios';
import ReactJsPagination from "react-js-pagination";
import SearchBox from "./../board/SearchBox";
import Header from './Header';
import CategoryListTree from './CategoryListTree';
import { CategoryContext, useCategoryContext } from '../CategoryContexts';
import { mgtRegex } from './../utils/serviceRegex';
import { MGT_MAX_LENGTH } from './../utils/serviceMaxLength';

function MgtContainer( properties ){
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId') || "anonymous";

    const { cleanParam, CategoryList, CategoryListLoading, CategoryListError } = useCategoryContext();
    const [mgtList, setMgtList] = useState([]);
    
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [selectedInfo, setSelectedInfo] = useState(null);
    const [rowClickMgtSeq, setRowClickMgtSeq] = useState('');

    const [categoryListTreeList, setCategoryListTreeList] = useState([]);

    const [mgtSeq, setMgtSeq] = useState('');
    const [inputCatNm, setInputCatNm] = useState('');
    const [inputCatCd, setInputCatCd] = useState('');
    const [inputMgtNm, setInputMgtNm] = useState('');
    const [selectDataType, setSelectDataType] = useState('');
    const [inputMgtOrderSeq, setInputMgtOrderSeq] = useState('');
    
    const [showDelBtn, setShowDelBtn] = useState(false);
    
    const [reactJsPgListSize, setReactJsPgListSize] = useState(0);
    const reactJsPgRef = useRef(null);

    const [formDisabled, setFormDisabled] = useState(true);
    const [treeMgtYn, setTreeMgtYn] = useState('y');
    const [treePrintYn, setTreePrintYn] = useState('');

    const [isTreeOpen, setIsTreeOpen] = useState(true);
    const [reactJsPgShow, setReactJsPgShow] = useState(false);

    const getCategoryListTreeList = async ( ) => {
      let response;
      try {
        if (!properties.loadYn){properties.setLoadYn(true);}
        response = await axios.post(`${apiBaseUrl}/category/getTree`, {mgtYn:treeMgtYn, printYn:treePrintYn});//, {'content-type' : "application/json"}
        setCategoryListTreeList(response.data);
      } catch (error) {
        response = error;
      } finally {
        properties.setLoadYn(false);
        return response;
      }
    }

    useEffect(() => {
      if(isTreeOpen){
        getCategoryListTreeList();

      }
    },[]);

    if (!isTreeOpen) return null;

    const requestHeader = {
      page: 1
      , size: 10
    };
  
    const requestBody = {
      catNm : inputCatNm
      , catCd : inputCatCd
      , mgtSeq : mgtSeq
      , mgtNm : inputMgtNm
      , dataType : selectDataType
      , mgtOrderSeq : inputMgtOrderSeq
    };

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

    const getMgtList = async (newRequestHeader) => {
      if(newRequestHeader){
        requestHeader.page = newRequestHeader.page ? newRequestHeader.page : requestHeader.page;
        requestHeader.size = newRequestHeader.size ? newRequestHeader.size : requestHeader.size;
      }

      const rqHeader = cleanParam(requestHeader);
      const rqBody = cleanParam(requestBody);
      let response;

      try {
        if (!properties.loadYn){properties.setLoadYn(true);}
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
          setReactJsPgShow(true);
        }
        setReactJsPgListSize(totalCnt);
          
        if(reactJsPgRef.current){
          reactJsPgRef.current.updateListSize(totalCnt);
        }


      } catch (error) {
        response = error;
      } finally {
        properties.setLoadYn(false);
        return response;
      }
    };

    const saveMgt = async ( ) => {
      if(validation(requestBody)){
        requestBody.chgId = userId;
        const rqHeader = cleanParam(requestHeader);
        const rqBody = cleanParam(requestBody);

        let response;
        try {
          if (!properties.loadYn){properties.setLoadYn(true);}
          if(mgtSeq > 0){
            response = (await axios.put(`${apiBaseUrl}/category_mgt/put`, rqBody, {params:rqHeader}));
          } else {
            rqBody.inId = userId;
            response = (await axios.post(`${apiBaseUrl}/category_mgt/post`, rqBody, {params:rqHeader}));
            rqBody.mgtSeq = response.data.mgtSeq;
          }

          //getMgtList({});
          //onRowClick(rqBody);
          
          alert("관리항목 업데이트 완료");
        } catch (error) {
          response = error;
          alert("관리항목 업데이트 실패");
        } finally {
          delete rqBody.inId;
          delete requestBody.chgId;
          delete rqBody.chgId;
          onCancleClick();
          properties.setLoadYn(false);
          return response;
        }
      }
    };
  
    const deleteMgt = async ( ) => {
      if(validation(requestBody)){
        requestBody.chgId = userId;
        const rqHeader = cleanParam(requestHeader);
        const rqBody = cleanParam(requestBody);
    
        let response;
        try {
          if (!properties.loadYn){properties.setLoadYn(true);}
          response = (await axios.put(`${apiBaseUrl}/category_mgt/delete`, rqBody, {params:rqHeader}));
          setMgtSeq('');
          setInputMgtNm('');
          setSelectDataType('');
          setInputMgtOrderSeq('');
          //getMgtList({});

          alert("관리항목 삭제 완료");

        } catch (error) {
          response = error;
          alert("관리항목 삭제 실패");
        } finally {
          delete requestBody.chgId;
          delete rqBody.chgId;
          onCancleClick();
          properties.setLoadYn(false);
          return response;
        }
      }
    };
          
    const stateClear = function(){
            
      setSelectedKeys([]);
      setSelectedInfo(null);
      setRowClickMgtSeq('');
      
      setMgtList([]);
      setShowDelBtn(false);
      
      setReactJsPgListSize(0);
      setReactJsPgShow(false);
          
      if(reactJsPgRef.current){
        reactJsPgRef.current.updateListSize(0);
      }
    }
    
    const inputClear = function(){//우선 전체 초기화라고 가정. 취소 버튼 시 동작만 있음.
      setMgtSeq('');
      setInputMgtNm('');
      setSelectDataType('');
      setInputMgtOrderSeq('');
      requestBody.mgtSeq = '';
      requestBody.mgtNm = '';
      requestBody.dataType = '';
      requestBody.mgtOrderSeq = '';
    }
    
    const inputSet = function (mgt){
      setMgtSeq(mgt.mgtSeq);
      setInputMgtNm(mgt.mgtNm);
      setSelectDataType(mgt.dataType);
      setInputMgtOrderSeq(mgt.mgtOrderSeq);
      requestBody.mgtSeq = mgt.mgtSeq;
      requestBody.mgtNm = mgt.mgtNm;
      requestBody.dataType = mgt.dataType;
      requestBody.mgtOrderSeq = mgt.mgtOrderSeq;
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

    const onTreeSelect = (selectedKeys, info) => {
      setInputCatNm('');
      setInputCatCd('');
      requestBody.catNm = '';
      requestBody.catCd = '';
      inputClear();
      stateClear();
      if(selectedKeys.length > 0){
        setSelectedKeys(selectedKeys);
        setSelectedInfo(info);
        setInputCatNm(info.node.title);
        setInputCatCd(selectedKeys[0]);
        requestBody.catCd = selectedKeys[0];
        requestBody.catNm = info.node.catNm;
        getMgtList();
        setFormDisabled(false);
      } else {
        setFormDisabled(true);
      }
      //페이지네이션 초기화
      if(reactJsPgRef.current){
        reactJsPgRef.current.updateActivePage();
      }
    };
    
    const onRowClick = function(selectedObj){
      if(rowClickMgtSeq == selectedObj.mgtSeq){
        setRowClickMgtSeq('');
        inputClear();
        setShowDelBtn(false);
      } else {
        if(!selectedObj.upCatCd){
          selectedObj.upCatCd = '';
        }
        setRowClickMgtSeq(selectedObj.mgtSeq);
        inputSet(selectedObj);
        setShowDelBtn(true);
      }
    }
    
    const onCancleClick = function(){
      setInputCatNm('');
      setInputCatCd('');
      requestBody.catNm = '';
      requestBody.catCd = '';
      stateClear();
      inputClear();
      setFormDisabled(true);

      //페이지네이션 초기화
      if(reactJsPgRef.current){
        reactJsPgRef.current.updateActivePage();
      }
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
                        <BoardButton type="cancel" color="white" onClick={onCancleClick} disabled={formDisabled}/>
                        <BoardButton type="save" color="orange" onClick={saveMgt} disabled={formDisabled}/>
                        <BoardButton type="delete" color="white" show={showDelBtn} onClick={deleteMgt} disabled={formDisabled}/>
                    </div>
                </div>
                <div className='input_container_box'>
                    <Input type = 'text' value={inputCatNm} onChange={(event)=>{setInputCatNm(event.target.value);}} label_str = '카테고리명' placeholder_str='카테고리명을 입력하세요.' disabled={true}/>
                    <Input type = 'text' value={inputCatCd} onChange={(event)=>{setInputCatCd(event.target.value);}} label_str = '코드' placeholder_str='코드를 입력하세요.' disabled={true}/>
                    <Input type = 'hidden' value={mgtSeq} onChange={(event)=>{setMgtSeq(event.target.value);} } />
                </div>
                <div className='input_container_box'>
                    <Input type = 'text' value={inputMgtNm} onChange={(event)=>{setInputMgtNm(event.target.value);}}  label_str = '관리항목명' placeholder_str='관리항목명을 입력하세요.' disabled={formDisabled}/>
                    <div className="input_container select"><span className='ol_dot'/><label>관리항목형식</label>
                      <Select value={selectDataType} options = {dataTypeSelectOptions} onChange = {(event)=>{event.target.value == null ? setSelectDataType('') : setSelectDataType(event.target.value); }} disabled={formDisabled}/>
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
                    <div className='label'>총 카운트 {reactJsPgListSize}</div>
                    <div className={reactJsPgShow ? 'pg show' : 'pg hide'}>
                      <ReactJsPg ref={reactJsPgRef} getList={getMgtList} requestHeader={requestHeader} requestBody={requestBody}/>
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

    //this.setState({activePage: pageNumber});

    this.setState({ activePage: pageNumber }, () => {
      if (this.props.getList) {
        const updatedHeader = {
          page: this.state.activePage  // 새로운 activePage로 업데이트
          , size: this.state.pageSize    // 현재 페이지 크기를 사용
        };
  
        // getList 호출 시 requestHeader를 함께 전달
        this.props.getList(updatedHeader);
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
          //test중. 리스트 페이지 2개 이상일 시엔 보이는지?
          hideDisabled={false}
          //hideNavigation={true}
      />
    );
  }
}

