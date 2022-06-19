# Testaustime-frontend

This repository contains the code for the frontend of [Testaustime](https://testaustime.fi). It is a time-tracking application for tracking time spent on coding. Currently we have editor extensions for [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=testausserveri-ry.testaustime) and [Neovim](https://lajp.fi/static/testaustime-nvim).

## Development

First, install the necessary packages with `npm install`

To start the development server, run `npm run dev`. It will automatically refresh the page when you make changes to the code.

To run the tests, run `npm test`.

## Production

You can build the project by running `npm run build`, which will generate the projects files to the `dist` folder. To preview the production build, run `npm run preview`.

## Contributing

Thank you for considering contributing to this project! Please follow these guidelines when making a pull request:

- Running `npm run lint` should not show any errors or warnings. This will be checked automatically when a pull request is created. In some cases, you can fix the the errors and warnings with `npm run lint -- --fix`
  - If you get the warning that your version of TypeScript is not supported by eslint (though it must then be newer than the latest supported version), **this error can be ignored**
- All tests should pass. This is also checked automatically by GitHub.
- The pull request should contain a good description, which explains the changes you have made, and why you made them.