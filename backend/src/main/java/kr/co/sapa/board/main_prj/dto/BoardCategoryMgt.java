package kr.co.sapa.board.main_prj.dto;

import java.math.BigInteger;

import kr.co.sapa.board.main_prj.entity.CategoryMgt;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BoardCategoryMgt extends CategoryMgt {
    BigInteger id;
    Long totalCnt;

    public BoardCategoryMgt (CategoryMgt CategoryMgt){
        super(CategoryMgt);
    }
}
