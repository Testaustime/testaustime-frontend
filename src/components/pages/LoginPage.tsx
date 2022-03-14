import { useState } from "react";
import { useNavigate } from "react-router";
import { useLogin } from "../../hooks/useLogin";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useLogin();
  const navigate = useNavigate();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    login(username, password).then(() => {
      navigate("/");
    }).catch(() => {
      setError("An error occurred while logging in");
    });
  };

  return <div>
    <h1>Login</h1>
    {error}
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" onChange={e => setUsername(e.target.value)} value={username} />
      <input type="password" name="password" onChange={e => setPassword(e.target.value)} value={password} />
      <input type="submit" value="Log in" />
    </form>
  </div>;
};