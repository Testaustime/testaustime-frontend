import { useSelector } from "react-redux";
import styled from "styled-components";
import { useAuthentication } from "../../hooks/useAuthentication";
import { RootState } from "../../store";
import { Dashboard } from "../Dashboard";


const ExtensionLink = styled.a`
  width: fit-content;
`;

const ExtensionLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const MainPage = () => {
  const { isLoggedIn } = useAuthentication();

  return <div>
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