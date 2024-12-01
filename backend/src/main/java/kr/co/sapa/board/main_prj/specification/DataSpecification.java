package kr.co.sapa.board.main_prj.specification;


import org.springframework.data.jpa.domain.Specification;


import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import kr.co.sapa.board.main_prj.entity.Data;
import lombok.NoArgsConstructor;

public class DataSpecification implements Specification<Data> {

    private Data Data;

    public DataSpecification(Data Data) {
        this.Data = Data;
    }
    
    @Override
    public Predicate toPredicate (Root<Data> root, CriteriaQuery<?> query, CriteriaBuilder builder) {

        Predicate predicate = builder.conjunction();
 
        if (Data.getCatCd() != null) {
            predicate = builder.and(predicate, builder.equal(root.get("catCd"), Data.getCatCd()));
        } 
        if (Data.getDataSeq() != null) {
            predicate = builder.and(predicate, builder.equal(root.get("DataSeq"), Data.getDataSeq()));
        }
        predicate = builder.and(predicate, builder.equal(root.get("delYn"), 'n'));

        return predicate;
    }
}
