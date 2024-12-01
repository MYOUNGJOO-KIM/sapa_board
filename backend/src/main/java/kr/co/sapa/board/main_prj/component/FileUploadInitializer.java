package kr.co.sapa.board.main_prj.component;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import lombok.Getter;

@Component
@Getter
public class FileUploadInitializer {
    @Value("${file.upload-dir}")
    private String uploadDir;

    private final ResourceLoader resourceLoader;

    public FileUploadInitializer(ResourceLoader resourceLoader){
        this.resourceLoader = resourceLoader;
    }

    // @PostConstruct
    // public void init() {
    //     File dir = new File(uploadDir);
    //     if (!dir.exists()) {
    //         dir.mkdirs();
    //     }
    // }

    @PostConstruct
    public void init() {
        Resource resource = resourceLoader.getResource(uploadDir);
        
        // Path path = Paths.get(uploadDir);
        // try {
        //     if (!Files.exists(path)) {
        //         Files.createDirectories(path);
        //     }
        // } catch (IOException e) {
        //     throw new RuntimeException("Could not create upload directory", e);
        // }
    }
}