import { createStyles, Text, Grid, Anchor } from "@mantine/core";
import { useI18nContext } from "../../i18n/i18n-react";
import { ReactComponent as TestausserveriLogo } from "../../images/testausserveri.svg";
import { AuthorsList } from "../AuthorsList/AuthorsList";

const useStyles = createStyles(theme => ({
  container: {
    marginTop: "100px",
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column"
  },
  footerText: {
    fontSize: "1.2rem",
    color: theme.colorScheme === "dark" ? "#bbb" : "#333"
  },
  line: {
    width: "100%",
    color: theme.colorScheme === "dark" ? "#333" : "#ddd"
  },
  grid: {
    "@media (max-width: 495px)": {
      flexDirection: "column"
    }
  },
  gridItem: {
    "@media (max-width: 495px)": {
      minWidth: "100%"
    }
  },
  rightAlign: {
    textAlign: "right",
    "@media (max-width: 495px)": {
      textAlign: "left"
    }
  },
  bwLogo: {
    fill: theme.colorScheme === "dark" ? "white" : "black",
    opacity: "0.8",
    transition: "opacity 0.2s !important",
    ":hover": {
      opacity: "1"
    }
  }
}));

export const Footer = () => {
  const { classes } = useStyles();

  const { LL } = useI18nContext();

  return <>
    <div className={classes.container}>
      <hr className={classes.line} />
      <Grid justify="space-between" mt="40px" className={classes.grid}>
        <Grid.Col span={4} className={classes.gridItem}>
          <a href="https://testausserveri.fi">
            <TestausserveriLogo
              className={classes.bwLogo}
              height={90}
              width={155}
            />
          </a>
          <Text>{LL.footer.supportedBy()}</Text>
        </Grid.Col>
        <Grid.Col
          span={7}
          sx={{ display: "flex", gap: 5, flexDirection: "column" }}
          className={`${classes.gridItem} ${classes.rightAlign}`}
        >
          <AuthorsList authors={[
            { name: "Luukas Pörtfors", homepage: "https://lajp.fi" },
            { name: "Ville Järvinen", homepage: "https://vilepis.dev" },
            { name: "Eetu Mäenpää", homepage: "https://eetumaenpaa.fi" }
          ]} />
          <Text>{LL.footer.copyright({ year: new Date().getFullYear() })}</Text>
          <Text><i>{LL.footer.license()}</i></Text>
          <Text><Anchor href="https://github.com/Testaustime">{LL.footer.source()}</Anchor></Text>
        </Grid.Col>
      </Grid>
    </div>
  </>;
};
