import { createStyles, Text, Grid, Anchor } from "@mantine/core";
import { ReactNode, Fragment } from "react";
import { ReactComponent as TestausserveriLogo } from "../images/testausserveri.svg";

interface Author {
  name: string,
  homepage?: string
}

const authors: Author[] = [
  { name: "Luukas Pörtfors", homepage: "https://lajp.fi" },
  { name: "Ville Järvinen" },
  { name: "Eetu Mäenpää", homepage: "https://eetumaenpaa.fi" }
];

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

  const authorComponents: ReactNode[] = [];

  authors.forEach((author, index) => {
    const c = author.homepage ?
      <Anchor key={author.name} href={author.homepage}>{author.name}</Anchor> :
      <Fragment key={author.name}>{author.name}</Fragment>;

    authorComponents.push(c);
    if (index === authors.length - 2) {
      authorComponents.push(" and ");
    }
    else if (index !== authors.length - 1) {
      authorComponents.push(", ");
    }
  });

  return <>
    <div className={classes.container}>
      <span className={classes.line} />
      <Grid justify="space-between" mt="40px" className={classes.grid}>
        <Grid.Col span={4} className={classes.gridItem}>
          <a href="https://testausserveri.fi">
            <TestausserveriLogo
              className={classes.bwLogo}
              height={90}
              width={155}
            />
          </a>
          <Text>Supported by Testausserveri ry</Text>
        </Grid.Col>
        <Grid.Col
          span={7}
          sx={{ display: "flex", gap: 5, flexDirection: "column" }}
          className={`${classes.gridItem} ${classes.rightAlign}`}
        >
          <Text>❤️ Authors: {authorComponents}</Text>
          <Text>&copy; {new Date().getFullYear()} Copyright Testausserveri ry &amp; contributors</Text>
          <Text><i>Licensed under the MIT license.</i></Text>
          <Text><Anchor href="https://github.com/Testaustime">Source code</Anchor></Text>
        </Grid.Col>
      </Grid>
    </div>
  </>;
};
