package com.codingrecipe.member.entity;

import com.codingrecipe.member.dto.SongDTO;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Setter
@Getter
@Table(name = "song")
public class SongEntity extends BaseEntity{
    @Id // pk 지정
    @Column(name = "song_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto_increment
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private MemberEntity member;

    @Column(name = "prediction")
    private Float prediction;

    @Column(name="song_title")
    private String songTitle;

    @Column(name="user_nickname")
    private String memberNickName;


    @Column(name="file_sys_name")
    private String fileSysName;

    @Column(name="lyrics_sys_name")
    private String lyrics;

    @Column(name="genre")
    private String genre;

    @Column(name="song_like")
    private Integer songLike;

    @OneToMany(mappedBy = "song", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<LikeEntity> likes = new ArrayList<>();


    public static SongEntity toSongEntity(SongDTO songDTO) {
        SongEntity songEntity = new SongEntity();

        MemberEntity memberEntity = new MemberEntity();
        memberEntity.setId(songDTO.getMemberId());


        songEntity.setMember(memberEntity);
        songEntity.setMemberNickName(songDTO.getMemberNickName());
        songEntity.setPrediction(songDTO.getPrediction());
        songEntity.setSongTitle(songDTO.getSongTitle());
        songEntity.setFileSysName(songDTO.getFileSysName());
        songEntity.setLyrics(songDTO.getLyrics());
        songEntity.setGenre(songDTO.getGenre());
        songEntity.setSongLike(0);

        return songEntity;
    }
}