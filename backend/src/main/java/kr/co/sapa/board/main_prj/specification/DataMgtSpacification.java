package kr.co.sapa.board.main_prj.specification;


import org.springframework.data.jpa.domain.Specification;


import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import kr.co.sapa.board.main_prj.entity.DataMgt;

public class DataMgtSpacification implements Specification<DataMgt> {

    private DataMgt dataMgt;

    public DataMgtSpacification(DataMgt dataMgt) {
        this.dataMgt = dataMgt;
    }
    
    @Override
    public Predicate toPredicate (Root<DataMgt> root, CriteriaQuery<?> query, CriteriaBuilder builder) {

        Predicate predicate = builder.conjunction();
 
        if (dataMgt.getCatCd() != null || dataMgt.getCatCd().isEmpty()) {
            predicate = builder.and(predicate, builder.equal(root.get("catCd"), dataMgt.getCatCd()));
        } 
        if (dataMgt.getDataSeq() != null ) {
            predicate = builder.and(predicate, builder.equal(root.get("Seq"), dataMgt.getDataSeq()));
        }
        if (dataMgt.getDataMgtSeq() != null ) {
            predicate = builder.and(predicate, builder.equal(root.get("dataMgtSeq"), dataMgt.getDataMgtSeq()));
        }


        return predicate;
    }
}
