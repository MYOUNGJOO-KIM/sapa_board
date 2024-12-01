package kr.co.sapa.board.main_prj.controller;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.sapa.board.main_prj.dto.FileUploadDto;
import kr.co.sapa.board.main_prj.entity.Data;
import kr.co.sapa.board.main_prj.ocr.NaverClovaOCR;
import kr.co.sapa.board.main_prj.service.DataService;
import kr.co.sapa.board.main_prj.service.FileService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@RestController
@RequiredArgsConstructor
public class FileController {

    private final DataService service;
    private final FileService fileService;
    //private final NaverClovaOCR naverClovaOCR;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @GetMapping("file/{folderName}/{fileName:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String folderName, @PathVariable String fileName) {

        Path file = Paths.get(uploadDir).resolve(folderName).resolve(fileName);
        
        
        if (!Files.exists(file)) {
            return ResponseEntity.notFound().build();
        }

        try {
            Resource resource = new UrlResource(file.toUri());

            String contentType = Files.probeContentType(file);
            String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8.toString())
                    .replaceAll("\\+", "%20"); // 공백을 %20으로 변환
            
            return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                //.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"") // 파일을 다운로드하도록 설정
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFileName)
                .body(resource);
        } catch (MalformedURLException e) {
            // Log error and return internal server error response
            e.printStackTrace(); // Logging the exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(
                
            );
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/files/getData")//Not use
    public Data getData(
        @RequestBody Data data
    ){
        return service.findByIdCatCd(data);
    }

    @PostMapping("/files/get")
    public List<Data> getDataList(//Not use
        @RequestParam(required = false, defaultValue = "0") int page,
        @RequestParam(required = false, defaultValue = "10") int size,
        @RequestParam(required = false, defaultValue = "") String searchStd,
        @RequestParam(required = false, defaultValue = "") String searchEd,
        @RequestBody Data data
        ){
        return service.getDataList(page, size, searchStd, searchEd, data);
    }
    
    @PutMapping("/files/put")//Not use
    public Data putData(
        @RequestBody Data data
        ){
        return service.updateData(data);
    }
    
    @PostMapping("/files/post")
    public FileUploadDto PostData(
        @RequestParam("files") MultipartFile[] files
    ){
        FileUploadDto fileUploadDto = new FileUploadDto();
        fileUploadDto.setFileList(files);
        //FileUploadDto fileUploadDto = FileUploadDto.builder().fileList(files).build();
        //fileService.saveFiles(fileUploadDto);
        //return naverClovaOCR.getNaverOcr(fileUploadDto);
        return fileService.saveFiles(fileUploadDto);
    }
    
    @PutMapping("/files/delete")//Not use
    public Data DeleteData(@RequestBody Data data){
        return service.deleteData(data);
    }
}
