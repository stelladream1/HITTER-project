import React, { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

const Update = () => {
    const storedSession = JSON.parse(localStorage.getItem("session")) || {};
    const navigate = useNavigate();
    const id = storedSession.loginId;
    const [session, setSession] = useState({});

    const [memberId, setMemberId] = useState("");
    const [memberEmail, setMemberEmail] = useState("");
    const [memberName, setMemberName] = useState("");
    const [memberNickName, setMemberNickName] = useState("");
    const [memberPassword, setMemberPassword] = useState("");
    const [editingPassword, setEditingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    const [pwdState, setPwdState] = useState("");
    const [isValidForm, setIsValidForm] = useState(false);

    const [editingName, setEditingName] = useState(false);
    const [editingNickName, setEditingNickName] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/member/update");
                const { data } = response;
                console.log(data);
                if (response.status === 200) {
                    const member_id = data.updateMember.id;
                    setMemberId(member_id);

                    const member_Email = data.updateMember.memberEmail;
                    setMemberEmail(member_Email);

                    const member_name = data.updateMember.memberName;
                    setMemberName(member_name);

                    const member_nickname = data.updateMember.memberNickName;
                    setMemberNickName(member_nickname);

                    const member_password = data.updateMember.memberPassword;
                    setMemberPassword(member_password);
                } else {
                    throw new Error("회원 정보를 불러오는데 실패하였습니다");
                }
            } catch (error) {
                console.error("Error during fetch:", error);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.target);
            const response = await axios.post("/member/update", formData, {
                responseType: "json",
            });
            console.log(response);
            if(response.status === 200) {

                alert("회원 정보가 성공적으로 수정되었습니다");
                alert("다시 로그인 해주세요")
                console.log()
                setTimeout(() => {
                    navigate("/member/logout");
                }, 1000);



            }else{
                console.error('오류가 발생했습니다. 다시 시도해주세요 ');
            }
        } catch (error) {
            console.error("회원정보를 수정하지 못했습니다.", error);
        }
    };
    const handleSubmitName = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.target);
            const response = await axios.post("/member/update/name", formData, {
                responseType: "json",
            });
            console.log(response);
            if(response.status === 200) {

                alert("회원 정보가 성공적으로 수정되었습니다");
                alert("다시 로그인 해주세요")
                navigate("/member/logout")



            }else{
                console.error('오류가 발생했습니다. 다시 시도해주세요 ');
            }
        } catch (error) {
            console.error("회원정보를 수정하지 못했습니다.", error);
        }
    };
    const handlePasswordEdit = () => {
        setEditingPassword(true);
        setNewPassword("");
        setConfirmPassword("");
        setPasswordMatchError(false);
    };

    const handleCancelEdit = () => {
        setEditingPassword(false);
        setNewPassword("");
        setConfirmPassword("");
        setPasswordMatchError(false);
    };


    const handlePwdInput = () => {
        const pwd = document.getElementById("pwd").value;
        const regExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
        const missingConditions = [];

        if (!regExp.test(pwd)) {
            if (!/(?=.*[A-Za-z])/.test(pwd)) {
                missingConditions.push("영문자");
            }
            if (!/(?=.*\d)/.test(pwd)) {
                missingConditions.push("숫자");
            }
            if (!/(?=.*[@$!%*#?&])/.test(pwd)) {
                missingConditions.push("특수문자");
            }
            if (pwd.length < 8 || pwd.length > 16) {
                if (pwd.length < 8) {
                    missingConditions.push(`비밀번호 자릿수(${pwd.length}/8)`);
                } else if (pwd.length > 16) {
                    missingConditions.push(`비밀번호 자릿수가 16보다 작아야 합니다.`);
                }
            }
            setPwdState(`비밀번호는 ${missingConditions.join(", ")} 조건을 포함해야 합니다!`);
            setIsValidForm(false);
        } else {
            setPwdState("");
            setIsValidForm(true);
        }
    };


    useEffect(() => {
        if (newPassword !== confirmPassword) {
            setPasswordMatchError(true);
            setIsValidForm(false);
        } else {
            setPasswordMatchError(false);
        }
    }, [newPassword, confirmPassword]);

    return (
        <>

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
                                    <a className="nav-link" href="/member/mypage">
                                        <p>{storedSession.memberName || storedSession.loginName}</p>
                                    </a>
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
            <nav>
                <ul>
                    <li className="nav-item">
                        <Link to={`/member/update?id=${id}`} className="nav-link">
                            회원 정보 수정하기
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/member/mySong" className="nav-link">
                            내 노래 조회하기
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/member/myBoard" className="nav-link">
                            내 게시판 조회하기
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/member/delete" className="nav-link">
                            회원 탈퇴하기
                        </Link>
                    </li>
                </ul>
            </nav>



            <form method="post" onSubmit={ handleSubmit }>
                로그인 정보
                <input type="hidden" value={memberId} name="id" />
                <input type="hidden" value={memberEmail} name="memberEmail" />
                <input type="hidden" value={memberName} name="memberName" />
                <input type="hidden" value={memberNickName} name="memberNickName" />
                {passwordMatchError || !editingPassword ? null : (
                    <input type="hidden" value={newPassword} name="memberPassword" />
                )}

                <br />
                이메일: <span>{memberEmail}</span>
                <br />
                비밀번호:{" "}
                {editingPassword ? (
                    <>
                        <input
                            type="password"
                            value={newPassword}
                            id="pwd"
                            onChange={(e) => {setNewPassword(e.target.value); handlePwdInput();}}
                            placeholder="새로운 비밀번호"

                        />
                        {pwdState && <span style={{ color: "red" }}>{pwdState}</span>}
                        <input
                            type="password"
                            value={confirmPassword}
                            id="re_pwd"
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                handlePwdInput();
                            }}
                            placeholder="비밀번호 확인"

                        />
                        {passwordMatchError && (
                            <span style={{ color: "red" }}>비밀번호가 일치하지 않습니다.</span>
                        )}

                        <button type = "submit" disabled={!isValidForm}>
                            수정하기
                        </button>
                        <button type="button" onClick={handleCancelEdit}>변경취소</button>
                    </>
                ) : (
                    <>
                        <span>********</span>
                        <button type="button" onClick={handlePasswordEdit}>수정</button>
                    </>
                )}
            </form>

            <form method="post" onSubmit={ handleSubmitName }>
                <input type="hidden" value={memberId} name="id" />
                <input type="hidden" value={memberEmail} name="memberEmail" />
                <input type="hidden" value={memberNickName} name="memberNickName" />
                <input type="hidden" value={memberPassword} name="memberPassword" />

                사용자 정보 <br />
                이름:{" "}
                {editingName ? (
                    <>
                        <input
                            type="text"
                            value={memberName}
                            name="memberName"
                            onChange={(e) => setMemberName(e.target.value)}
                        />

                        <button type="button" onClick={() => setEditingName(false)}>변경취소</button>
                        <button type = "submit" >
                            수정하기
                        </button>
                    </>
                ) : (
                    <>
                        <span>{memberName}</span>
                        <button type="button" onClick={() => setEditingName(true)}>
                            변경하기
                        </button>

                    </>
                )}
                <br />
            </form>

            <form method="post" onSubmit={handleSubmit}>
                <input type="hidden" value={memberId} name="id" />
                <input type="hidden" value={memberEmail} name="memberEmail" />
                <input type="hidden" value={memberName} name="memberName" />
                <input type="hidden" value={memberPassword} name="memberPassword" />
                <br />
                닉네임:{" "}
                {editingNickName ? (
                    <>
                        <input
                            type="text"
                            value={memberNickName}
                            name="memberNickName"
                            onChange={(e) => setMemberNickName(e.target.value)}
                        />

                        <button type="button"  onClick={() => setEditingNickName(false)}>취소</button>
                        <button type = "submit" >
                            수정하기
                        </button>
                    </>
                ) : (
                    <>
                        <span>{memberNickName}</span>
                        <button type="button"  onClick={() => setEditingNickName(true)}>수정</button>

                    </>
                )}
                <br />
            </form>


        </>


    );
};

export default Update;
