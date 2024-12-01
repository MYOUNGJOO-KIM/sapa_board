package kr.co.sapa.board.main_prj.entity;


import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;
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
import kr.co.sapa.board.main_prj.dto.BoardCategoryMgt;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@lombok.Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "data")
public class Data {

    public Data(Data Data){
        this.dataSeq = Data.getDataSeq();
        this.catNm = Data.getCatNm();
        this.catCd = Data.getCatCd();
        this.dataNm = Data.getDataNm();
        this.dataDesc = Data.getDataDesc();
        this.delYn = Data.getDelYn();
        this.inDt = Data.getInDt();
        this.inId = Data.getInId();
        this.chgDt = Data.getChgDt();
        this.chgId = Data.getChgId();
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "data_seq")
    BigInteger dataSeq;
    
    @Column(name = "cat_nm")
    String catNm;

    @Column(name = "cat_cd")
    String catCd; 

    @Column(name = "data_nm")
    String dataNm;

    @Column(name = "data_desc")
    String dataDesc;

    @Column(name = "del_yn")
    Character delYn = 'n';
    
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
    List<Attachment> attachList;

    @Transient//mapping X
    List<BoardCategoryMgt> mgtList;

    @Transient//mapping X
    BigInteger catSeq;

    @Transient//mapping X
    String ocrTextOutput;


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
