import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { setAuthToken } from "../../slices/userSlice";
import { RootState } from "../../store";
import { Dashboard } from "../Dashboard";

const TestaustimeTitle = styled.h1`
  font-family: "Poppins", sans-serif;
  background: linear-gradient(51deg, rgba(60,112,157,1) 0%, rgba(34,65,108,1) 100%);
  font-size: 2.5rem;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
`;

const HeaderRow = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const ExtensionLink = styled.a`
  width: fit-content;
`;

const ExtensionLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const MainPage = () => {
  const token = useSelector<RootState, string>(state => state.users.authToken);
  const username = useSelector<RootState, string>(state => state.users.username);
  const isLoggedIn = !!token;
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(setAuthToken(""));
    localStorage.removeItem("authToken");
  };

  return <div>
    <HeaderRow>
      <TestaustimeTitle>Testaustime</TestaustimeTitle>
      <HeaderLinks>
        {!isLoggedIn && <Link to="/login">Login</Link>}
        {!isLoggedIn && <Link to="/register">Register</Link>}
        {isLoggedIn && <span>{username}</span>}
        {isLoggedIn && <button onClick={logOut}>Log out</button>}
      </HeaderLinks>
    </HeaderRow>
    {isLoggedIn ? <>
      <Dashboard />
    </> : <>
      <p>TestausTime is the ultimate tool for tracking time of your coding sessions. Show the world how dedicated you are to your projects.</p>
      <h2>Editor extensions</h2>
      <ExtensionLinks>
        <ExtensionLink href="https://marketplace.visualstudio.com/items?itemName=testausserveri-ry.testaustime">Visual Studio Code</ExtensionLink>
        <ExtensionLink href="https://github.com/lajp/testaustime-nvim">NeoVim</ExtensionLink>
      </ExtensionLinks>
    </>}
  </div>;
};