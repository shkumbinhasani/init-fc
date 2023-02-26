#!/usr/bin/env node

'use strict';
const { intro, text, outro, confirm, select } = require('@clack/prompts');
const jetpack = require("fs-jetpack");
const Handlebars = require('handlebars');

const currentWorkingDirectory = process.cwd();
const codeDirectory = __dirname;
console.log(currentWorkingDirectory);
const typesTemplate = Handlebars.compile(jetpack.read(`${codeDirectory}/templates/types.hbs`));
const scssTemplate = Handlebars.compile(jetpack.read(`${codeDirectory}/templates/styles.hbs`));
const componentTemplate = Handlebars.compile(jetpack.read(`${codeDirectory}/templates/component.hbs`));
const indexTemplate = Handlebars.compile(jetpack.read(`${codeDirectory}/templates/index.hbs`));
const elements = {
    'div': 'HTMLDivElement',
    'span': 'HTMLSpanElement',
    'button': 'HTMLButtonElement',
    'input': 'HTMLInputElement',
};
(async () => {
    intro(`Create React Component`);
    const componentTypes = {};
    if (jetpack.exists(currentWorkingDirectory + '/crcpaths.json')) {
        const paths = jetpack.read(currentWorkingDirectory + '/crcpaths.json', 'json');
        if (paths.locations) {
            Object.keys(paths.locations).forEach(key => {
                componentTypes[key] = paths.locations[key];
            });
        }
    }
    else {
        componentTypes['atom'] = './src/components/atoms';
        componentTypes['molecule'] = './src/components/molecules';
        componentTypes['organism'] = './src/components/organisms';
        componentTypes['template'] = './src/components/templates';
        componentTypes['page'] = './src/components/pages';
    }
    const name = await text({
        message: `What's the name of your component?`,
    });
    const componentType = await select({
        message: `What type of component is it?`,
        options: Object.keys(componentTypes).map((key) => {
            return {
                name: key.charAt(0).toUpperCase() + key.slice(1),
                value: key,
            };
        })
    });
    const hasScss = await confirm({
        message: `Does your component have Scss Styles?`,
    });
    const extend = await select({
        message: `Would you like to extend an base component?`,
        options: [
            {
                name: 'Div',
                value: 'div',
            },
            {
                name: 'Button',
                value: 'button',
            },
            {
                name: 'Input',
                value: 'input',
            },
            {
                name: 'Span',
                value: 'span',
            },
        ]
    });

    const forwardRef = await confirm({
        message: `Would you like to forward a ref?`,
    });
    let extraRefFunction = false;
    if(forwardRef) {
        extraRefFunction = await confirm({
            message: `Would you like to add extra ref functions?`,
        })
    }

    const element = elements[extend];
    const componentPath = `${currentWorkingDirectory}/${componentTypes[componentType.toString()]}/${name.toString()}`;
    if (jetpack.exists(componentPath)) {
        outro(`Component already exists!`);
        return;
    }
    jetpack.dir(componentPath);
    jetpack.file(`${componentPath}/${name.toString()}.types.ts`, {
        content: typesTemplate({
            name: name.toString(),
            element: element,
            forwardRef: forwardRef,
            extraRef: extraRefFunction,
        })
    });
    if (hasScss) {
        jetpack.file(`${componentPath}/${name.toString()}.module.scss`, {
            content: scssTemplate({
                name: name.toString(),
            })
        });
    }
    jetpack.file(`${componentPath}/${name.toString()}.tsx`, {
        content: componentTemplate({
            name: name.toString(),
            hasScss: hasScss,
            element: element,
            htmlElement: extend,
            forwardRef: forwardRef,
            extraRef: extraRefFunction,
        })
    });
    jetpack.file(`${componentPath}/index.ts`, {
        content: indexTemplate({
            name: name.toString(),
        })
    });
    const componentIndex = `${currentWorkingDirectory}/${componentTypes[componentType.toString()]}/index.ts`;
    if (jetpack.exists(componentIndex)) {
        const existingExports = jetpack.read(componentIndex);
        jetpack.write(componentIndex, `${existingExports}\rexport { default as ${name.toString()} } from './${name.toString()}'`);
    }
    else {
        jetpack.file(componentIndex, {
            content: `export { default as ${name.toString()} } from './${name.toString()}'`
        });
    }
    outro(`You're all set!`);
})();
