package kr.co.sapa.board;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import kr.co.sapa.board.main_prj.repository.CategoryRepo;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class IndexController {
    
    private final CategoryRepo repo;
    Logger logger = LoggerFactory.getLogger(IndexController.class);

    @GetMapping("/")
    public String root() {
        

        //return "index";
        return "redirect:/category";
    }
}
