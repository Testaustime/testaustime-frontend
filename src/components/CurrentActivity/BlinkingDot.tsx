import { DetailedHTMLProps } from "react";
import styles from "./BlinkingDot.module.css";

type BlinkingDotProps = DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const BlinkingDot = ({ className, ...props }: BlinkingDotProps) => {
  return <div className={styles.blinkingDot + " " + className} {...props} />;
};
