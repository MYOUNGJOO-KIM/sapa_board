import React, {useEffect, useState} from 'react';
import BoardList from '../board/BoardList';
import SearchBox from "../board/SearchBox";
import icon_x_white from './../assets/images/icon_x_white.svg';
import { CategoryContext, useCategoryContext } from '../CategoryContexts';
import axios from 'axios';

function PreviewPopUp (properties) {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    
    const [attachFileList, setAttachFileList] = useState([]);
    const { cleanParam } = useCategoryContext();
    const [ChildCategoryList, setChildCategoryList] = useState([]);
    const [selectSearchKey, setSelectSearchKey] = useState('');//select
    const [inputSearchStr, setInputSearchStr] = useState('');//text
    const [reactJsPgListSize, setReactJsPgListSize] = useState(0);
 
    const getChildCategoryAttachList = async () => {
        const rqHeader = cleanParam(requestHeader);
        let requestBody = {};

        if(rqHeader.catCd){
            requestBody.catCd = rqHeader.catCd;
            delete rqHeader.catCd;
        }

        if(rqHeader.attachSeq){
            requestBody.attachSeq = rqHeader.attachSeq;
            delete rqHeader.attachSeq;                                   
        }
        
        let response;

        try {
            if (!properties.loadYn){properties.setLoadYn(true);}
            response = await axios.post(`${apiBaseUrl}/attachment/getChildCategoryAttachList`, requestBody, {params : rqHeader});
            
            if(response.data != null && response.data != ''){
                setReactJsPgListSize(response.data[0].totalCnt);
            } else {
                alert('관리중인 출력대상 증빙자료가 없습니다.');
            }
            setChildCategoryList(response.data);
            
        } catch (error) {
            response = error;
        } finally {
            properties.setLoadYn(false);
            return response;
        }
    };
    
    useEffect(() => {
        //getAttachFilePathList();
        getChildCategoryAttachList();
    }, []);


    const urlParams = new URLSearchParams(window.location.search);

    const requestHeader = JSON.parse(urlParams.get('requestHeader'));

    const requestBody = {
        attachSeqList : ''
    }

    const selectOptions = [{key : 'catNm', value : '카테고리 이름'}, {key : 'catCd', value : '카테고리 코드'}];

    return(
        
        <div className='pop_up a4 preview_pop_up'  >
            {/* width="706px" height="1000px" a4 사이즈*/}
            <div className="pop_up_child">
                {ChildCategoryList.map((attach, i) => (
                    <div key={i}>
                        <img src={attach.attachFilePath}></img>
                        <p>{attach.attachFilePath}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PreviewPopUp;