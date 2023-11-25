import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  
  webpack: (config) => {
    if (config.resolve) {
      // @ts-ignore
      config.resolve.fallback.fs = false;
    }
    return config;
  },
};

module.exports = config;
