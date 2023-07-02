import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import axios from "axios";
// import './HitAi.css'

const BoardDetail = () => {

    const storedSession = JSON.parse(localStorage.getItem('session')) || {};
    const [session, setSession] = useState({});

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState('');

    useEffect(() => {
        const storedSession = JSON.parse(localStorage.getItem('session')) || {};

        if (storedSession && storedSession.loginName) {
            setSession(storedSession);
        }
    }, []);

    const memberId = storedSession.loginId;

    const navigate = useNavigate();
    const location = useLocation();

    let id;
    let page;

    if (location.state && location.state.postResponse) {
        id = parseInt(location.state.postResponse);
        page = parseInt(location.state.page)
    }
    else {
        const searchParams = new URLSearchParams(location.search);

        id = parseInt(searchParams.get('id'));
        page = parseInt(searchParams.get('page'));
    }

    console.log(page);
    if (!page) {
        page = 1; // 페이지 값이 없을 경우 1( 내 게시판에서 들어왔을때임)
    }
    const [boardTitle, setBoardTitle] = useState('');
    const [boardWrite, setBoardWrite] = useState('');
    const [boardHits, setBoardHits] = useState('');
    const [boardContents, setBoardContents] = useState('');
    const [boardCreatedTIme, setBoardCreatedTime] = useState('');
    const [comments, setComments] = useState([]);
    //
    function reqList() {
        navigate(`/board/paging?page=${page}`, { state: { page: page } });
    }
    function deleteList(id) {
        const confirmDelete = window.confirm('게시글을 정말 삭제하시겠습니까?');

        if (confirmDelete) {
            navigate(`/board/delete?id=` + id, {state: {id: id}});
        }
    }

    function UpdateList() {
        navigate(`/board/update?id=` + id +`&page=` + page , {state: {id: id}, page: {page} });
    }

    const commentWrite = async() => {
        const writerId = document.getElementById("commentWriterId").value;
        const writerNickName = document.getElementById("commentNickName").value;
        const contents = document.getElementById("commentContents").value;
        const board_id = id;
        console.log(board_id);

        const response = await axios.post(`/comment/save`, {
                commentWriterId: writerId,
                commentNickName: writerNickName,
                commentContents: contents,
                boardId: id,
        });
            if (response.status === 200) {
                window.location.reload();

        }else{
                console.log("실패")
            }

    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/board/detail/' + id);
                const { data } = response;
                console.log(data);
                if (response.status === 200) {
                    const board_title = data.board.boardTitle;
                    setBoardTitle(board_title);

                    const board_writer = data.board.boardWriter;
                    setBoardWrite(board_writer);

                    const board_hits = data.board.boardHits;
                    setBoardHits(board_hits);

                    const board_contents = data.board.boardContents;
                    setBoardContents(board_contents);

                    const board_created = data.board.boardCreatedTime;
                    setBoardCreatedTime(board_created);

                    const commentDTOList = data.commentList;
                    setComments(commentDTOList);

                } else {
                    alert('게시글 정보를 불러오는데 실패하였습니다');
                }
            } catch (error) {
                alert('오류가 발생했습니다. 다시 시도해주세요 ');
            }
        };

        fetchData().catch((error) => {
            console.error('Error during fetch:', error);
        });
    }, []);


    const deleteComment = async (commentId) => {
        const confirmDelete = window.confirm('댓글을 정말 삭제하시겠습니까?');

        if (confirmDelete) {
            try {
                await axios.delete(`/comment/delete/${commentId}`);
                alert("성공적으로 삭제 되었습니다.")
                window.location.reload();
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    }

    const updateComment = (commentId) => {
        setEditingCommentId(commentId);
        const comment = comments.find((comment) => comment.id === commentId);
        setEditedComment(comment.commentContents);
    };
    const saveEditedComment = async (commentId) => {
        console.log("수정수정")
        try {

            const response = await axios.put(`/comment/update/${commentId}`, {
                commentContents: editedComment,
                commentWriterId: storedSession.loginId,
                commentNickName: storedSession.loginNickName,
                boardId: id,
            });
            alert("댓글이 성공적으로 수정되었습니다.");
            window.location.reload();
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

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

            <div>
                <p>board_id: {id}</p>
                <p>board_title: {boardTitle}</p>
                <p>board_content: {boardContents}</p>
                <p> board_writer: { boardWrite}</p>
                <p> board_hits: { boardHits}</p>
                <p> board_created: {boardCreatedTIme}</p>
            </div>
            <button onClick={() => reqList()}>목록</button>

            <button onClick={() => UpdateList()}>수정</button>
            <button onClick={() => deleteList(id)}>삭제</button>


            <div>
                <input type="hidden" id ="commentNickName" value={storedSession.loginNickName}/>

                <input type="hidden" id ="commentWriterId"  value={storedSession.loginId}/>
                <input type="text" id= "commentContents" placeholder="내용" />
                <button id="comment-write-btn" onClick={() => commentWrite()}>댓글작성</button>
            </div>

            <div id="commentList">
                <table>
                    <thead>
                    <tr>
                        <th>댓글번호</th>
                        <th>댓글 작성자</th>
                        <th>댓글작성자 아이디</th>
                        <th>댓글 내용</th>
                        <th>댓글 작성 시간</th>
                    </tr>
                    </thead>
                    <tbody>
                    {comments.map((comment) => (
                        <tr key={comment.id}>
                            <td>{comment.id}</td>
                            <td>{comment.commentWriterId}</td>
                            <td>{comment.commentNickName}</td>
                            <td>
                                {editingCommentId === comment.id ? (
                                    <textarea
                                        value={editedComment}
                                        onChange={(e) => setEditedComment(e.target.value)}
                                        style={{ width: "100%", height: "100px" }} // Adjust the size as per your requirements
                                    />
                                ) : (
                                    comment.commentContents
                                )}
                            </td>
                            <td>{comment.commentCreatedTime}</td>
                            <td>
                                {storedSession.loginId === comment.commentWriterId && (
                                    <>
                                        {editingCommentId === comment.id ? (
                                            <button onClick={() => saveEditedComment(comment.id)}>
                                                저장
                                            </button>
                                        ) : (
                                            <button onClick={() => updateComment(comment.id)}>수정</button>
                                        )}
                                    </>
                                )}
                            </td>
                            <td>
                                {storedSession.loginId === comment.commentWriterId && (
                                    <button onClick={() => deleteComment(comment.id)}>삭제</button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            </div>
        </>
    )
}


export default BoardDetail;