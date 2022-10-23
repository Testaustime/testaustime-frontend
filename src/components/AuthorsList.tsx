import { Anchor, Text } from "@mantine/core";
import { Fragment, ReactNode } from "react";
import { useI18nContext } from "../i18n/i18n-react";

interface Author {
  name: string,
  homepage?: string
}

export interface AuthorsListProps {
  authors: Author[]
}

export const AuthorsList = ({ authors }: AuthorsListProps) => {
  const { LL } = useI18nContext();

  const andWord = LL.footer.authors.and();
  const authorComponents: ReactNode[] = [];

  authors.forEach((author, index) => {
    const c = author.homepage ?
      <Anchor key={author.name} href={author.homepage}>{author.name}</Anchor> :
      <Fragment key={author.name}>{author.name}</Fragment>;

    authorComponents.push(c);
    if (index === authors.length - 2) {
      authorComponents.push(` ${andWord} `);
    }
    else if (index !== authors.length - 1) {
      authorComponents.push(", ");
    }
  });

  return <Text>❤️ {LL.footer.authors.label()}: {authorComponents}</Text>;
};
