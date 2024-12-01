package kr.co.sapa.board.main_prj.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.RestController;

import kr.co.sapa.board.main_prj.dto.BoardCategory;
import kr.co.sapa.board.main_prj.dto.RsTreeDataDto;
import kr.co.sapa.board.main_prj.entity.Category;
import kr.co.sapa.board.main_prj.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService service;

    @PostMapping("/category/getItem")
    public Category getCategory(
        @RequestBody Category Category
        ){
        
        return service.findByIdCatCd(Category);
    }

    @PostMapping("/category/get")
    public List<Category> getCategoryList(
        @RequestParam(required = false, defaultValue = "0") int page,
        @RequestParam(required = false, defaultValue = "10") int size,
        @RequestParam(required = false, defaultValue = "") String searchKey,
        @RequestParam(required = false, defaultValue = "") String searchStr,
        @RequestParam(required = false, defaultValue = "") String searchStd,
        @RequestParam(required = false, defaultValue = "") String searchEd,
        @RequestBody Category Category
        ){
        
        return service.getCategoryList(page, size, searchStd, searchEd, Category);
    }

    @PostMapping("/category/getTree")
    public List<RsTreeDataDto> getCategoryListTree(
        @RequestBody Category Category
        ){

        return service.getCategoryListTree(Category);
    }

    @PostMapping("/category/getChildCategoryList")
    public List<BoardCategory> getChildCategoryList(
        @RequestParam(required = false, defaultValue = "0") int page,
        @RequestParam(required = false, defaultValue = "10") int size,
        @RequestParam(required = false) String searchKey,
        @RequestParam(required = false) String searchStr,
        @RequestBody Category Category
        ){
            
        return service.getChildCategoryList(page, size, searchKey, searchStr, Category);
    }

    @PostMapping("/category/getParentCategoryList")
    public List<Map<String, Object>> getParentCategoryList(
        @RequestBody Category Category
        ){
        
        return service.getParentCategories(Category);
    }
    
    @PutMapping("/category/put")
    public Category putCategory(@RequestBody Category Category){//@RequestParam String id, 

        return service.updateCategory(Category, false);//update after Category
    }

    @PostMapping("/category/post")
    public Category postCategory(
        @RequestBody Category Category){

        return service.insertCategory(Category);
    }
    
    @PutMapping("/category/delete")
    public void deleteCategory(
        @RequestBody Category Category
        ){

        service.deleteCategory(Category);
    }
}
