import React, {useEffect, useState, useRef } from 'react'; 
import axios from 'axios';
import { format } from "date-fns";
import { ko } from 'date-fns/locale';
import { useDropzone } from 'react-dropzone';

import { CategoryContext, useCategoryContext } from '../CategoryContexts';
import { dataRegex, dataMgtRegex } from './../utils/serviceRegex';
import { DATA_MAX_LENGTH, DATA_MGT_MAX_LENGTH } from './../utils/serviceMaxLength';
import { datePattern01, datePattern02, datePattern03, datePattern04 } from './../utils/patterns';
import Header from './Header';
import Input from '../board/FormInput';
import Select from './../board/FormSelect'
import BoardButton from './../board/BoardButton';

import CategoryListTree from './CategoryListTree';
import CategoryListModal from './CategoryListModal';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css'; 
import './../assets/css/app.css';
import './../assets/css/form_container.css';
import icon_search from './../assets/images/icon_search.png';



function FormContainer( properties ) {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId') || "anonymous";
    
    const { cleanParam } = useCategoryContext();
    const [categoryListTreeList, setCategoryListTreeList] = useState([]);
    const [prfData, setPrfData] = useState('');
    const treeRef = useRef();

    const [isTreeOpen, setIsTreeOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMgtVisible, setIsMgtVisible] = useState(false);
    const [formDisabled, setFormDisabled] = useState(true);
    const [treeMgtYn, setTreeMgtYn] = useState('');
    
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [selectedInfo, setSelectedInfo] = useState(null);

    const [catSeq, setCatSeq] = useState('');
    const [catCd, setCatCd] = useState('');
    const [inputCatNm, setInputCatNm] = useState('');
    /* 수정 로직 추가 시 const [inputPrfSeq, setInputPrfSeq] = useState(''); */
    const [inputPrfNm, setInputPrfNm] = useState('');
    const [inputPrfDesc, setInputPrfDesc] = useState('');
    const [inputOcrTextOutput, setInputOcrTextOutput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [mgtList, setMgtList] = useState([]);
    const [dynamicInputVal, setDynamicInputVal] = useState({});
    const [dynamicInputValStr, setDynamicInputValStr] = useState({});

    const [selectSearchKey, setSelectSearchKey] = useState('');
    const [inputSearchStr, setInputSearchStr] = useState('');



    const getCategoryListTreeList = async () => {
        let response;
        try {
            if (!properties.loadYn){properties.setLoadYn(true);}
            response = await axios.post(`${apiBaseUrl}/category/getTree`, {mgtYn:treeMgtYn});
            setCategoryListTreeList(response.data);
        } catch (error) {
            //response = error;
        } finally {
            properties.setLoadYn(false);
            //return response;
        }
    }

    useEffect(() => {
        mgtList.map((mgt, i)=>{
            const inputKey = 'input_'+i;
            const inputKeyStr = inputKey+'_str';
            setDynamicInputVal(prevObject => initDynamicInputVal(prevObject, inputKey));
            setDynamicInputValStr(prevObject => initDynamicInputVal(prevObject, inputKeyStr));
        });
    },[mgtList]);

    useEffect(() => {
        if(isTreeOpen){
            getCategoryListTreeList();
        }
    },[]);

    if (!isTreeOpen) return null;

    const requestHeader = {
        searchKey : selectSearchKey
        , searchStr : inputSearchStr
        , fileList : fileList
    };
    
    const requestBody = {
        catSeq : catSeq
        , catNm : inputCatNm
        , catCd : catCd
        /* 수정 로직 추가 시, prfSeq : inputPrfSeq */
        , prfNm : inputPrfNm
        , prfDesc : inputPrfDesc
        , inId : userId
        , chgId : userId
        //, fileList : fileList
        //, mgtList : mgtList
    };
    
    const selectOptions = [
        {key:'', value:'검색옵션 선택'}
        , {key : 'catNm', value : '카테고리 이름'}
        , {key : 'catCd', value : '카테고리 코드'}
    ];

    const getPrfData = async () => {
        const rqParams = cleanParam(requestHeader);
        const rqBody = cleanParam(requestBody);
        
        let response;
        try {
            if (!properties.loadYn){properties.setLoadYn(true);}
            
            response = (await axios.post(`${apiBaseUrl}/data/getData`, rqBody, {params:rqParams}));

            if(response.data != null){
                //setIsMgtVisible(false);
                if(response.data != '' && response.data.mgtList && response.data.mgtList != ''){
                    setIsMgtVisible(true);
                    setMgtList(response.data.mgtList);
                }
            }
        } catch (error) {
            //response = error;
        } finally {
            properties.setLoadYn(false);
        }
    }

    const getFileUploadDto = async (file) => {
        let sttimeout = Math.floor(Date.now() / 1000);
        let endtimeout;

        if(file.length == 0){
            return;
        }
        
        setLoading(true);
        const formData = new FormData();
        formData.append('files', {});
        
        for (let i = 0; i < requestHeader.fileList.length; i++) {
            formData.append('files', requestHeader.fileList[i]);
        }

        const selectedFiles = formData.getAll('files');
        let totalSize = 0;

        for (let i = 1; i < selectedFiles.length; i++) {
            totalSize += selectedFiles[i].size;
        }

        if (totalSize > 10 * 1024 * 1024) { // MAX 10MB
            alert('전체 파일 크기가 10MB를 초과합니다.');
            setLoading(false);
            return;
        } else {
            let response;
            try { 
                if (!properties.loadYn){properties.setLoadYn(true);}
                response = await axios.post(`${apiBaseUrl}/data/getFileUploadDto`, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                });
            } catch (error) {
                
            } finally {
                setLoading(false);
                properties.setLoadYn(false);
                endtimeout = Math.floor(Date.now() / 1000);
                console.log('저장까지 걸린 시간 = '+(endtimeout - sttimeout)+' 초');
                let ocrTxt = response.data.ocrTextOutput ? response.data.ocrTextOutput : '';

                setInputOcrTextOutput(ocrTxt);
            }
        }
        
    }

    const savePrfData = async ( ) => {
        const formData = new FormData();
        let dynamicInputValFormatStrArr = [];

        for(let i = 0; i < mgtList.length; i++){
            const dataType = mgtList[i].dataType;
            let dynamicInputValFormatStr = dynamicInputValStr['input_'+i+'_str'];
            let formatDate;
            if(dynamicInputVal['input_'+i]){
                switch(dataType){
                    case 'yyyyMMddhhmmss' : 
                        formatDate = format(dynamicInputVal['input_'+i], datePattern01);
                        dynamicInputValFormatStr = formatDate;
                        setDynamicInputValStr(prevObject => ({ ...prevObject, ['input_'+i+'_str'] : formatDate}));
                    break;
                    case 'yyyy' :  ;
                        formatDate = format(dynamicInputVal['input_'+i], datePattern02);
                        dynamicInputValFormatStr = formatDate;
                        setDynamicInputValStr(prevObject => ({ ...prevObject, ['input_'+i+'_str'] : formatDate}));
                    break;
                    case 'MM' :  ;
                        formatDate = format(dynamicInputVal['input_'+i], datePattern03);
                        dynamicInputValFormatStr = formatDate;
                        setDynamicInputValStr(prevObject => ({ ...prevObject, ['input_'+i+'_str'] : formatDate}));
                    break;
                
                }
            }
            dynamicInputValFormatStrArr.push(dynamicInputValFormatStr);
        }

        if(validation(requestHeader, requestBody, dynamicInputValFormatStrArr)){
            
            const rqBody = cleanParam(requestBody);
            
            const emptyBlob = new Blob();

            if(fileList.length == 0){
                formData.append('files', emptyBlob, 'empty_file.jpg');
            }

            for (let i = 0; i < fileList.length; i++) {
                formData.append('files', fileList[i]);
            }
            
            formData.append('filePath', '/'+rqBody.catSeq+'/');
            formData.append('requestBody', JSON.stringify(rqBody));
            formData.append('dataMgtList', dynamicInputValFormatStrArr);

            let response;
            try {
                if (!properties.loadYn){properties.setLoadYn(true);}
                /* 수정 로직 추가 시 if(inputPrfSeq > 0){response = (await axios.put(`${apiBaseUrl}/data/put`, rqBody));} else {}*/
                response = await axios.post(`${apiBaseUrl}/data/post`, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                });
                onCancelClick();
                
                alert("카테고리 업데이트 완료");
            } catch (error) {
                alert("카테고리 업데이트 실패");
            } finally {
                properties.setLoadYn(false);
            }
        }
    };
    
    const handleCloseModal = () => {
        searchReset();
        setIsModalOpen(false);
    };

    const stateClear = function(){
        setPrfData('');
        setSelectedKeys([]);
        setSelectedInfo(null);
        setCatSeq('');
        setCatCd('');
        requestBody.catSeq = '';
        requestBody.catCd = '';
    }

    const inputClear = function(){
        setInputCatNm('');
        setInputPrfNm('');
        setInputPrfDesc('');
        setInputOcrTextOutput('');
        setFileList([]);
        setMgtList([]);
        setDynamicInputVal({});
        setDynamicInputValStr({});
        //requestBody.prfSeq = '';
        requestBody.catNm = '';
        requestBody.prfNm = '';
        requestBody.prfDesc = '';
        requestHeader.fileList = [];
        //requestBody.mgtList = [];
    }

    const stateSet = function (selectedObj, selectedInfo){
        if (selectedObj.catCd || selectedObj.catCd == '') {
            setSelectedKeys([selectedObj.catCd]);
            setCatCd(selectedObj.catCd);
            requestBody.catCd = selectedObj.catCd;
        }
        if (selectedInfo) {
            setSelectedInfo(selectedInfo);
        }
        if (selectedObj.catSeq || selectedObj.catSeq == '') {
            setCatSeq(selectedObj.catSeq);
            requestBody.catSeq = selectedObj.catSeq;
        }
    }

    const inputSet = function (category){
        if (category.catNm || category.catNm == '') {
            setInputCatNm(category.catNm);
            requestBody.catNm = category.catNm;
        }
        // setSelectedKeys([selectedObj.catCd]);
        // setSelectedInfo(info);
        //setInputCatNm(selectedObj.catNm);
        //setCatCd(selectedObj.catCd);
        //setCatSeq(selectedObj.catSeq);
        //requestBody.catSeq = selectedObj.catSeq;
        //requestBody.catCd = selectedObj.catCd;
        //requestBody.catNm = selectedObj.catNm;
        // setFormDisabled(false);
        // getPrfData();
    }

    const searchReset = function(e){
        requestHeader.searchKey = '';
        requestHeader.searchStr = '';
        setSelectSearchKey(''); 
        setInputSearchStr('');
    }

    const onTreeSelect = (selectedKeys, info, d,e,f) => {
        onCancelClick();
        if(selectedKeys.length > 0){
            stateSet({catSeq : info.node.catSeq, catCd : info.node.key}, info);
            inputSet({catNm : info.node.title});
            // setSelectedKeys(selectedKeys);
            // setSelectedInfo(info);
            // setInputCatNm(info.node.title);
            // setCatCd(selectedKeys[0]);
            // setCatSeq(info.node.catSeq);
            // requestBody.catSeq = info.node.catSeq;
            // requestBody.catCd = selectedKeys[0];
            // requestBody.catNm = info.node.catNm;
            setFormDisabled(false);
            getPrfData();
        } 
    };

    function onRowClick(selectedObj, info) {
        onCancelClick();
        stateSet(selectedObj, info);
        inputSet(selectedObj);
        setFormDisabled(false);
        getPrfData();
        if(selectedKeys.length > 0){
        }
          
        return handleCloseModal();
    }

    const onCancelClick = function () {
        setIsMgtVisible(false);
        setFormDisabled(true);
        stateClear();
        searchReset();
        inputClear();
    }

    const datepickerOnchange = function (inputKey, date) {
        let inputData = '';
        let DateStr = '';

        if (date instanceof Date) {
            inputData = date;
            DateStr = new Date(date.getTime()-(date.getTimezoneOffset() * 60000)).toISOString();
        } else {
            inputData = date.target.value;
            DateStr = inputData;
        }
        setDynamicInputVal(prevObject => ({ ...prevObject, [inputKey] : inputData}));
        setDynamicInputValStr(prevObject => ({ ...prevObject, [inputKey+'_str'] : DateStr}));
        
    }

    const initDynamicInputVal = function (prevObject, inputKey) {
        return {
            ...prevObject,
            [inputKey]: ''
        };
    };

    const inputSearchStrOnKeyUp = function(e){
        if(e.key == 'Enter'){
            setIsModalOpen(true);
        }
      }

    const validation = function (header, body, dynamicInputValFormatStrArr) {

        if (body.catCd.length > DATA_MAX_LENGTH.catCd) {
            alert('카테고리 코드의 최대 글자 수를 '+ (body.catCd.length - DATA_MAX_LENGTH.catCd)+' 만큼 초과하였습니다. (최대 글자수 : '+DATA_MAX_LENGTH.catCd+' 자)');
            return false;
        }

        if (!dataRegex.catCd.test(body.catCd)) {
            alert('카테고리 코드가 잘못 입력되었습니다.');
            return false;
        }

        if (body.catNm.length > DATA_MAX_LENGTH.catNm) {
            alert('카테고리명의 최대 글자 수를 '+ (body.catNm.length - DATA_MAX_LENGTH.catNm)+' 만큼 초과하였습니다. (최대 글자수 : '+DATA_MAX_LENGTH.catNm+' 자)');
            return false;
        }
    
        if (!dataRegex.catNm.test(body.catNm)) {
            alert('카테고리명이 잘못 입력되었습니다.');
            return false;
        }

        if (body.prfNm.length > DATA_MAX_LENGTH.prfNm) {
            alert('제목의 최대 글자 수를 '+ (body.prfNm.length - DATA_MAX_LENGTH.prfNm)+' 만큼 초과하였습니다. (최대 글자수 : '+DATA_MAX_LENGTH.prfNm+' 자)');
            return false;
        }
    
        if (!dataRegex.prfNm.test(body.prfNm)) {
            alert('제목이 잘못 입력되었습니다.');
            return false;
        }

        if (body.prfDesc.length > DATA_MAX_LENGTH.prfDesc) {
            alert('내용의 최대 글자 수를 '+ (body.prfDesc.length - DATA_MAX_LENGTH.prfDesc)+' 만큼 초과하였습니다. (최대 글자수 : '+DATA_MAX_LENGTH.prfDesc+' 자)');
            return false;
        }
    
        if (!dataRegex.prfDesc.test(body.prfDesc)) {
            alert('내용이 잘못 입력되었습니다.');
            return false;
        }

        if (header.fileList.length > DATA_MAX_LENGTH.fileList) {
            alert('파일 최대 갯수를 '+ (header.fileList.length - DATA_MAX_LENGTH.fileList)+' 만큼 초과하였습니다. (최대 파일 갯수 : '+DATA_MAX_LENGTH.fileList+' 개)');
            return false;
        }
    
        if (!dataRegex.fileList.test(header.fileList.length > 0 ? header.fileList[0] : '')) {
            alert('첨부된 파일이 없습니다.');
            return false;
        }

        for(let i = 0; i < mgtList.length; i++){
            const dataType = mgtList[i].dataType;
            const regex = dataMgtRegex[dataType];

            if (dynamicInputValFormatStrArr[i].length > DATA_MGT_MAX_LENGTH.content) {
                alert('내용의 최대 글자 수를 '+ (dynamicInputValFormatStrArr[i].length - DATA_MGT_MAX_LENGTH.content)+' 만큼 초과하였습니다. (최대 글자수 : '+DATA_MGT_MAX_LENGTH.content+' 자)');
                return false;
            }

            if (!regex.test(dynamicInputValFormatStrArr[i])) {
                alert('관리항목이 잘못 입력되었습니다.');
                return false;
            }
        }
        return true;
    }
    

    const mkElements = function (mgt, i) {
        const inputKey = 'input_'+i;
        switch(mgt.dataType){
            case 'yyyyMMddhhmmss' :  return <div key={i} className='mgt_box datepicker'><div><span className="ol_dot"></span><h3>{mgt.mgtNm}</h3></div><DatePicker label="Basic date picker" className="icon"  selected={dynamicInputVal[inputKey]} onChange={(date) => datepickerOnchange(inputKey, date)} dateFormat="yyyy-MM-dd HH" locale={ko} showTimeInput placeholderText='연월일과 시간을 선택하세요.'/></div>;
            // selected={dynamicInputVal[inputKey]}  onChange={(date) => datepickerOnchange(inputKey, date)} ref={(el) => dynamicInputRefs.current[inputKey] = el}
            case 'yyyy' : return <div key={i} className='mgt_box datepicker'><div><span className="ol_dot"></span><h3>{mgt.mgtNm}</h3></div><DatePicker className="icon" selected={dynamicInputVal[inputKey]} onChange={(date) => datepickerOnchange(inputKey, date)} dateFormat="yyyy" locale={ko} showYearPicker placeholderText='연도를 선택하세요.'/></div>;
            case 'MM' : return <div key={i} className='mgt_box datepicker'><div><span className="ol_dot"></span><h3>{mgt.mgtNm}</h3></div><input type='number' defaultValue=""  selected={dynamicInputVal[inputKey]} onChange={(date) => datepickerOnchange(inputKey, date)} placeholder='월을 입력하세요.' min="1" max="12" step="1"/> 월</div>;
            case 'dd' : return <div key={i} className='mgt_box datepicker'><div><span className="ol_dot"></span><h3>{mgt.mgtNm}</h3></div><input type='number'  selected={dynamicInputVal[inputKey]} onChange={(date) => datepickerOnchange(inputKey, date)} placeholder='일을 입력하세요.' min="1" max="31" step="1"/> 일</div>;
            // case 'hh' : return <div key={i} className='mgt_box datepicker'><div><span className="ol_dot"></span><h3>{mgt.mgtNm}</h3></div><input type='number' placeholder='시간을 입력하세요.' min="1" max="24" step="1"/> 시</div>;
            // case 'date' : return <div key={i} className='mgt_box datepicker'><div><span className="ol_dot"></span><h3>{mgt.mgtNm}</h3></div><DatePicker className="icon" selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="yyyy-MM-dd" locale={ko} placeholderText='연월일을 선택하세요.'/></div>;
            // case 'datetime' : return <div key={i} className='mgt_box datepicker'><div><span className="ol_dot"></span><h3>{mgt.mgtNm}</h3></div><DatePicker className="icon" selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="yyyy-MM-dd HH:mm:ss" locale={ko} showTimeInput placeholderText='연월일과 시간을 선택하세요.'/></div>;
            // case 'dayoftheweek' : return <div key={i} className='mgt_box datepicker'><div><span className="ol_dot"></span><h3>{mgt.mgtNm}</h3></div><input type='text' placeholder='요일을 입력하세요.'/> 요일</div>;
            case 'text' : return <div key={i} className='mgt_box'><div><span className="ol_dot"></span><h3>{mgt.mgtNm}</h3></div><input type='text' selected={dynamicInputVal[inputKey]} onChange={(date) => datepickerOnchange(inputKey, date)} placeholder='텍스트를 입력하세요.'/></div>;
            case 'number' : return <div key={i} className='mgt_box'><div><span className="ol_dot"></span><h3>{mgt.mgtNm}</h3></div><input type='number' selected={dynamicInputVal[inputKey]} onChange={(date) => datepickerOnchange(inputKey, date)} placeholder='숫자를 입력하세요.'/></div>;
            default : return <div key={i} className='mgt_box'><div><span className="ol_dot"></span><h3>{mgt.mgtNm}</h3></div><input type='text'  selected={dynamicInputVal[inputKey]} onChange={(date) => datepickerOnchange(inputKey, date)} placeholder='텍스트를 입력하세요.'/></div>;
        }
    }

    return ( 
        <div className='root_box admin'>
            <div className='form'>
            <Header title='증빙자료 관리'/>
            <div className='contents_box'>
                <div className='content_box category_box'>
                    <div className='content_header'>트리뷰</div> 
                    <CategoryListTree treeRef={treeRef} onClick={onTreeSelect} selectedKeys={selectedKeys} mgtYn={treeMgtYn} treeData={categoryListTreeList}/>
                </div>
                <div className='dnm_content'>
                    <div className='content_box form_box'>
                        <div className='content_header'>
                            <div className='search_box'>
                                <Select options = {selectOptions} placeholder_str='검색옵션 선택 후 검색어를 입력하세요.' onChange={(event)=>{setSelectSearchKey(event.target.value);}} value={selectSearchKey}/>
                                <div className="input_container text">
                                    <input type="text" placeholder='검색옵션 선택 후 검색어를 입력하세요.' onChange={(event)=>{setInputSearchStr(event.target.value);}} onKeyUp={(event)=>{inputSearchStrOnKeyUp(event);}} value={inputSearchStr}></input>
                                    <div className='button_box n2 reset'>
                                        <button className='get' onClick={() => {setIsModalOpen(true);}}><img src={(icon_search)}/>검색</button>
                                        <BoardButton type="reset" onClick={searchReset}/>
                                    </div>
                                </div>

                            </div>
                        </div>
                        
                        <div className='input_container_box'>
                            <Input classNm='title' type = 'text' value={inputCatNm} onChange={(event)=>{setInputCatNm(event.target.value);}} label_str = '카테고리명' placeholder_str='카테고리명을 선택하세요.' disabled={true}/>
                        </div>

                        <div className='form_table'>
                            {/* 수정 로직 추가 시 <Input type = 'hidden' value={inputPrfSeq} onChange={(event)=>{setInputPrfSeq(event.target.value);} } /> */}
                            <div className='row head'>
                                <div className='label_row'>제목</div>
                                <div className='content_row'>
                                    <input type="text" value={inputPrfNm} placeholder='제목을 입력하세요.' disabled={formDisabled} onChange={(event)=>{setInputPrfNm(event.target.value);}}/>
                                </div>
                            </div>
                            <div className='row body'>
                                <div className='label_row'>내용</div>
                                <div className='content_row'>
                                    <textarea type="text" value={inputPrfDesc} placeholder='내용을 입력하세요.' disabled={formDisabled} onChange={(event)=>{setInputPrfDesc(event.target.value);}}></textarea>
                                </div>
                            </div>
                            <div className='row foot'>
                                <div className='label_row'>첨부파일</div>
                                <div className='content_row'>
                                    <MyDropzone fileList={fileList} setFileList={setFileList} rqHeader={requestHeader} onChange={getFileUploadDto} formDisabled={formDisabled}/>
                                </div>
                            </div>
                            <div className='row ocrview'>
                                <div className='label_row'>OCR INPUT RESULT</div>
                                <div className='content_row'>
                                    <textarea type="text" value={inputOcrTextOutput} disabled={true} placeholder={isLoading ? 'OCR 판독중...' : 'OCR TEXT OUTPUT'}></textarea>
                                </div>
                            </div>
                            {isMgtVisible && (
                                <div className='row etc' >
                                    <div className='label_row'>관리항목</div>
                                    <div className='content_row'>
                                        {mgtList.map((mgt, i)=>(
                                            mkElements(mgt, i)
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="foot_btn_box">
                            <span className='description'>여러 장의 PDF 파일 첨부 시, 개별 이미지로 저장됩니다.</span>
                            <BoardButton type="save" color="orange" disabled={formDisabled} onClick={savePrfData}/>
                        </div>
                    </div>
                </div>
            </div>
            <CategoryListModal isOpen={isModalOpen} onClose={handleCloseModal} searchKey={selectSearchKey} searchStr={inputSearchStr} onRowClick={onRowClick} loadYn={properties.loadYn} setLoadYn={properties.setLoadYn}/>
            </div>
        </div>
        
    );

}

export default FormContainer;

const MyDropzone = (props) => {
    const [fileList, setFileList] = useState([]);
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    const {getRootProps, getInputProps, acceptedFiles} = useDropzone({
        accept: {
            "image/jpeg": [".jpeg", ".jpg"],
            "image/png": [".png"],
            "application/pdf": [".pdf"]
        },
        onDrop: (acceptedFiles) => {
            const totalSize = [...fileList, ...acceptedFiles].reduce((total, file) => total + file.size, 0);

            if (totalSize > MAX_FILE_SIZE) {
                alert('전체 파일 크기가 10MB를 초과합니다.');
                return;
            } else {
                const updatedFiles = [...fileList, ...acceptedFiles];
                setFileList(updatedFiles);
                props.setFileList(updatedFiles);
                props.rqHeader.fileList = updatedFiles;
                props.onChange(updatedFiles);
            }
        },
    });

    const removeFile = (fileToRemove, event) => {
        event.stopPropagation();
        const updatedFiles = fileList.filter(file => file.name !== fileToRemove.name);
        setFileList(updatedFiles);
        props.setFileList(updatedFiles);
        props.rqHeader.fileList = updatedFiles;
        props.onChange(updatedFiles);
    };

    const files = props.fileList.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
        <span className='rm_span' onClick={(e) => removeFile(file, e)}>×</span>
      </li>
    ));

    return (
        <section className={props.formDisabled ? 'disabled' : ''}>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>클릭 또는 드래그&드랍으로 업로드 할 수 있습니다(이미지 파일 or PDF 파일)</p>
                <aside>
                    <h4></h4>
                    <ul>{files}</ul>
                </aside>
            </div>
        </section>
    );
}
