package com.codingrecipe.member.dto;


import com.codingrecipe.member.entity.MemberEntity;
import com.codingrecipe.member.entity.SongEntity;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SongDTO {
    private Long id;
    private Long memberId;
    private String memberNickName;
    private Float prediction;
    private String songTitle;
    private String fileSysName;
    private String lyrics;
    private String genre;

    private LocalDateTime songCreatedTime;
    private Integer songLike;
    private String songTag;
    public SongDTO(Long id, String memberNickName, Float prediction, String songTitle, String genre, Integer songLike, LocalDateTime songCreatedTime, String songTag) {
        this.id = id;
        this.memberNickName = memberNickName;
        this.prediction = prediction;
        this.songTitle = songTitle;
        this.genre = genre;
        this.songLike = songLike;
        this.songCreatedTime = songCreatedTime;
        this.songTag = songTag;

    }

    public static SongDTO toSongDTO(SongEntity songEntity) {
        SongDTO songDTO = new SongDTO();
        songDTO.setId(songEntity.getId());
        songDTO.setMemberId(songEntity.getMember().getId());
        songDTO.setMemberNickName(songEntity.getMemberNickName());
        songDTO.setPrediction(songEntity.getPrediction());
        songDTO.setFileSysName(songEntity.getFileSysName());
        songDTO.setSongTitle(songEntity.getSongTitle());
        songDTO.setLyrics(songEntity.getLyrics());
        songDTO.setGenre(songEntity.getGenre());
        songDTO.setSongCreatedTime(songEntity.getCreatedTime());
        songDTO.setSongLike(songEntity.getSongLike());
        songDTO.setSongTag(songEntity.getSongTag());
        return songDTO;
    }


}

