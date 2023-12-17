import styles from "./DataCard.module.css";
import { DataCardContainer } from "./DataCardContainer";

export const DataCard = ({
  className,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => {
  return (
    <DataCardContainer
      className={styles.dataCard + " " + className}
      {...props}
    />
  );
};
