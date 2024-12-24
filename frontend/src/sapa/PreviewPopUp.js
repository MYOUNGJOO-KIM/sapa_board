// PreviewPopUp.js
//
// VIEW: /dt/sapa/attach/preview, 인쇄 미리보기
// TODO: 현재는 A4 기준으로만 만들어져 있음. 요구사항 변경 시 추가 개발 필요.
// FIXME: 
// HACK: 
// NOTE: 
// REFACTOR:  
// IMPORTANT: 
// INDT: 2024.12.24
// INID: MJK

import React, {useEffect, useState} from 'react';
import { CategoryContext, useCategoryContext } from '../CategoryContexts';
import axios from 'axios';

function PreviewPopUp (properties) {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const urlParams = new URLSearchParams(window.location.search);
    
    const { cleanParam } = useCategoryContext();
    const [ChildCategoryList, setChildCategoryList] = useState([]);
 
    const getChildCategoryAttachList = async () => {
        const requestHeader = JSON.parse(urlParams.get('requestHeader'));
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
                //setReactJsPgListSize(response.data[0].totalCnt);
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
        getChildCategoryAttachList();
    }, []);

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
