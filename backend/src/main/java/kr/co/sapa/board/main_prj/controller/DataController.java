package kr.co.sapa.board.main_prj.controller;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.sapa.board.main_prj.dto.FileUploadDto;
import kr.co.sapa.board.main_prj.entity.Data;
import kr.co.sapa.board.main_prj.entity.DataMgt;
import kr.co.sapa.board.main_prj.service.DataService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequiredArgsConstructor
public class DataController {
    
    private final DataService service;

    @PostMapping("/data/getFileUploadDto")
    public FileUploadDto getFileUploadDto(
        @RequestParam("files") MultipartFile[] files
    ){
        FileUploadDto fileUploadDto = new FileUploadDto();
        fileUploadDto.setFileList(files);
        return service.getFileUploadDto(fileUploadDto);
    }

    
    @PostMapping("/data/getData")
    public Data getData(
        @RequestBody Data Data
    ){
        return service.findByCatCd(Data);
    }
        
    @PostMapping("/data/get")
    public List<Data> getDataList(
        @RequestParam(required = false, defaultValue = "0") int page,
        @RequestParam(required = false, defaultValue = "10") int size,
        @RequestParam(required = false, defaultValue = "") String searchStd,
        @RequestParam(required = false, defaultValue = "") String searchEd,
        @RequestBody Data Data
        ){
        return service.getDataList(page, size, searchStd, searchEd, Data);
    }

    @PutMapping("/data/put")
    public Data putData(
        @RequestBody Data Data
        ){
        return service.updateData(Data);
    }
    
    @PostMapping("/data/post")
    public Data PostData(
        @RequestParam("files") MultipartFile[] files,
        @RequestParam("filePath") String filePath,
        @RequestParam("requestBody") String requestBody,
        @RequestParam("dataMgtList") List<String> dataMgtContentList
    )throws IOException{

        FileUploadDto fileUploadDto = new FileUploadDto();
        fileUploadDto.setFilePath(filePath);
        fileUploadDto.setFileList(files);

        ObjectMapper objectMapper = new ObjectMapper();
        Data Data = objectMapper.readValue(requestBody, Data.class);
            
        List<DataMgt> DataMgtList = dataMgtContentList.stream().map(content -> new DataMgt(content)).collect(Collectors.toList());

        return service.insertData(Data, DataMgtList, fileUploadDto);
    }
    
    @PutMapping("/data/delete")
    public Data DeleteData(@RequestBody Data Data){
        return service.deleteData(Data);
    }
}
