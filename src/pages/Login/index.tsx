import useInput from "@hooks/useInput";
import fetcher from "@utils/fetcher";
import {
  Button,
  Error,
  Form,
  Header,
  Input,
  Label,
  LinkContainer,
} from "@pages/SignUp/styles";
import { FormEvent, useCallback, useState } from "react";
import axios from "axios";
// import { Redirect } from "react-router-dom";
import useSWR from "swr";

export default function LogIn() {
  // GET 요청
  // useSWR의 첫번째 파라미터(요청 주소)가 fetcher 함수의 파라미터로 전달됨
  // data가 존재하지 않으면 로딩중
  // 프론트랑 백이랑 도메인이 다르면 쿠키 생성도 안되고 전달도 안됨.. >> axios의 withCredentials를 true로 설정해야 됨
  const {
    data: userData,
    error,
    mutate,
  } = useSWR("/api/users", fetcher, {
    // 요청 주기
    dedupingInterval: 100000,
  });
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          "/api/users/login",
          { email, password },
          {
            withCredentials: true,
          }
        )
        .then(() => {
          console.log("로그인 성공");
          mutate();
        })
        .catch((error) => {
          console.dir(error);
          setLogInError(error.response?.status === 401);
        });
    },
    // mutate
    [email, password]
  );

  // console.log(error, userData);
  // if (!error && userData) {
  //   console.log("로그인됨", userData);
  //   return <Redirect to="/workspace/sleact/channel/일반" />;
  // }
  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChangeEmail}
            />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChangePassword}
            />
          </div>
          {logInError && (
            <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>
          )}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <a href="/signup">회원가입 하러가기</a>
      </LinkContainer>
    </div>
  );
}