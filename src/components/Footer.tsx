import { createStyles, Text, Grid } from "@mantine/core";
import TestausserveriLogo from "../images/testausserveri.svg";

const authors = [
  "Luukas Pörtfors",
  "Ville Järvinen",
  "\"Eldemarkki\""
];

export const Footer = () => {
  const { classes } = createStyles(theme => ({
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
      height: "1px",
      backgroundColor: theme.colorScheme === "dark" ? "#333" : "#ddd"
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
      filter: theme.colorScheme === "dark" ? "invert(1)" : "none",
      opacity: "0.8",
      transition: "opacity 0.2s !important",
      ":hover": {
        opacity: "1"
      }
    }
  }))();

  const authorsList = `${authors.slice(0, authors.length - 1).join(", ")} and ${authors[authors.length - 1]}`;

  return <>
    <div className={classes.container}>
      <span className={classes.line} />
      <Grid justify="space-between" mt="40px" className={classes.grid}>
        <Grid.Col span={4} className={classes.gridItem}>
          <a href="https://testausserveri.fi" style={{ display: "flex" }}>
            <img
              src={TestausserveriLogo}
              alt="Testausserveri ry"
              style={{ marginRight: "8px" }}
              height={90}
              className={classes.bwLogo} />
          </a>
          <Text>Supported by Testausserveri ry</Text>
        </Grid.Col>
        <Grid.Col span={7} className={`${classes.gridItem} ${classes.rightAlign}`}>
          <Text pb="5px">❤️ Authors: {authorsList}</Text>
          <Text pb="5px">&copy; {new Date().getFullYear()} Copyright Testausserveri ry &amp; contributors</Text>
          <Text pb="5px"><i>Licensed under the MIT license.</i></Text>
        </Grid.Col>
      </Grid>
    </div>
  </>;
};
