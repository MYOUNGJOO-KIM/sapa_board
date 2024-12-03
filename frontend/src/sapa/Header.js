
import React from "react";
import styled from 'styled-components';//공용 스타일 컴포넌트

function Header(props){
    return (
        <HeaderBox>
            <Span></Span><P>{props.title}</P>
        </HeaderBox>
    );
}

export default Header;

const HeaderBox = styled.div`
    display:flex;
    align-items: center;
    width:100%;
    height: 2.5rem;
    padding: 0.5rem 1.0rem;
    background: #7d7d7d;
`;

const Span = styled.span`
    display:block;
    width: 0.4rem;
    height: 0.438rem;
    margin: 0 0.5rem 0 0;
    background: #EE8031;
`;

const P=styled.span`
    font-size: 0.8rem;
    margin: 0;
    color: #fff;
    font-weight: 400;
    font-size: 0.9rem;
`;