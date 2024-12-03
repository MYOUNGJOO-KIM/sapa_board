import React from 'react';
import Board from './Board';
import DtAttachBoard from './DtAttachBoard';



function BoardList ( props ) {

    switch(props.type){

        case 'DtAttach' : 
            return (<div className='board_list'>
                <DtAttachBoard type = {props.type} placeholder_str = {props.placeholder_str} thead={props.thead} tbody={props.tbody} onRowClick = {props.onRowClick} selectedId={props.selectedId}/>
            </div>)

        default : 
            return (<div className='board_list'>
                <Board props = {props}/>
            </div>)
    }
}

export default BoardList;

