import styles from "./DataCard.module.css";

export const DataCardContainer = ({
  className,
  withoutPadding = false,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  withoutPadding?: boolean;
}) => {
  return (
    <div
      className={
        styles.dataCardContainer +
        (withoutPadding ? "" : " " + styles.withPadding) +
        " " +
        className
      }
      {...props}
    />
  );
};
