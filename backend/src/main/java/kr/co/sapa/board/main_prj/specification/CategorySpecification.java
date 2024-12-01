package kr.co.sapa.board.main_prj.specification;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.fasterxml.jackson.databind.util.ArrayBuilders.BooleanBuilder;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import kr.co.sapa.board.main_prj.entity.Category;
import kr.co.sapa.board.main_prj.entity.CategoryMgt;
import kr.co.sapa.board.main_prj.repository.CategoryRepo;

public class CategorySpecification implements Specification<Category> {

    private Category category;

    public CategorySpecification(Category category) {
        this.category = category;
    }
    
    @Override
    public Predicate toPredicate (Root<Category> root, CriteriaQuery<?> query, CriteriaBuilder builder) {

        Predicate predicate = builder.conjunction();
 
        if (category.getCatSeq() != null ) {//|| category.getCatCd().isEmpty()
            predicate = builder.and(predicate, builder.equal(root.get("catSeq"), category.getCatSeq()));
        } 
        if (category.getCatCd() != null ) {//|| category.getCatCd().isEmpty()
            predicate = builder.and(predicate, builder.equal(root.get("catCd"), category.getCatCd()));
        } 
        // if (category.getCatNm() != null ) {
        //     predicate = builder.and(predicate, builder.equal(root.get("catNm"), category.getCatNm()));
        // }
        if (category.getUpCatCd() != null ) {
            predicate = builder.and(predicate, builder.equal(root.get("upCatCd"), category.getUpCatCd()));
        }
        if (category.getMgtYn() != null ) {
            predicate = builder.and(predicate, builder.equal(root.get("mgtYn"), category.getMgtYn()));
        }

        // if(category.getSearchStr() != null){
        //     predicate = builder.like(root.get("searchStr"), "%" + category.getSearchStr() + "%");
        // }
        // if (category.getUpCatNm() != null ) {
        //     predicate = builder.and(predicate, builder.equal(root.get("upCatNm"), category.getUpCatNm()));
        // }
        
        predicate = builder.and(predicate, builder.equal(root.get("delYn"), 'n'));
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

        return predicate;
    }


    public static Specification<Category> withCatCd (String catCd){
        return (Root<Category> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            Predicate predicate = cb.conjunction();
            // LEFT JOIN
            Join<Category, Category> childrenJoin = root.join("children", JoinType.LEFT);
            //query.select(root).distinct(true);
            // SELECT with FETCH 오류남
            //query.distinct(true).select(root).where(cb.equal(root.get("catCd"), catCd));
            if(catCd != null && !catCd.isEmpty()){

                predicate = cb.and(predicate, cb.equal(root.get("catCd"), catCd));
                //query.where(cb.equal(root.get("catCd"), catCd));
            }
            // Add condition to exclude the initial catCd from the result
            Predicate excludeCatCdPredicate = cb.notEqual(root.get("catCd"), catCd);
            // ORDER BY
            // Apply filters
            query.where(predicate, excludeCatCdPredicate);

            // Order results by catCd in ascending order
            query.orderBy(cb.asc(root.get("catCd")));
            
            return query.getRestriction();
        };
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
