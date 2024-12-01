package kr.co.sapa.board.main_prj.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RestController;

import kr.co.sapa.board.main_prj.entity.DataMgt;
import kr.co.sapa.board.main_prj.service.DataMgtService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequiredArgsConstructor
public class DataMgtController {

    private final DataMgtService service;

    @PostMapping("/data_mgt/get")
    public List<DataMgt> getAttachMgtList(DataMgt dataMgt){
        return service.getDataMgtList();
    }
    
    @PutMapping("/data_mgt/put")
    public DataMgt putMgtAttach(DataMgt dataMgt){
        return service.updateMgtAttach(dataMgt);
    }
    
    @PostMapping("/data_mgt/post")
    public DataMgt PostMgtAttach(DataMgt dataMgt){
        return service.updateMgtAttach(dataMgt);
    }
    
    @PutMapping("/data_mgt/delete")
    public void DeleteMgtAttach(DataMgt dataMgt){
        service.deleteMgtAttach(dataMgt);
    }
}
