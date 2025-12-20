import { ComponentPropsWithoutRef, forwardRef } from "react";
import styles from "./BlinkingDot.module.css";

export const BlinkingDot = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    className={styles.blinkingDot + " " + (className ?? "")}
    ref={ref}
    {...props}
  />
));

BlinkingDot.displayName = "BlinkingDot";
