package kr.co.sapa.board.main_prj.ocr;

import java.io.File;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import kr.co.sapa.board.main_prj.dto.FileUploadDto;
import kr.co.sapa.board.main_prj.entity.Data;
import kr.co.sapa.board.main_prj.service.CategoryService;

@Component
public class NaverClovaOCR {//테스트 실패

    @Value("${clova_api}")
    private String CLOVA_API_URL;

    @Value("${SECRET_KEY}")
    private String SECRET_KEY;

    Logger logger = LoggerFactory.getLogger(NaverClovaOCR.class);

    // @PostMapping("/files/naver_ocr")//Not use
    public ResponseEntity<Object> getNaverOcr( FileUploadDto fileUploadDto ){

        try {
            MultipartFile[] fileList = fileUploadDto.getFileList();

            if(fileList.length > 0){

                for(int i = 0; i < fileList.length; i++){
                //MultipartFile file : fileUploadDto.getFileList()
                // 이미지 파일 경로
                //File file = new File("path/to/your/image.jpg");
                
                
    
                // HttpClient 객체 생성
                HttpClient client = HttpClient.newHttpClient();
    
                // Multipart/Form-Data 요청 생성
                String boundary = "----boundary";
                String lineEnd = "\r\n";
                String twoHyphens = "--";
                
                // Multipart/Form-Data 본문 생성
                StringBuilder requestBody = new StringBuilder();
                requestBody.append(twoHyphens).append(boundary).append(lineEnd);//create multipart/form-data
                requestBody.append("Content-Disposition: form-data; name=\"file\"; filename=\"")
                           .append(fileList[i].getOriginalFilename()).append("\"").append(lineEnd);
                requestBody.append("Content-Type: ").append(fileList[i].getContentType()).append(lineEnd);
                requestBody.append(lineEnd);
                requestBody.append(new String(fileList[i].getBytes())).append(lineEnd);
                requestBody.append(twoHyphens).append(boundary).append(twoHyphens).append(lineEnd);
                // requestBody.append(twoHyphens).append(boundary).append(lineEnd);
                // requestBody.append("Content-Disposition: form-data; name=\"image\"; filename=\"").append(fileList[i].getName()).append("\"").append(lineEnd);
                // requestBody.append("Content-Type: image/jpeg").append(lineEnd);
                // requestBody.append(lineEnd);
                // requestBody.append(new String(Files.readAllBytes(fileUploadDto.getFullPathList().get(i)))).append(lineEnd);
                // requestBody.append(twoHyphens).append(boundary).append(twoHyphens).append(lineEnd);
    
                // 요청 본문 생성
                HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(CLOVA_API_URL))
                    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                    .header("X-OCR-SECRET", SECRET_KEY)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
                    .build();
    
                // 요청 보내기 및 응답 받기
                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    
                // 응답 상태 코드 출력
                logger.info("Response Code: " + response.statusCode());
                // 응답 본문 출력
                logger.info("Response Body: " + response.body());

                
                    // String fileName = StringUtils.cleanPath(file.getOriginalFilename());
                    
                    // Path fullPath = filePath.resolve(fileName);
                    
                    // Files.copy(file.getInputStream(), fullPath);
                    
                    // String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    //         .path("/uploads/files/")
                    //         .path(fileName)
                    //         .toUriString();
                    
                    // fileNames.add(fileDownloadUri);
                }

                

            }

            return ResponseEntity.ok(fileUploadDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e);
        }

        //return service.findByIdCatCd(Data);
    }
}