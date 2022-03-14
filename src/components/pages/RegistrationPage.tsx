import { useState } from "react";
import { useNavigate } from "react-router";
import { useRegister } from "../../hooks/useRegister";

export const RegistrationPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useRegister();
  const navigate = useNavigate();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    register(username, password).then(() => {
      navigate("/");
    }).catch(() => {
      setError("An error occurred while registering");
    });
  };

  return <div>
    <h1>Register</h1>
    {error}
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" onChange={e => setUsername(e.target.value)} value={username} />
      <input type="password" name="password" onChange={e => setPassword(e.target.value)} value={password} />
      <input type="submit" value="Register" />
    </form>
  </div>;
};