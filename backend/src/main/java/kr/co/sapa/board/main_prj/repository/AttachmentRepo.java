package kr.co.sapa.board.main_prj.repository;

import java.math.BigInteger;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import kr.co.sapa.board.main_prj.entity.Attachment;

@Repository
public interface AttachmentRepo extends JpaRepository<Attachment, BigInteger>, JpaSpecificationExecutor<Attachment> {
    

    @Query(value = """
        with RECURSIVE CategoryHierarchy AS (
            SELECT
                cat_cd,
                cat_nm,
                up_cat_cd,
                up_cat_nm,
                print_yn,
                mgt_yn,
                del_yn
            FROM
                _category
            WHERE
                (:catCd IS NULL OR cat_cd = :catCd)
            UNION ALL
            SELECT
                p.cat_cd,
                p.cat_nm,
                p.up_cat_cd,
                p.up_cat_nm,
                p.print_yn,
                p.mgt_yn,
                p.del_yn
            FROM
                _category p
            INNER JOIN
                CategoryHierarchy ch
            ON
                p.up_cat_cd = ch.cat_cd
        )
        SELECT DISTINCT
            pd._nm
            , pd._desc
            , pa.*
        FROM
            CategoryHierarchy chc
        join
        	_data pd
        on
        	chc.cat_cd = pd.cat_cd 
        join
        	_attachment pa
        on
        	pd._seq = pa._seq 
        WHERE
            CASE 
                WHEN ((chc.del_yn = 'n') AND ((:printYn IS null) OR (chc.print_yn = :printYn)) AND ((:attachSeq IS null) OR (pa.attach_seq = :attachSeq)) AND ((:searchStd IS null) OR (pd.in_dt >= :searchStd)) AND ((:searchEd IS null) OR (pd.in_dt <= :searchEd))) THEN 
                    CASE 
                        WHEN ((:searchKey IS NULL) OR (:searchKey = 'catNm')) AND ((:searchStr IS NULL) OR (chc.cat_nm LIKE CONCAT('%', :searchStr, '%'))) THEN 1
                        WHEN ((:searchKey IS NULL) OR (:searchKey = 'catCd')) AND ((:searchStr IS NULL) OR (chc.cat_cd LIKE CONCAT('%', :searchStr, '%'))) THEN 1
                        WHEN ((:searchKey IS NULL) OR (:searchKey = 'printNm')) AND ((:searchStr IS NULL) OR (pd._nm LIKE CONCAT('%', :searchStr, '%'))) THEN 1
                        WHEN ((:searchKey IS NULL) OR (:searchKey = 'printDesc')) AND ((:searchStr IS NULL) OR (pd._desc LIKE CONCAT('%', :searchStr, '%'))) THEN 1
                        ELSE 0
                    END
                ELSE 0
            END
        ORDER BY
            chc.cat_cd, pa.attach_seq ASC
        LIMIT :size OFFSET :page
        """, nativeQuery = true)
    List<Attachment> findByIdWithChildren(@Param("catCd") String catCd, @Param("searchKey") String searchKey, @Param("searchStr") String searchStr, @Param("page") int page, @Param("size") int size, @Param("searchStd") String searchStd, @Param("searchEd") String searchEd, @Param("printYn") Character printYn, @Param("attachSeq") BigInteger attachSeq);
   
    @Query(value = """
        with RECURSIVE CategoryHierarchy AS (
            SELECT
                cat_cd,
                cat_nm,
                up_cat_cd,
                up_cat_nm,
                print_yn,
                mgt_yn,
                del_yn
            FROM
                _category
            WHERE
                (:catCd IS NULL OR cat_cd = :catCd)
            UNION ALL
            SELECT
                p.cat_cd,
                p.cat_nm,
                p.up_cat_cd,
                p.up_cat_nm,
                p.print_yn,
                p.mgt_yn,
                p.del_yn
            FROM
                _category p
            INNER JOIN
                CategoryHierarchy ch
            ON
                p.up_cat_cd = ch.cat_cd
        )
        SELECT 
            COUNT(DISTINCT pa.attach_seq)
        FROM
            CategoryHierarchy chc
        join
        	_data pd
        on
        	chc.cat_cd = pd.cat_cd 
        join
        	_attachment pa
        on
        	pd._seq = pa._seq 
        WHERE
            CASE 
                WHEN ((chc.del_yn = 'n') AND ((:printYn IS null) OR (chc.print_yn = :printYn)) AND ((:searchStd IS null) OR (pa.in_dt > :searchStd)) AND ((:searchEd IS null) OR (pa.in_dt < :searchEd))) THEN 
                    CASE 
                        WHEN ((:searchKey IS NULL) OR (:searchKey = 'catNm')) AND ((:searchStr IS NULL) OR (chc.cat_nm LIKE CONCAT('%', :searchStr, '%'))) THEN 1
                        WHEN ((:searchKey IS NULL) OR (:searchKey = 'catCd')) AND ((:searchStr IS NULL) OR (chc.cat_cd LIKE CONCAT('%', :searchStr, '%'))) THEN 1
                        WHEN ((:searchKey IS NULL) OR (:searchKey = 'printNm')) AND ((:searchStr IS NULL) OR (pd._nm LIKE CONCAT('%', :searchStr, '%'))) THEN 1
                        WHEN ((:searchKey IS NULL) OR (:searchKey = 'printDesc')) AND ((:searchStr IS NULL) OR (pd._desc LIKE CONCAT('%', :searchStr, '%'))) THEN 1
                        ELSE 0
                    END
                ELSE 0
            END
        ORDER BY
            chc.cat_cd, pa.attach_seq ASC
        """, nativeQuery = true)
    Long findByIdWithChildrenCnt(@Param("catCd") String catCd, @Param("searchKey") String searchKey, @Param("searchStr") String searchStr, @Param("searchStd") String searchStd, @Param("searchEd") String searchEd, @Param("printYn") Character printYn);

}