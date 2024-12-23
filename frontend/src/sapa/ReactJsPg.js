import React from 'react'; 
import ReactJsPagination from "react-js-pagination";

class ReactJsPg extends React.Component {
  
    // updateActivePage = (newActivePage) => {
    //   this.setState({activePage : newActivePage});
    // }
  
    // updateListSize = (newSize) => {
    //   this.setState({listSize : newSize});
    // }
    
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

  export default ReactJsPg;
