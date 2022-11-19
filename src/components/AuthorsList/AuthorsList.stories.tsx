import { Meta, StoryFn } from "@storybook/react";
import { withSetup } from "../../../.storybook/withSetup";
import { AuthorsList, AuthorsListProps } from "./AuthorsList";

export default {
  title: "AuthorsList",
  component: AuthorsList,
  decorators: [withSetup]
} as Meta;

const Template: StoryFn<AuthorsListProps> = args => <AuthorsList {...args} />;

export const Default = Template.bind({});
Default.args = {
  authors: [
    {
      name: "Dewey",
      homepage: "https://example.com"
    },
    {
      name: "Huey"
    },
    {
      name: "Louie",
      homepage: "https://example.net"
    }
  ]
};
