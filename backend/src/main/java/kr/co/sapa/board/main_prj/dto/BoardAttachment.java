package kr.co.sapa.board.main_prj.dto;

import java.math.BigInteger;

import kr.co.sapa.board.main_prj.entity.Attachment;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class BoardAttachment extends Attachment {
    BigInteger id;
    Long totalCnt;

    public BoardAttachment (Attachment Attachment){
        super(Attachment);
    }
}
