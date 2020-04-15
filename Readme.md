# Simple OpenMCT Template
This repository serves as a template server for Nasa's Open Mission Control (OpenMCT) which allows users to get set-up and running with a customization instance within a short period of time. Additionally this template includes a system to easily install plugins or use a customized OpenMCT platform.

## Onboarding Instructions
Getting a customizable OpenMCT server up and running is as easy as 4 steps. 
1. Install [NPM and NodeJS](https://www.npmjs.com/get-npm)
2. Clone the repository
```
> git clone https://github.com/qkmaxware/openmct-template.git
```
3. Install dependencies
```
> npm install
```
4. [ Optional ] Install plugins. See [Installing plugins](#installing-plugins).

** If there are any issues during the `npm install` stage, this is likely due to issues with OpenMCT itself which builds itself when installed. See [Using a custom OpenMCT platform](#using-a-custom-openmct-platform) for a potential fix.

## Changing the OpenMCT port
Create an environment variable `OPENMCT_PORT` set to the value of the port you would like to use. Default is 8080.

## Using a custom OpenMCT platform
Sometimes you may want to use a customized instance of OpenMCT. For instance, on windows, for the current build of OpenMCT, you have to update the SCSS paths in `src/plugins/themes/espresso-theme.scss`, `src/plugins/themes/maelstrom-theme.scss`, and `src/plugins/themes/snow-theme.scss` from "~" to "../../" in order for it to compile. In these cases change the package.json dependency for openmct to the relative path to that instance's root directory
```diff
{
    ...
    "dependencies": {
        "ejs": "^3.0.2",
        "express": "^4.16.4",
        "express-ws": "^4.0.0",
-       "openmct": "https://github.com/nasa/openmct.git",
+       "openmct": "file:../../openmct",
        "request": "^2.88.2",
        "ws": "^6.1.2"
    },
}
```

## Installing plugins
This template is designed to be easy to install and develop plugins for. The system is designed for both client side (web-browser) and server-side (nodejs) plugins. 

1. Develop plugin
   - client side plugins should create a function that returns an OpenMCT install function
   - server side plugins should export a function that take in an express application argument
2. Place plugin files in the plugins directory
```
./plugins/myplugin
```
3. Add relative paths to plugin files to the package.json to be automatically included. You do not need to have both client and server files. Client files are included in index.html automatically, and server files are loaded on the nodejs server. The name of the plugin on this manifest is the same as the name of the client side installer function.
```diff
{
    ...
    "plugins": {
+       "myplugin": {
+           "client": "plugins/myplugin/plugin.client.js",
+           "server": "plugins/myplugin/plugin.server.js"
+       }
    }
}
```

## Plugin development
Plugin development can happen within the plugins directory and should be installed the same as with the [installing plugins](#installing-plugins) section. A tutorial is provided by Nasa [here](https://github.com/nasa/openmct-tutorial) and if you follow that guide and install the plugin by referencing the files correctly in the package.json then the plugin system should pick up on them next time it is refreshed.

For plugin development, follow the style guide [here](https://nasa.github.io/openmct/style-guide/#/browse/styleguide:home/intro?view=styleguide.intro)