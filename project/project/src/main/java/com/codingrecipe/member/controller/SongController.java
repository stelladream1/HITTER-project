package com.codingrecipe.member.controller;

import com.codingrecipe.member.dto.LikeDTO;
import com.codingrecipe.member.dto.SongDTO;
import com.codingrecipe.member.entity.LikeEntity;
import com.codingrecipe.member.service.LikeService;
import com.codingrecipe.member.service.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;


import java.io.IOException;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class SongController {

    private final SongService songService;
    private final LikeService likeService;

//    @GetMapping("/song/leader_board")
//    public ResponseEntity<Map<String, Object>> findAll() {
//        List<SongDTO> songDTOList = songService.findAll();
//
//        Map<String, Object> responseData = new HashMap<>();
//
//        if (songDTOList  != null ) {
//            responseData.put("songList", songDTOList);
//            return ResponseEntity.status(HttpStatus.OK).body(responseData);
//        }
//        else{
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseData);
//        }
//
//    }

    @GetMapping("/song/leader_board/{memberId}")
    public ResponseEntity<Map<String, Object>> findByMemberId(@PathVariable Long memberId) {
        System.out.println("111111111111");
        List<SongDTO> songDTOList = songService.findAll();
        List<LikeDTO> likeDTOList = likeService.findByUserId(memberId);

//        List<LikeDTO> likeDTOList = likeService.findAll();

        Map<String, Object> responseData = new HashMap<>();

        if (songDTOList  != null ) {
            responseData.put("songList", songDTOList);
            responseData.put("likeList", likeDTOList);
            System.out.println(songDTOList);
            return ResponseEntity.status(HttpStatus.OK).body(responseData);
        }
        else{
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseData);
        }

    }

    @GetMapping("/song/detail/{id}")
    public ResponseEntity<Map<String, Object>> findById(@PathVariable Long id) {

        SongDTO songDTO = songService.findById(id);
        System.out.println(songDTO);
        Map<String, Object> response = new HashMap<>();

        if ( songDTO != null) {
            response.put("songDTO", songDTO);


            System.out.println(response);
            return ResponseEntity.status(HttpStatus.OK).body( response);

        }
        else{
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

    }



    @GetMapping("/song/play/{id}")
    public ResponseEntity<Resource> PlaySong(@PathVariable Long id) throws IOException {
        SongDTO songDTO = songService.findById(id);

        String songFilePath = "/home/ubuntu/song/" + songDTO.getFileSysName();
        Resource resource = new UrlResource(Paths.get(songFilePath).toUri());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);


    }

    @GetMapping("/song/txt/{id}")
    public ResponseEntity<Resource> SongTxt(@PathVariable Long id) throws IOException {
        SongDTO songDTO = songService.findById(id);

        String text = "/home/ubuntu/txt/" + songDTO.getLyrics();
        Resource resource = new UrlResource(Paths.get(text).toUri());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);


    }

//    @PostMapping("/song/like/{id}")

}