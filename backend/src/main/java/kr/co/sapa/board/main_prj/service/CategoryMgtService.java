package kr.co.sapa.board.main_prj.service;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.sapa.board.main_prj.dto.BoardCategoryMgt;
import kr.co.sapa.board.main_prj.entity.CategoryMgt;
import kr.co.sapa.board.main_prj.repository.CategoryMgtRepo;
import kr.co.sapa.board.main_prj.specification.CategoryMgtSpecification;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryMgtService {

    private final CategoryMgtRepo repo;

    public List<BoardCategoryMgt> getCategoryMgtList(int page, int size, String searchKey, String searchStr, String searchStd, String searchEd, CategoryMgt categoryMgt){

        if(page > 0){
            page -= 1;
        }

        CategoryMgtSpecification spec = new CategoryMgtSpecification(categoryMgt);

        Pageable pageable = PageRequest.of(page, size, Sort.by("mgtOrderSeq"));
        //List<CategoryMgt> CategoryMgtList = repo.findByIdWithChildren(CategoryMgt.getCatCd(), searchKey, searchStr, page, size, searchStd, searchEd);
        Page<CategoryMgt> categoryMgtList = repo.findAll(spec, pageable);
        Long totalCnt = repo.count(spec);

        List<BoardCategoryMgt> boardCategoryMgtList = new ArrayList<BoardCategoryMgt>();
        for(CategoryMgt entity : categoryMgtList){
            BoardCategoryMgt bdto = new BoardCategoryMgt(entity);
            bdto.setId(bdto.getMgtSeq());
            bdto.setTotalCnt(totalCnt);
            boardCategoryMgtList.add(bdto);
        }

        return boardCategoryMgtList;
    }

    public CategoryMgt insertCategoryMgt(CategoryMgt categoryMgt){

        if( categoryMgt.getCatCd() == null || categoryMgt.getCatCd().isEmpty() ){
            throw new RuntimeException("Requires catCd");//500

        } else {
            return repo.save(categoryMgt);
        }
    }

    public CategoryMgt updateCategoryMgt(CategoryMgt categoryMgt){

        CategoryMgt CtMgtEntity = findById(categoryMgt.getMgtSeq());

        if( categoryMgt.getCatCd() == null || categoryMgt.getCatCd().isEmpty() ) {
            throw new RuntimeException("Requires an existing id(catCd)");

        } 

        CtMgtEntity.setCatCd(categoryMgt.getCatCd());
        CtMgtEntity.setCatNm(categoryMgt.getCatNm());
        CtMgtEntity.setMgtNm(categoryMgt.getMgtNm());
        CtMgtEntity.setDataType(categoryMgt.getDataType());
        CtMgtEntity.setMgtOrderSeq(categoryMgt.getMgtOrderSeq());
        CtMgtEntity.setChgId(categoryMgt.getChgId());
        
        return repo.save(CtMgtEntity);
        
        
    }

    @Transactional
    public CategoryMgt deleteCategoryMgt(CategoryMgt categoryMgt){
        //ToDoList
        //이거 삭제하면 딸려있는 증빙자료들도 전부 삭제
        CategoryMgt CtMgtEntity = findById(categoryMgt.getMgtSeq());
        CtMgtEntity.setDelYn('y');
        CtMgtEntity.setChgId(categoryMgt.getChgId());

        return repo.save(CtMgtEntity);
    }


    public boolean existsById(BigInteger mgtSeq) {
        return repo.findById(mgtSeq).isPresent();
    }

    public CategoryMgt findById(BigInteger mgtSeq) {
        
        Optional<CategoryMgt> optionalCategory = repo.findById(mgtSeq);
        
        if (optionalCategory.isPresent()) {
            return optionalCategory.get();
        } else {
            throw new RuntimeException("Requires an existing id(mgtSeq)");
        }
    }
}
