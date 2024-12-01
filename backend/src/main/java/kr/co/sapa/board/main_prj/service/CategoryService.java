package kr.co.sapa.board.main_prj.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import kr.co.sapa.board.main_prj.dto.BoardCategory;
import kr.co.sapa.board.main_prj.dto.RsTreeDataDto;
import kr.co.sapa.board.main_prj.entity.Attachment;
import kr.co.sapa.board.main_prj.entity.Category;
import kr.co.sapa.board.main_prj.entity.CategoryMgt;
import kr.co.sapa.board.main_prj.entity.Data;
import kr.co.sapa.board.main_prj.entity.DataMgt;
import kr.co.sapa.board.main_prj.repository.AttachmentRepo;
import kr.co.sapa.board.main_prj.repository.CategoryMgtRepo;
import kr.co.sapa.board.main_prj.repository.CategoryRepo;
import kr.co.sapa.board.main_prj.repository.DataMgtRepo;
import kr.co.sapa.board.main_prj.repository.DataRepo;
import kr.co.sapa.board.main_prj.specification.AttachmentSpacification;
import kr.co.sapa.board.main_prj.specification.CategoryMgtSpecification;
import kr.co.sapa.board.main_prj.specification.CategorySpecification;
import kr.co.sapa.board.main_prj.specification.DataMgtSpacification;
import kr.co.sapa.board.main_prj.specification.DataSpecification;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService { 

    private final EntityManager entityManager;
    private final CategoryRepo repo;
    private final CategoryMgtService pcms;
    private final CategoryMgtRepo pcmr;
    private final DataRepo pdr;
    private final AttachmentRepo par;
    private final DataMgtRepo pdmr;
    Logger logger = LoggerFactory.getLogger(CategoryService.class);

    public Page<Category> getAllCategory( int page, int size, String searchStd, String searchEd, Category category ){

        if(page > 0){//자동 1-- pageable 초깃값이 0이므로
            page -= 1;
        }

        CategorySpecification spec = new CategorySpecification(category);
        Pageable pageable = PageRequest.of(page, size, Sort.by("catSeq"));
        Page<Category> resultPage = repo.findAll(spec, pageable);

        return resultPage;
    }

    public List<Category> getAllCategoryList(Category category ){
        CategorySpecification spec = new CategorySpecification(category);
        List<Category> resultPage = repo.findAll(spec);
        
        return resultPage;
    }

    public List<Category> getCategoryList( int page, int size, String searchStd, String searchEd, Category category ){

        if(page > 0){
            page -= 1;
        }

        CategorySpecification spec = new CategorySpecification(category);
        Pageable pageable = PageRequest.of(page, size, Sort.by("catSeq"));
        Page<Category> resultPage = repo.findAll(spec, pageable);

        return resultPage.getContent();
    }

    //@Transactional
    public List<RsTreeDataDto> getCategoryListTree(Category category) {
        
        Integer totalCnt = repo.findByIdWithChildrenCnt(null, category.getMgtYn(), category.getPrintYn(), null,null);
        List<Category> list = repo.findByIdWithChildren(null, category.getMgtYn(), category.getPrintYn(), null, null, 0, totalCnt);
        
        Map<String, RsTreeDataDto> categoryMap = list.stream()
            .collect(Collectors.toMap(Category::getCatCd, this::convertToDto));

        List<RsTreeDataDto> rootNodes = new ArrayList<>();

        for (Category item : list) {
            RsTreeDataDto dto = categoryMap.get(item.getCatCd());
            if (item.getUpCatCd() != null && !item.getUpCatCd().isEmpty()) {
                if (categoryMap.containsKey(item.getUpCatCd())) {
                    RsTreeDataDto parentDto = categoryMap.get(item.getUpCatCd());
                    if (parentDto != null) {
                        parentDto.getChildren().add(dto);
                    }
                }
            } else {
                rootNodes.add(dto);
            }
        }
        
        return rootNodes;
    }

    public List<BoardCategory> getChildCategoryList(int page, int size, String searchKey, String searchStr, Category category ) {

        if(page > 0){
            page -= 1;
        }
        Integer totalCnt = repo.findByIdWithChildrenCnt( category.getCatCd(), null, null, searchKey,  searchStr);
        List<Category> CategoryList = repo.findByIdWithChildren(category.getCatCd(), null, null, searchKey, searchStr, (page * size), size);
        List<BoardCategory> boardCategoryList = new ArrayList<BoardCategory>();


        for(Category item : CategoryList){
            BoardCategory bdto = new BoardCategory(item);
            bdto.setId(bdto.getCatSeq());
            bdto.setTotalCnt(totalCnt);
            boardCategoryList.add(bdto);
        }

        return boardCategoryList;
    }

    public List<Map<String, Object>> getParentCategories(Category category) {

        //List<Category> CategoryList = repo.findByIdWithParents(category.getCatCd());

        Long totalCnt = repo.count();
        List<Category> list = repo.findByIdWithChildren(null, null, null, null, null, 0, Long.valueOf(totalCnt).intValue());

        List<Category> newList = new ArrayList<Category>();
        //for(Category pc : list){if(pc.getUpCatCd() == null){newList.add(pc);}}
        
        for(int i = 0; i < list.size(); i++){
            
            if(list.get(i).getUpCatCd() != null){
                for(int j = 0; j < newList.size(); j++){
                    // if(newList.get(j).getCatCd() == list.get(i).getUpCatCd()){
                    //     list.get(i). 241129 여기까지 함

                    // }
                    
                }


            }else{
                newList.add(list.get(i));

            }
        }

        List<Map<String, Object>> mapList = list.stream()
        .map(item -> {
            Map<String, Object> map = new HashMap<>();
            map.put("key", item.getCatCd());
            map.put("value", item.getCatNm());
            //map.put("level", item.getLevel());  // Integer (null 허용)
            return map;
        })
        .collect(Collectors.toList());

        return mapList;
    }

    public Category insertCategory(Category category){

        if( category.getCatCd() == null || category.getCatCd().isEmpty() ){
            throw new RuntimeException("Requires catCd");//500 front 예외 필

        } else if (findByIdCatCd(Category.builder().catCd(category.getCatCd()).build()) != null){
            
            throw new RuntimeException("(Duplicate CatCd) 이미 존재하는 코드입니다.");//500 front 예외 필

        } else {

            if(category.getUpCatCd() != null){
                Category findUpCatNmCategory = findByIdCatCd(Category.builder().catCd(category.getUpCatCd()).build());
                category.setUpCatNm(findUpCatNmCategory.getCatNm());
            }
            
            return repo.save(category);
        }
    }

    @Transactional
    public Category updateCategory(Category category, boolean deleteYn){

        Optional<Category> optCtEntity = repo.findById(category.getCatSeq());

        Category CtUpCatCdEntity = category.getUpCatCd() != null ? findByIdCatCd(Category.builder().catCd(category.getUpCatCd()).build()) : null;
        //Optional<Category> optCtUpCatCdEntity = repo.findByUpCatCd(category.getUpCatCd());
        
        if(optCtEntity.isPresent()){

            Category ctEntity = optCtEntity.get();
            category.setCatSeq(ctEntity.getCatSeq());
            category.setInDt(ctEntity.getInDt());
            category.setInId(ctEntity.getInId());
            
            String upCatNm = (CtUpCatCdEntity != null && CtUpCatCdEntity.getCatCd() != null) ? CtUpCatCdEntity.getCatCd() : null ;
            category.setUpCatNm(upCatNm); 
            

            //Category findParent = new Category().builder().catCd(ctEntity.getUpCatCd()).build();
            Category catCdCkCategory = findByIdCatCd(Category.builder().catCd(category.getCatCd()).build());
            Category catSeqCkCategory = findByIdCatCd(Category.builder().catSeq(category.getCatSeq()).build());
            if(catCdCkCategory != null && catSeqCkCategory != null && catCdCkCategory.getCatCd() != catSeqCkCategory.getCatCd()){
                //같은 항목 수정하는 거면 넘어가야해서 findByIdCatCd(Category.builder().catSeq(category.getCatSeq()).catCd(category.getCatCd()).build()) == null
                throw new RuntimeException("(Duplicate CatCd) 이미 존재하는 코드입니다.");//500 front 예외 필
            }

            if( category.getCatCd() == null || category.getCatCd().isEmpty() ){
                throw new RuntimeException("Requires catCd");//500 front 예외 필
            }  else if( category.getUpCatCd() != null && category.getCatCd().equals(category.getUpCatCd())){//child 의 부모 매핑 확인
                throw new RuntimeException("코드와 상위 카테고리는 같을 수 없습니다.");//500 front 예외 필
            } 
            // else if ( ctEntity.getUpCatCd() != null &&  ){//상위 카테고리와 catCd가 같은지 확인
            //     throw new RuntimeException("upCatCd does not exist");//500 front 예외 필
            // } 
            else {

                if(category.getUpCatCd() != null){
                    Category findUpCatNmCategory = findByIdCatCd(Category.builder().catCd(category.getUpCatCd()).build());
                    category.setCatNm(findUpCatNmCategory.getCatNm());
                }
    
                int totalCnt = repo.findByIdWithChildrenCnt( ctEntity.getCatCd(), null, null, null,  null);
                
                List<Category> childCategoryList = repo.findByIdWithChildren(ctEntity.getCatCd(), null, null, null, null, 0, totalCnt);
                //category 첫 번째 자식 select
                Map<String, List<Category>> categoryMap = childCategoryList.stream()
                .collect(Collectors.groupingBy(Category::getUpCatCd));
                List<Category> firstChildCategoryList = categoryMap.get(ctEntity.getCatCd());

                CategoryMgt categoryMgt = CategoryMgt.builder().catCd(ctEntity.getCatCd()).build();
                CategoryMgtSpecification pcmSpec = new CategoryMgtSpecification(categoryMgt);
                //int cnt = Long.valueOf(pcmr.count()).intValue();
                //List<CategoryMgt> childCategoryMgtList = pcmr.findByIdWithChildren(ctEntity.getCatCd(), null, null, 0, Long.valueOf(pcmr.count()).intValue(), null, null);
                //mgt 첫 번째 자식 select
                List<CategoryMgt> firstChildCategoryMgtList = pcmr.findAll(pcmSpec);

                Data data = Data.builder().catCd(ctEntity.getCatCd()).build();
                DataSpecification pdSpec = new DataSpecification(data);
                //List<Data> childDataList = pdr.findByIdWithChildren(ctEntity.getCatCd(), null, null, 0, Long.valueOf(pdr.count()).intValue(), null, null);
                //data 첫 번째 자식 select
                List<Data> firstChildDataList = pdr.findAll(pdSpec);

                Attachment attachment = Attachment.builder().catCd(ctEntity.getCatCd()).build();
                AttachmentSpacification paSpec = new AttachmentSpacification(attachment);
                //List<Attachment> childAttachmentList = par.findByIdWithChildren(ctEntity.getCatCd(), null, null, 0, Long.valueOf(par.count()).intValue(), null, null);
                //attachment 첫 번째 자식 select
                List<Attachment> firstChildAttachmentList = par.findAll(paSpec);

                DataMgt dataMgt = DataMgt.builder().catCd(ctEntity.getCatCd()).build();
                DataMgtSpacification pdmSpec = new DataMgtSpacification(dataMgt);
                List<DataMgt> firstChildDataMgtList = pdmr.findAll(pdmSpec);

                if(firstChildCategoryList != null){
                    for(Category item : firstChildCategoryList){
                        if(item.getUpCatCd() != category.getCatCd()){
                            item.setUpCatCd(category.getCatCd());
                        }
                        if(item.getUpCatNm() != category.getCatNm()){
                            item.setUpCatNm(category.getCatNm());
                        }
                        repo.save(item);
                    }
                }

                if(firstChildCategoryMgtList != null){
                    for(CategoryMgt item : firstChildCategoryMgtList){
                        if(item.getCatCd() != category.getCatCd()){
                            item.setCatCd(category.getCatCd());
                        }
                        if(item.getCatNm() != category.getCatNm()){
                            item.setCatNm(category.getCatNm());
                        }
                        pcmr.save(item);
                    }
                }

                if(firstChildDataList != null){
                    for(Data item : firstChildDataList){
                        if(item.getCatCd() != category.getCatCd()){
                            item.setCatCd(category.getCatCd());
                        }
                        if(item.getCatNm() != category.getCatNm()){
                            item.setCatNm(category.getCatNm());
                        }
                        pdr.save(item);
                    }
                }

                if(firstChildAttachmentList != null){
                    for(Attachment item : firstChildAttachmentList){
                        if(item.getCatCd() != category.getCatCd()){
                            item.setCatCd(category.getCatCd());
                        }
                        if(item.getCatNm() != category.getCatNm()){
                            item.setCatNm(category.getCatNm());
                        }
                        par.save(item);
                    }
                }

                if(firstChildDataMgtList != null){
                    for(DataMgt item : firstChildDataMgtList){
                        if(item.getCatCd() != category.getCatCd()){
                            item.setCatCd(category.getCatCd());
                        }
                        if(item.getCatNm() != category.getCatNm()){
                            item.setCatNm(category.getCatNm());
                        }
                        pdmr.save(item);
                    }
                }


                if(childCategoryList != null){
                    for(Category item : childCategoryList){
                        if(category.getMgtYn() != null && category.getMgtYn() != item.getMgtYn()){
                            item.setMgtYn(category.getMgtYn());
                        }
                        if(category.getPrintYn() != null && category.getPrintYn() != item.getPrintYn()){
                            item.setPrintYn(category.getPrintYn());
                        }
                        // if(category.getDelYn() != null && category.getDelYn() != item.getDelYn()){
                        //     .setDelYn(category.getDelYn());
                        // }
                        repo.save(item);
                    }
                }

    
                repo.save(category);//부모 저장
    
                return ctEntity;
            }
        } else {
            throw new RuntimeException("Not a valid catSeq");//500 front 예외 필
        }
    }

    @Transactional
    public Category deleteCategory(Category category){

        Optional<Category> optCtEntity = repo.findById(category.getCatSeq());

        if(optCtEntity.isPresent()){

            Category ctEntity = optCtEntity.get();
            ctEntity.setDelYn('y');
            //Category findParent = new Category().builder().catCd(ctEntity.getUpCatCd()).build();
            
            if( category.getCatCd() == null || category.getCatCd().isEmpty() ){
                throw new RuntimeException("Requires catCd");//500 front 예외 필
            }  else if( ctEntity.getUpCatCd() != null && findByIdCatCd(Category.builder().catCd(ctEntity.getUpCatCd()).build()) == null ){//child 의 부모 매핑 확인
                throw new RuntimeException("upCatCd did not exist");//500 front 예외 필
            } else if ( ctEntity.getUpCatCd() != null && findByIdCatCd(Category.builder().catCd(category.getUpCatCd()).build()) == null ){//child 의 부모 매핑 확인
                throw new RuntimeException("upCatCd does not exist");//500 front 예외 필
            } else {

                List<Category> childCategoryList = repo.findByIdWithChildren(ctEntity.getCatCd(), null, null, null, null, 0, Long.valueOf(repo.count()).intValue());
                
                List<CategoryMgt> childCategoryMgtList = pcmr.findByIdWithChildren(ctEntity.getCatCd(), null, null, 0, Long.valueOf(pcmr.count()).intValue(), null, null);
                
                List<Data> childDataList = pdr.findByIdWithChildren(ctEntity.getCatCd(), null, null, 0, Long.valueOf(pdr.count()).intValue(), null, null);
                
                List<Attachment> childAttachmentList = par.findByIdWithChildren(ctEntity.getCatCd(), null, null, 0, Long.valueOf(par.count()).intValue(), null, null, null, null);
                //2024-09-06 이상함. 쿼리 조회값과 다르게 가져옴.

                List<DataMgt> childDataMgtList = pdmr.findByIdWithChildren(ctEntity.getCatCd(), null, null, 0, Long.valueOf(pdmr.count()).intValue(), null, null);


                if(childCategoryList != null){
                    for(Category item : childCategoryList){
                        if(category.getDelYn() != null && ctEntity.getDelYn() != item.getDelYn()){
                            item.setDelYn('y');
                        }
                        repo.save(item);
                    }
                }

                if(childCategoryMgtList != null){
                    for(CategoryMgt item : childCategoryMgtList){
                        if(category.getDelYn() != null && ctEntity.getDelYn() != item.getDelYn()){
                            item.setDelYn('y');
                            pcmr.save(item);
                        }
                    }
                }

                if(childDataList != null){
                    for(Data item : childDataList){
                        if(category.getDelYn() != null && ctEntity.getDelYn() != item.getDelYn()){
                            item.setDelYn('y');
                            pdr.save(item);
                        }
                    }
                }

                if(childAttachmentList != null){
                    for(Attachment item : childAttachmentList){
                        if(category.getDelYn() != null && ctEntity.getDelYn() != item.getDelYn()){
                            item.setDelYn('y');
                            par.save(item);
                        }
                    }
                }

                if(childDataMgtList != null){
                    for(DataMgt item : childDataMgtList){
                        if(category.getDelYn() != null && ctEntity.getDelYn() != item.getDelYn()){
                            item.setDelYn('y');
                            pdmr.save(item);
                        }
                    }
                }

            }

            return repo.save(ctEntity);
        } 
        else {
            throw new RuntimeException("Not a valid catSeq");//500 front 예외 필
        }
    }

    public Category findByIdCatCd(Category category) {

        Optional<Category> optionalCategory;
        CategorySpecification spec = new CategorySpecification(category);
        optionalCategory = repo.findOne(spec);

        if (optionalCategory.isPresent()) {
            
            return optionalCategory.get();
        } else {
            return null;
        }
    }

    private RsTreeDataDto convertToDto(Category category) {
        RsTreeDataDto rtDto = RsTreeDataDto.builder().key(category.getCatCd()).title(category.getCatNm()).children(new ArrayList<>()).mgtYn(category.getMgtYn()).printYn(category.getPrintYn()).upCatCd(category.getUpCatCd()).upCatNm(category.getUpCatNm()).catSeq(category.getCatSeq()).build();

        return rtDto;
    }

    
}
