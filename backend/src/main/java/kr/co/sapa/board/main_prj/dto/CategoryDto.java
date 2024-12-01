package kr.co.sapa.board.main_prj.dto;

import java.math.BigInteger;
import java.time.LocalDateTime;

import kr.co.sapa.board.main_prj.entity.Category;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class CategoryDto extends Category { 

    Integer level;

    public CategoryDto(Category category, Integer level) {
        super(category);
        this.level = level; // 자식 클래스의 추가 필드 초기화
    }

    // public CategoryDto (String catNm, String catCd, String upCatNm, String upCatCd, Character printYn, Character mgtYn, Character delYn, LocalDateTime inDt, String inId, LocalDateTime chgDt, String chgId, BigInteger catSeq, Integer level){
    //     Category.builder().catCd(catCd).catNm(catNm).catSeq(catSeq).upCatCd(upCatCd).upCatNm(upCatNm).mgtYn(mgtYn).delYn(delYn).chgDt(chgDt).chgId(chgId).inDt(inDt).inId(inId).build();
    //     this.level = level;
    // }
}
