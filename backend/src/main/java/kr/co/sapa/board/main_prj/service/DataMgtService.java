package kr.co.sapa.board.main_prj.service;

import java.util.List;
import org.springframework.stereotype.Service;

import kr.co.sapa.board.main_prj.entity.DataMgt;
import kr.co.sapa.board.main_prj.repository.DataMgtRepo;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DataMgtService {

    private final DataMgtRepo repo;

    public List<DataMgt> getDataMgtList(){
        return repo.findAll();
    }

    public DataMgt updateMgtAttach(DataMgt dataMgt){
        
        return repo.save(dataMgt);
    }

    public void deleteMgtAttach(DataMgt dataMgt){
        repo.save(dataMgt);
    }

    
    
}
