package kr.co.sapa.board;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import kr.co.sapa.board.main_prj.entity.Category;
import kr.co.sapa.board.main_prj.repository.CategoryRepo;
import kr.co.sapa.board.main_prj.service.DataService;

@SpringBootTest
public class CategoryRepoTest {
    @Autowired
    CategoryRepo repo;
    Logger logger = LoggerFactory.getLogger(CategoryRepoTest.class);

    @Test
    public void testSelectAll(){
        List<Category> list = repo.findAll();

        // for(Category record : list){
        //     logger.info("========================");
        //     logger.info(record.getCatCd());
        //     logger.info(record.getCatNm());
        //     logger.info("========================");
        // }
    }
}
