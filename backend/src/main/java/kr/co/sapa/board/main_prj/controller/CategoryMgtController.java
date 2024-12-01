package kr.co.sapa.board.main_prj.controller;

import java.util.List;
import org.springframework.web.bind.annotation.RestController;

import kr.co.sapa.board.main_prj.dto.BoardCategoryMgt;
import kr.co.sapa.board.main_prj.entity.CategoryMgt;
import kr.co.sapa.board.main_prj.service.CategoryMgtService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequiredArgsConstructor
public class CategoryMgtController {

    private final CategoryMgtService service;

    @PostMapping("/category_mgt/get")
    public List<BoardCategoryMgt> getCategoryMgtList(
        @RequestParam(required = false, defaultValue = "0") int page,
        @RequestParam(required = false, defaultValue = "10") int size,
        @RequestParam(required = false) String searchKey,
        @RequestParam(required = false) String searchStr,
        @RequestParam(required = false) String searchStd,
        @RequestParam(required = false) String searchEd,
        @RequestBody CategoryMgt CategoryMgt
        ){
        
        return service.getCategoryMgtList(page, size, searchKey, searchStr, searchStd, searchEd, CategoryMgt);
    }
    
    @PutMapping("/category_mgt/put")
    public CategoryMgt putCategoryMgt(@RequestBody CategoryMgt CategoryMgt){
        return service.updateCategoryMgt(CategoryMgt);
    }
    
    @PostMapping("/category_mgt/post")
    public CategoryMgt postCategoryMgt(@RequestBody CategoryMgt CategoryMgt){
        return service.insertCategoryMgt(CategoryMgt);
    }
    
    @PutMapping("/category_mgt/delete")
    public void deleteCategoryMgt(@RequestBody CategoryMgt CategoryMgt){
        service.deleteCategoryMgt(CategoryMgt);
    }
}
