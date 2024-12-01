package kr.co.sapa.board.main_prj.entity;

import java.math.BigInteger;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PostLoad;
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
@Table(name = "category")
public class Category { 

    public Category(Category Category){
        this.catSeq = Category.getCatSeq();
        this.catNm = Category.getCatNm();
        this.catCd = Category.getCatCd();
        this.upCatNm = Category.getUpCatNm();
        this.upCatCd = Category.getUpCatCd();
        this.printYn = Category.getPrintYn();
        this.mgtYn = Category.getMgtYn();
        this.delYn = Category.getDelYn();
        this.inDt = Category.getInDt();
        this.inId = Category.getInId();
        this.chgDt = Category.getChgDt();
        this.chgId = Category.getChgId();
    }
    
    @Column(name = "cat_nm")
    String catNm;

    
    @Column(name = "cat_cd")
    String catCd;

    @Column(name = "up_cat_nm")
    String upCatNm;

    @Column(name = "up_cat_cd")
    String upCatCd;

    @Column(name = "print_yn")
    Character printYn;

    @Column(name = "mgt_yn")
    Character mgtYn;

    @Column(name = "del_yn")
    Character delYn = 'n';
    
    @Column(name = "in_dt")
    LocalDateTime inDt;

    @Column(name = "in_id")
    String inId;

    @Column(name = "chg_dt")
    LocalDateTime chgDt;

    @Column(name = "chg_id")
    String chgId;

    @Id
    @Column(name = "cat_seq")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    BigInteger catSeq;

    @Transient
    private Integer level; 

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

    @PostLoad
    private void convertEmptyStringsToNull() {
        if (this.upCatNm != null && this.upCatNm.trim().isEmpty()) {
            this.upCatNm = null;
        }
        if (this.upCatCd != null && this.upCatCd.trim().isEmpty()) {
            this.upCatCd = null;
        }
        if (this.inId != null && this.inId.trim().isEmpty()) {
            this.inId = null;
        }
        if (this.chgId != null && this.chgId.trim().isEmpty()) {
            this.chgId = null;
        }
    }

    
    
}
