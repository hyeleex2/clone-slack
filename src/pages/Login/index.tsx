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
import useSWR from "swr";
import { Navigate } from "react-router-dom";

export default function LogIn() {
  // GET 요청
  // useSWR의 첫번째 파라미터(요청 주소)가 fetcher 함수의 파라미터로 전달됨
  // data가 존재하지 않으면 로딩중
  // 프론트랑 백이랑 도메인이 다르면 쿠키 생성도 안되고 전달도 안됨.. >> axios의 withCredentials를 true로 설정해야 됨
  const { data, mutate, error } = useSWR("/api/users", fetcher, {
    // 요청 캐싱 주기
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
        .then((response) => {
          // mutate: 서버에 요청을 보내지 않고 data를 바꿔치기 함
          mutate(response.data, false);
          // Optimistic UI : 인스타에서 하트 누르면 일단 ui는 바꿔주고 API 호출하는 형태
          // 먼저 성공할 거라고 생각하고 점검하는 UI
          // mutate의 두번째 파라미터로 false 하면 서버에 재요청을 보내지 않음
        })
        .catch((error) => {
          setLogInError(error.response?.status === 401);
        });
    },
    [email, password, mutate]
  );

  if (!error && data) {
    return <Navigate to="/workspace/sleact/channel/일반" />;
  }
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
