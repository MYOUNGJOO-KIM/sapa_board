package kr.co.sapa.board.main_prj.specification;


import org.springframework.data.jpa.domain.Specification;


import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import kr.co.sapa.board.main_prj.entity.Attachment;
import kr.co.sapa.board.main_prj.entity.Data;

public class AttachmentSpacification implements Specification<Attachment> {

    private Attachment Attachment;

    public AttachmentSpacification(Attachment Attachment) {
        this.Attachment = Attachment;
    }
    
    @Override
    public Predicate toPredicate (Root<Attachment> root, CriteriaQuery<?> query, CriteriaBuilder builder) {

        Predicate predicate = builder.conjunction();
 
        if (Attachment.getCatCd() != null || Attachment.getCatCd().isEmpty()) {
            predicate = builder.and(predicate, builder.equal(root.get("catCd"), Attachment.getCatCd()));
        } 
        if (Attachment.getDataSeq() != null ) {
            predicate = builder.and(predicate, builder.equal(root.get("dataSeq"), Attachment.getDataSeq()));
        }
        if (Attachment.getAttachSeq() != null ) {
            predicate = builder.and(predicate, builder.equal(root.get("attachSeq"), Attachment.getAttachSeq()));
        }


        return predicate;
    }
}
