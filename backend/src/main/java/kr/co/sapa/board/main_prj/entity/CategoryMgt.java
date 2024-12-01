package kr.co.sapa.board.main_prj.entity;


import java.math.BigInteger;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Cacheable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Cacheable(false)
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "category_mgt")
public class CategoryMgt {

    public CategoryMgt (CategoryMgt CategoryMgt){
        this.mgtSeq = CategoryMgt.mgtSeq;
        this.mgtNm = CategoryMgt.mgtNm;
        this.catCd = CategoryMgt.catCd;
        this.catNm = CategoryMgt.catNm;
        this.dataType = CategoryMgt.dataType;
        this.delYn = CategoryMgt.delYn;
        this.inDt = CategoryMgt.inDt;
        this.inId = CategoryMgt.inId;
        this.chgDt = CategoryMgt.chgDt;
        this.chgId = CategoryMgt.chgId;
        this.mgtOrderSeq = CategoryMgt.mgtOrderSeq;
    }

    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mgt_seq")
    BigInteger mgtSeq;

    @Column(name = "cat_nm")
    String catNm;

    
    @Column(name = "cat_cd")
    String catCd;

    @Column(name = "mgt_nm")
    String mgtNm;

    @Column(name = "data_type")
    String dataType;

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

    @Column(name = "mgt_order_seq")
    BigInteger mgtOrderSeq;


    @PrePersist
    protected void onCreate() {
        inDt = LocalDateTime.now();
        chgDt = LocalDateTime.now();
        //inId = "mjk931223in";
    }

    @PreUpdate
    protected void onUpdate() {
        chgDt = LocalDateTime.now();
        //inId = "mjk931223in";
    }

    @PostLoad
    private void convertEmptyStringsToNull() {
        if (this.inId != null && this.inId.trim().isEmpty()) {
            this.inId = null;
        }
        
        if (this.chgId != null && this.chgId.trim().isEmpty()) {
            this.chgId = null;
        }
    }
}
