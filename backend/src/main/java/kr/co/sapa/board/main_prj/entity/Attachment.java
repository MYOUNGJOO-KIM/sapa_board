package kr.co.sapa.board.main_prj.entity;


import java.math.BigInteger;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "attachment")
public class Attachment {

    public Attachment(Attachment Attachment){
        this.attachSeq = Attachment.getAttachSeq();
        this.DataSeq = Attachment.getDataSeq();
        this.catNm = Attachment.getCatNm();
        this.catCd = Attachment.getCatCd();
        this.attachFileStream = Attachment.getAttachFileStream();
        this.attachFilePath = Attachment.getAttachFilePath();
        this.delYn = Attachment.getDelYn();
        this.inDt = Attachment.getInDt();
        this.inId = Attachment.getInId();
        this.chgDt = Attachment.getChgDt();
        this.chgId = Attachment.getChgId();
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attach_seq")
    BigInteger attachSeq;

    @Column(name = "data_seq")
    BigInteger DataSeq;

    @Column(name = "cat_nm")
    String catNm;

    @Column(name = "cat_cd")
    String catCd;

    @Column(name = "attach_file_stream")
    String attachFileStream;

    @Column(name = "attach_file_path")
    String attachFilePath;

    @Column(name = "del_yn")
    char delYn = 'n';
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "in_dt")
    LocalDateTime inDt;

    @Column(name = "in_id")
    String inId;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "chg_dt")
    LocalDateTime chgDt;

    @Column(name = "chg_id")
    String chgId;

    @Transient//mapping X
    String dataNm;

    @Transient//mapping X
    String dataDesc;

    @Transient//mapping X
    String fileNm;

    @PrePersist
    protected void onCreate() {
        inDt = LocalDateTime.now();
        chgDt = LocalDateTime.now();
        //inId = "mjk931223in";
    }

    @PreUpdate
    protected void onUpdate() {
        chgDt = LocalDateTime.now();
        //chgId = "mjk931223chg";
    }

}
