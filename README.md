# ⚛️ Init-FC - Create a new React component

![Cover image](https://i.imgur.com/BP7MLMx.gif)

# Installation

```bash
npm i -g init-fc
```

This is a Node.js script that helps developers create a new React component. When executed, it prompts the user for information about the component to be created, such as its name, type, and whether it requires Scss styles or not. It also allows the user to extend an existing base component (div, button, input, or span).

The script imports several Node.js modules and external packages such as @clack/prompts, fs-jetpack, and Handlebars. It then reads several templates files (types.hbs, styles.hbs, and component.hbs) and compiles them using Handlebars to generate the required code for the new component.

The script uses the current working directory to determine the location of the component to be created. It also reads a crcpaths.json file in the current working directory to determine the folder structure of the components in the project. If the file does not exist, it creates a default folder structure with atom, molecule, organism, template, and page folders.

After getting the required information from the user, the script creates a new folder for the component and generates the necessary files (types.ts, module.scss, index.ts, and tsx). It also exports the new component in the index.ts file of its respective component type folder.

Finally, the script displays a confirmation message indicating that the component has been successfully created.

## You dont use atomic design?

If you don't use atomic design, you can create a `crcpaths.json` file in the root of your project with the following content:

```json
{
  "locations": {
    "components": "src/components",
    "pages": "src/pages"
  }
}
```
