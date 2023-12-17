import styles from "./DataCard.module.css";

export const DataCardContainer = ({
  className,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => {
  return (
    <div className={styles.dataCardContainer + " " + className} {...props} />
  );
};
