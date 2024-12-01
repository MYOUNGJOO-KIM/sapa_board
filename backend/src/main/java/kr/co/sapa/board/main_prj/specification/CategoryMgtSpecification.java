package kr.co.sapa.board.main_prj.specification;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.fasterxml.jackson.databind.util.ArrayBuilders.BooleanBuilder;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import kr.co.sapa.board.main_prj.entity.Category;
import kr.co.sapa.board.main_prj.entity.CategoryMgt;
import kr.co.sapa.board.main_prj.repository.CategoryRepo;
import lombok.NoArgsConstructor;

public class CategoryMgtSpecification implements Specification<CategoryMgt> {

    private CategoryMgt categoryMgt;

    public CategoryMgtSpecification(CategoryMgt categoryMgt) {
        this.categoryMgt = categoryMgt;
    }
    
    @Override
    public Predicate toPredicate (Root<CategoryMgt> root, CriteriaQuery<?> query, CriteriaBuilder builder) {

        Predicate predicate = builder.conjunction();
 
        if (categoryMgt.getCatCd() != null && !categoryMgt.getCatCd().isEmpty()) {
            predicate = builder.and(predicate, builder.equal(root.get("catCd"), categoryMgt.getCatCd()));
        } 

        //builder.greaterThanOrEqualTo(), builder.lessThanOrEqualTo(), builder.like(), builder.in()

        // else if (criteria.getOperation().equalsIgnoreCase("<")) {
        //     return builder.lessThanOrEqualTo(
        //       root.<String> get(criteria.getKey()), criteria.getValue().toString());
        // } 
        // else if (criteria.getOperation().equalsIgnoreCase(":")) {
        //     if (root.get(criteria.getKey()).getJavaType() == String.class) {
        //         return builder.like(
        //           root.<String>get(criteria.getKey()), "%" + criteria.getValue() + "%");
        //     } else {
        //         return builder.equal(root.get(criteria.getKey()), criteria.getValue());
        //     }
        // }
        predicate = builder.and(predicate, builder.equal(root.get("delYn"), 'n'));
        

        return predicate;
    }

    // public static Specification<CategoryMgt> hasCatCd(String catCd) {
    //     return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("catCd"), catCd);
    // }



    // public static List<Category> findByCategory(Category CategoryEntity){
        

    //     //BooleanBuilder predicate = new BooleanBuilder();

    //     return new List<Category>;

    //     // if(CategoryEntity.getCatNm() != null) {
    //     //     spec = spec.and(testEntitySpecification.likeName(name));
    //     // }
    //     // if(content != null) {
    //     //     spec = spec.and(testEntitySpecification.likeContent(content));
    //     // }
    //     // return testEntityRepository.findAll(spec);
    //     //return 
    // }
}
