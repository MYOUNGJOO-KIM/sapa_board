function CategoryListTree(props){
  // const {
  //   treeData,
  //   setCategoryListTreeList,
  //   setCategoryListTreeUpdateList,
  //   onClick,
  //   selectedKeys,
  //   mgtYn
  // } = props;

  // const handleDrag = (info) => {
  //   console.log('Drag info:', info); 
  // };

  // // 드래그 후 드롭된 위치에서 트리 구조를 업데이트
  // const handleDrop = (info) => {
  //   const dragNode = info.dragNode; // 드래그한 항목
  //   const dropNode = info.node; // 드롭된 위치의 항목
  //   const dragKey = dragNode.key; // 드래그한 항목의 key
  //   const dropKey = dropNode.key; // 드롭된 위치의 key

  //   // 드래그한 항목의 순서(od)와 부모(upCatCd)를 업데이트하고, 트리 데이터를 갱신
  //   const updatedTreeData = treeData.map(item => {
  //     if (item.key === dragKey) {
  //       item.od = dropNode.od;  // 드래그한 항목의 od 값을 업데이트
  //       item.upCatCd = dropNode.key;  // 드래그한 항목의 부모 카테고리 코드(upCatCd) 업데이트
  //     }

  //     // 자식 항목이 있으면 재귀적으로 처리
  //     if (item.children && item.children.length > 0) {
  //       item.children = handleDropChildren(item.children, dragKey, dropNode);
  //     }

  //     return item;
  //   });

  //   // 변경된 트리 데이터를 부모에게 전달
  //   setCategoryListTreeUpdateList(updatedTreeData);  // 부모 컴포넌트로 업데이트된 트리 데이터 전달
  //   setCategoryListTreeList(updatedTreeData);  // 트리 전체 데이터 상태 업데이트
  // };

  // // 자식 항목이 있는 경우 재귀적으로 드래그 후 처리
  // const handleDropChildren = (children, dragKey, dropNode) => {
  //   return children.map(item => {
  //     if (item.key === dragKey) {
  //       item.od = dropNode.od;  // 자식 항목의 od와 부모를 업데이트
  //       item.upCatCd = dropNode.key;
  //     }

  //     if (item.children && item.children.length > 0) {
  //       item.children = handleDropChildren(item.children, dragKey, dropNode);
  //     }

  //     return item;
  //   });
  // };
  
  return (
    <div className='tree_box'>
      <Tree
        ref={props.treeRef}
        treeData={props.treeData}
        showIcon={true}
        selectable={true}
        draggable={true}
        // onDrag={handleDrag}
        // onDrop={handleDrop}
        //draggable={false}
        onSelect={props.onClick}
        selectedKeys={props.selectedKeys}
        allowDrop={() => true}
        expandAction={"doubleClick"}
      ></Tree>
    </div>
  );
}

export default CategoryListTree;
