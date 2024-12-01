package kr.co.sapa.board.main_prj.dto;

import java.math.BigInteger;

import kr.co.sapa.board.main_prj.entity.Category;
import lombok.Data;

@Data
public class BoardCategory extends Category {
    BigInteger id;
    Integer totalCnt;

    public BoardCategory (Category Category){
        super(Category);
    }
}
