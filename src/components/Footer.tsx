import { createStyles, Group, Text, Grid } from "@mantine/core";
import Testauskoira from "../images/TestauskoiraGradientLogo.png";
import GradientText from "../images/TestauserveriGradientText.png";

const authors = [
  "Luukas Pörtfors",
  "Ville Järvinen",
  "\"Eldemarkki\""
];

export const Footer = () => {
  const { classes } = createStyles((theme) => ({
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
      backgroundColor: theme.colorScheme === "dark" ? "#bbb" : "#333"
    },
    grid: {
      "@media (max-width: 495px)": {
        flexDirection: "column",
      }
    },
    gridItem: {
      "@media (max-width: 495px)": {
        minWidth: "100%",
      },
    }
  }))();
  return <>
    <div className={classes.container}>
      <span className={classes.line}></span>
      <Grid justify="space-between" mt="40px" className={classes.grid}>
        <Grid.Col span={4} className={classes.gridItem}>
          <Grid align="center" mb="10px">
            <img src={Testauskoira} width="50px" style={{ marginRight: "10px", marginBottom: "10px" }}></img>
            <img src={GradientText} width="200px"></img>
          </Grid>
          <Text>Supported by Testausserveri ry</Text>
        </Grid.Col>
        <Grid.Col span={7} className={classes.gridItem}>
          <Text pb="5px" align="right">❤️ <b>Authors:</b> {`${authors.slice(0, authors.length - 1).join(", ")} and ${authors[authors.length - 1]}`}</Text>
          <Text pb="5px" align="right">© {new Date().getFullYear()} <b>Copyright Testausserveri ry & contributors</b></Text>
          <Text pb="5px" align="right"><i>Licensed under the MIT license.</i></Text>
        </Grid.Col>
      </Grid>
    </div>
  </>;
};
