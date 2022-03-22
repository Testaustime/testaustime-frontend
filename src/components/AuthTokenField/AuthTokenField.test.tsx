import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthTokenField } from "./AuthTokenField";

it("shows hidden text when unrevealed", () => {
  const { container } = render(<AuthTokenField authToken="authtoken" revealed={false} revealLength={4} />);
  expect(container).toHaveTextContent("auth");

  // Doesn't contain the last "n" letter -> it has been hidden
  expect(container).not.toHaveTextContent("n"); 
});

it("shows whole text when revealed", () => {
  const { container } = render(<AuthTokenField authToken="authtoken" revealed={true} revealLength={4} />);
  expect(container).toHaveTextContent("authtoken");
});

it("has hidden characters while unrevealed", () => {
  const { container } = render(<AuthTokenField authToken="authtoken" revealed={false} revealLength={4} hiddenCharacter="*" />);
  expect(container).toHaveTextContent("auth*****");
});

it("can have different hidden characters", () => {
  const { container } = render(<AuthTokenField authToken="authtoken" revealed={false} revealLength={4} hiddenCharacter="X" />);
  expect(container).toHaveTextContent("authXXXXX");
});

it("handles empty texts correctly", () => {
  const { container } = render(<AuthTokenField authToken="" revealed={false} revealLength={4} />);
  expect(container).toHaveTextContent("");
});