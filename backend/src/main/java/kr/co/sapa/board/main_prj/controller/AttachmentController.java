package kr.co.sapa.board.main_prj.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RestController;

import kr.co.sapa.board.main_prj.dto.BoardAttachment;
import kr.co.sapa.board.main_prj.entity.Attachment;
import kr.co.sapa.board.main_prj.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequiredArgsConstructor
public class AttachmentController { 

    private final AttachmentService service;
    
    @PostMapping("/attachment/getChildCategoryAttachList")
    public List<BoardAttachment> getChildCategoryAttachList(
        @RequestParam(required = false, defaultValue = "0") int page,
        @RequestParam(required = false, defaultValue = "10") int size,
        @RequestParam(required = false) String searchKey,
        @RequestParam(required = false) String searchStr,
        @RequestParam(required = false) String searchStd,
        @RequestParam(required = false) String searchEd,
        @RequestParam(required = false) String mgtYn,
        @RequestParam(required = false) Character printYn,
        @RequestBody Attachment Attachment
    ){
        
        return service.getChildCategoryAttachList(page, size, searchKey, searchStr, searchStd, searchEd, printYn, Attachment);
    }
        
    @PostMapping("/attachment/get")
    public List<Attachment> getAttachmentList(
        @RequestParam(required = false, defaultValue = "0") int page,
        @RequestParam(required = false, defaultValue = "10") int size,
        @RequestParam(required = false, defaultValue = "2024-06-15") String searchStd,
        @RequestParam(required = false, defaultValue = "2024-07-22") String searchEd,
        @RequestBody Attachment Attachment
    ){
        return service.getAttachmentList(page, size, searchStd, searchEd, Attachment);
    }

    @PutMapping("/attachment/put")
    public Attachment putAttachment(@RequestBody Attachment Attachment){
        return service.updateAttachment(Attachment);
    }
    
    @PostMapping("/attachment/post")
    public Attachment PostAttachment(@RequestBody Attachment Attachment){
        return service.insertAttachment(Attachment);
    }
    
    @PutMapping("/attachment/delete")
    public Attachment DeleteAttachment(@RequestBody Attachment Attachment){
        return service.deleteAttachment(Attachment);
    }
}
