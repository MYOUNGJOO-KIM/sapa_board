package kr.co.sapa.board.main_prj.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.sapa.board.main_prj.dto.BoardCategoryMgt;
import kr.co.sapa.board.main_prj.dto.FileUploadDto;
import kr.co.sapa.board.main_prj.entity.Attachment;
import kr.co.sapa.board.main_prj.entity.CategoryMgt;
import kr.co.sapa.board.main_prj.entity.Data;
import kr.co.sapa.board.main_prj.entity.DataMgt;
import kr.co.sapa.board.main_prj.repository.DataRepo;
import kr.co.sapa.board.main_prj.specification.DataSpecification;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DataService {

    private final DataRepo repo;
    private final FileService fileService;
    private final AttachmentService attachService;
    private final DataMgtService dataMgtService;
    private final CategoryMgtService mgtService;
    

    Logger logger = LoggerFactory.getLogger(DataService.class);

    public FileUploadDto getFileUploadDto(FileUploadDto fileUploadDto){ 
        
        return fileService.getFileUploadDto(fileUploadDto);
        
    }


    public List<Data> getDataList(int page, int size, String searchStd, String searchEd, Data Data){

        DataSpecification spec = new DataSpecification(Data);
        return repo.findAll(spec, Sort.by("dataSeq"));
    }

    @Transactional
    public Data insertData(Data Data, List<DataMgt> DataMgtList, FileUploadDto fileUploadDto){

        if( Data.getCatCd() == null || Data.getCatCd().isEmpty() ){
            throw new RuntimeException("Requires catCd");//500
        } else {
            Data data = repo.save(Data);
            logger.info(String.valueOf(data.getDataSeq()));
            if(!fileUploadDto.getFileList()[0].getOriginalFilename().equals("empty_file.jpg")){

                FileUploadDto dto = fileService.saveFiles(fileUploadDto);
                
                //data = repo.save(Data.set);//update한 URL로 변경
                for(String fileDownloadUri : dto.getFileDownloadUriList()){
                    attachService.insertAttachment(Attachment.builder().DataSeq(data.getDataSeq()).catNm(Data.getCatNm()).catCd(Data.getCatCd()).attachFilePath(fileDownloadUri).inId(Data.getInId()).chgId(Data.getChgId()).delYn('n').build());
                }
            }

            for(DataMgt DataMgt : DataMgtList){
                DataMgt.setDataSeq(data.getDataSeq());
                DataMgt.setCatCd(data.getCatCd());
                DataMgt.setCatNm(data.getCatNm());
                DataMgt.setInId(data.getInId());
                DataMgt.setChgId(data.getChgId());
                dataMgtService.updateMgtAttach(DataMgt);
            }

            return data;
        }
    }

    @Transactional
    public Data updateData(Data Data){//사용 X

        Data DataEntity = findByIdCatCd(Data);

        if (DataEntity == null) {
            throw new RuntimeException("Requires an existing id(DataSeq or catCd)");
        }

        DataEntity.setCatCd(Data.getCatCd());
        DataEntity.setCatNm(Data.getCatNm());
        DataEntity.setDataNm(Data.getDataNm());
        DataEntity.setDataDesc(Data.getDataDesc());
        
        return repo.save(DataEntity);
    }

    @Transactional
    public Data deleteData(Data Data){//사용 X
        //todoLIst
        //이거 삭제하면 다른 증빙자료 전부 삭제
        //mgt 내역 저장한 테이블에 연계된 것도 삭제
        Data DataEntity = findByIdCatCd(Data);

        if (DataEntity == null) {
            throw new RuntimeException("Requires an existing id(DataSeq or catCd)");
        }

        DataEntity.setDelYn('y');
        return repo.save(DataEntity);
    }

    public Data findByIdCatCd(Data Data) {

        Optional<Data> optionalCategory;
        DataSpecification spec = new DataSpecification(Data);
        optionalCategory = repo.findOne(spec);

        if (optionalCategory.isPresent()) {
            //optionalCategory.get().getDataSeq();
            //Attachment.builder().DataSeq(optionalCategory.get().getDataSeq()).catCd(optionalCategory.get().getCatCd()).build();
            List<Attachment> attachList = attachService.getAttachmentList(0,10,null,null,Attachment.builder().DataSeq(optionalCategory.get().getDataSeq()).catCd(optionalCategory.get().getCatCd()).build());
            List<BoardCategoryMgt> mgtList = mgtService.getCategoryMgtList(0, 10, null, null, null, null, CategoryMgt.builder().catCd(optionalCategory.get().getCatCd()).build());
            optionalCategory.get().setAttachList(attachList);
            optionalCategory.get().setMgtList(mgtList);
            return optionalCategory.get();
        } else {
            return null;
        }
        // if (optionalCategory.isPresent()) {
        //     return optionalCategory.get();
        // } else {
        //     throw new RuntimeException("Requires an existing id(DataSeq or catCd)");
        // }
    }

    public Data findByCatCd(Data Data) {

        Data.setMgtList(mgtService.getCategoryMgtList(0, 100, null, null, null, null, CategoryMgt.builder().catCd(Data.getCatCd()).build()));
        //List<BoardCategoryMgt> mgtList = mgtService.getCategoryMgtList(0, , null, null, null, null, CategoryMgt.builder().catCd(optionalCategory.get(0).getCatCd()).build());

        //아직 get해서 보여주는 로직은 없기 때문에, mgtList 만 가져오기.
        //보여주는 로직 필요해지면 밑에 로직 활성화 하고 수정하기.
        return Data;
        // List<Data> optionalCategory;
        // DataSpecification spec = new DataSpecification(Data);
        // optionalCategory = repo.findAll(spec);
        
        // if (optionalCategory != null && optionalCategory.size() > 0) {
        //     List<Attachment> attachList = attachService.getAttachmentList(0,10,null,null,Attachment.builder().DataSeq(optionalCategory.get(0).getDataSeq()).catCd(optionalCategory.get(0).getCatCd()).build());
        //     List<BoardCategoryMgt> mgtList = mgtService.getCategoryMgtList(0, 10, null, null, null, null, CategoryMgt.builder().catCd(optionalCategory.get(0).getCatCd()).build());
        //     //optionalCategory.get().getDataSeq();
        //     //Attachment.builder().DataSeq(optionalCategory.get().getDataSeq()).catCd(optionalCategory.get().getCatCd()).build();
        //     optionalCategory.get(0).setAttachList(attachList);//아직은 리스트처리가 없으므로 잠시 대기
        //     optionalCategory.get(0).setMgtList(mgtList);//아직은 리스트처리가 없으므로 잠시 대기
        //     return optionalCategory.get(0);
        // } else {
        //     return null;
        // }

    }
    
}
