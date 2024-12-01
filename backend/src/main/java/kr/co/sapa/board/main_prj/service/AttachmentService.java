package kr.co.sapa.board.main_prj.service;

import java.math.BigInteger;
import java.net.URL;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.sapa.board.main_prj.dto.BoardAttachment;
import kr.co.sapa.board.main_prj.entity.Attachment;
import kr.co.sapa.board.main_prj.entity.Data;
import kr.co.sapa.board.main_prj.repository.AttachmentRepo;
import kr.co.sapa.board.main_prj.repository.DataRepo;
import kr.co.sapa.board.main_prj.specification.AttachmentSpacification;
import kr.co.sapa.board.main_prj.specification.DataSpecification;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttachmentService { 

    private final AttachmentRepo repo;
    private final DataRepo dtrepo;

    public List<Attachment> getAttachmentList(int page, int size, String searchStd, String searchEd, Attachment Attachment){
        
        AttachmentSpacification spec = new AttachmentSpacification(Attachment);

        Pageable pageable = PageRequest.of(page, size, Sort.by("attachSeq"));
        Page<Attachment> resultPage = repo.findAll(spec, pageable);
        
        return resultPage.getContent();
    }



    public List<BoardAttachment> getChildCategoryAttachList(int page, int size, String searchKey, String searchStr, String searchStd, String searchEd, Character printYn, Attachment Attachment) {
        try{
            if(page > 0){
                page -= 1;
            }
            
            List<Attachment> AttachmentList = repo.findByIdWithChildren(Attachment.getCatCd(), searchKey,  searchStr, (page * size),  size, searchStd, searchEd, printYn, Attachment.getAttachSeq());
            Long totalCnt = repo.findByIdWithChildrenCnt( Attachment.getCatCd(), searchKey, searchStr, searchStd, searchEd, printYn);
            
            List<BoardAttachment> BoardAttachmentList = new ArrayList<BoardAttachment>();

            for(Attachment attach : AttachmentList){

                Data Data = new Data();
                Data.setDataSeq(attach.getDataSeq());
                DataSpecification spec = new DataSpecification(Data);
                List<Data> DataList = dtrepo.findAll(spec);

                for(Data data : DataList){
                    data.setDataNm(data.getDataNm());
                    data.setDataDesc(data.getDataDesc());
                }

                URL url = new URL(attach.getAttachFilePath());
                String fileName = Paths.get(url.getPath()).getFileName().toString();
                attach.setFileNm(fileName);
                
                BoardAttachment bpa = new BoardAttachment(attach);
                bpa.setId(attach.getAttachSeq());
                bpa.setTotalCnt(totalCnt);
                bpa.setDataNm(attach.getDataNm());
                bpa.setDataDesc(attach.getDataDesc());
                bpa.setFileNm(attach.getFileNm());
                BoardAttachmentList.add(bpa);
            }
            return BoardAttachmentList;
        }catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Attachment insertAttachment(Attachment Attachment){
        if( Attachment.getDataSeq() == null ){
                throw new RuntimeException("Requires getDataSeq");//500
            
            } else {
                return repo.save(Attachment);
         }
    }

    @Transactional
    public Attachment updateAttachment(Attachment Attachment){

        Attachment AttachEntity = findById(Attachment.getAttachSeq());

        AttachEntity.setCatCd(Attachment.getCatCd());
        AttachEntity.setCatNm(Attachment.getCatNm());
        AttachEntity.setAttachFilePath(Attachment.getAttachFilePath());
        AttachEntity.setAttachFileStream(Attachment.getAttachFileStream());
        
        return repo.save(AttachEntity);
        
    }

    @Transactional
    public Attachment deleteAttachment(Attachment Attachment){

        Attachment AttachEntity = findById(Attachment.getAttachSeq());

        AttachEntity.setDelYn(Attachment.getDelYn());
        return repo.save(AttachEntity);
    }

    public Attachment findById(BigInteger attachSeq) {
        
        Optional<Attachment> optionalCategory = repo.findById(attachSeq);
        
        if (optionalCategory.isPresent()) {
            return optionalCategory.get();
        } else {
            throw new RuntimeException("Requires an existing id(attachSeq)");
        }
    }

    
    
}
