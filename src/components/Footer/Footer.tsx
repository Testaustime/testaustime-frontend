import { createStyles, Text, Anchor } from "@mantine/core";
import { useI18nContext } from "../../i18n/i18n-react";
import { ReactComponent as TestausserveriLogo } from "../../images/testausserveri.svg";
import { LanguageSelector } from "../LanguageSelector/LanguageSelector";

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
    color: theme.colorScheme === "dark" ? "#333" : "#ddd",
    marginBlockEnd: "3rem"
  },
  rightSection: {
    display: "inline-flex",
    gap: 8,
    flexDirection: "column",
    alignItems: "flex-end",
    textAlign: "right",
    "@media (max-width: 550px)": {
      alignItems: "flex-start",
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
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
    gap: 32,
    "@media (max-width: 550px)": {
      flexDirection: "column"
    }
  }
}));

export const Footer = () => {
  const { classes } = useStyles();

  const { LL } = useI18nContext();

  return <div className={classes.container}>
    <hr className={classes.line} />
    <div className={classes.content}>
      <div>
        <a href="https://testausserveri.fi">
          <TestausserveriLogo
            className={classes.bwLogo}
            height={90}
            width={155}
          />
        </a>
        <Text>{LL.footer.supportedBy()}</Text>
      </div>
      <div className={classes.rightSection}>
        <Text>
          ❤️ {LL.footer.authors.suffix()}
          <Anchor href="https://github.com/orgs/Testaustime/people">{LL.footer.authors.core()}</Anchor>
          {LL.footer.authors.rest()}
        </Text>
        <Text>{LL.footer.copyright({ year: new Date().getFullYear() })}</Text>
        <Text>
          <i>{LL.footer.license()}</i> <Anchor href="https://github.com/Testaustime">{LL.footer.source()}</Anchor>
        </Text>
        <LanguageSelector type="dropdown" showLabel={false} size="sm" />
      </div>
    </div>
  </div>;
};
