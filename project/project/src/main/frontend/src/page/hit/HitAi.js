import React, {useEffect, useState} from "react";
import './HitAi.css'
import {useNavigate} from "react-router-dom";

function Select() {
    return null;
}

const HitAi = ({session}) => {


    const storedSession = JSON.parse(localStorage.getItem('session')) || {};

    const [uploadResponse, setUploadResponse] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState("pop");
    const [songTitle, setSongTitle] = useState("");

    const navigate = useNavigate();
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.target);
            formData.append("genre", selectedGenre);
            formData.append("title", songTitle);
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setUploadResponse(data)

                alert("히트 분석 성공 ");

            } else {
                // 로그인 실패
                console.error('failed');
            }

        } catch (error) {
            // 오류 처리
            alert("파일을 등록해주세요");
        }
    };

    useEffect(() => {
        if (uploadResponse && uploadResponse.songDTO) {
            const id = uploadResponse.songDTO.id;
            console.log(uploadResponse);
            navigate(`/hit_ai_detail?id=${id}`, {
                state: {
                   songDTO: uploadResponse.songDTO
                }
            });
        }
    }, [uploadResponse, navigate]);

    return (
        <>
            {/* <!-- Navigation--> */}
            <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
                <div className="container px-5">
                    <a className="navbar-brand" href="/">HITTABLE</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive"
                            aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"><span
                        className="navbar-toggler-icon"></span></button>
                    <div className="collapse navbar-collapse" id="navbarResponsive">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item"><a className="nav-link" href="/member/hit_ai">Hit</a></li>
                            <li className="nav-item"><a className="nav-link" href="/song/board">Leader Board</a></li>
                            <li className="nav-item"><a className="nav-link" href="/board/paging">Community</a></li>
                            <li className="nav-item">
                                {storedSession.loginName != null && (
                                    <a className="nav-link" href="/member/mypage"><p>{storedSession.loginName}</p></a>
                                )}
                            </li>
                            <li className="nav-item">
                                {storedSession.loginName != null ? (
                                    <a className="nav-link" href="/member/logout">로그아웃</a>
                                ) : (
                                    <a className="nav-link" href="/member/save">Sign Up</a>
                                )}
                            </li>
                            <li className="nav-item">
                                {storedSession.loginName == null && (
                                    <a className="nav-link" href="/member/login">Log In</a>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>


            <h2>이 곡이 히트할 확률은 얼마나 될까요?<br></br>
                AI 기반 예측 모델로 측정해보세요!
            </h2>

            <form method="post" onSubmit={handleFormSubmit}>
                <label htmlFor="music">Choose a music file:</label>
                <input type="file" id="music" name="file" accept="audio/*"/>
                <input type="file" id="text" name="file1" />
                <input
                    type="text"
                    id="title"
                    name="songTitle"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    placeholder="노래 제목을 입력하세요"
                />
                <div>
                    <label htmlFor="genre">Genre</label>
                    <select name="genres" id="genres" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                        <option value="pop">팝</option>
                        <option value="dance">댄스</option>
                        <option value="ballad">발라드</option>
                    </select>
                </div>

                <input type="submit" value="Upload"/>
            </form>
        </>
    )
}


export default HitAi;