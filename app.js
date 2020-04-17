/// ------------------------------------------------------------------------------------------------
/// Package Imports
/// ------------------------------------------------------------------------------------------------

const express = require('express');
const path = require("path");
const bodyParser = require('body-parser')
const fs = require("fs");
const package = require('./package.json');

const app = express();

/// ------------------------------------------------------------------------------------------------
/// Setup Required Paths
/// ------------------------------------------------------------------------------------------------

// Find OpenMCT platform, fail if no platform found
let openmct_path = path.join(__dirname, "node_modules/openmct/dist");
if (package.dependencies.openmct.startsWith("file:")) {
    // overloading the openmct instance path
    openmct_path = path.join(__dirname, package.dependencies.openmct.replace(/^file:/, ''), "dist");
}
if (!fs.existsSync(openmct_path)) {
    throw Error("OpenMCT distribution folder '" + openmct_path+ "' does not exit");
}

// Find static path, create directory if it does not exist
var static_path = __dirname + '/static';
if (!fs.existsSync(static_path)) {
    fs.mkdirSync(static_path);
}

// Find plugin path, create directory if it does not exist
var plugin_path = __dirname + '/plugins';
if (!fs.existsSync(plugin_path)) {
    fs.mkdirSync(plugin_path);
}

/// ------------------------------------------------------------------------------------------------
/// Setup Express Paths
/// ------------------------------------------------------------------------------------------------

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json())                          // parse application/json
app.use('/static', express.static(static_path));    // For serving static files
app.use('/plugins', express.static(plugin_path));   // For serving plugins
app.use('/openmct', express.static(openmct_path));  // For serving openmct itself

/// ------------------------------------------------------------------------------------------------
/// Install Server-Side Plugins
/// ------------------------------------------------------------------------------------------------

if (package.plugins) {
    for (var pluginName in package.plugins) {
        var plugin = package.plugins[pluginName];
        if (plugin.server) {
            var module = require(__dirname + "/" + plugin.server);  // module should export a function
            if (typeof module === "function") {
                module(app);                                        // call the install function with the express app argument
                console.log("> Installed plugin " + pluginName);
            }
        } else {
            console.log("> Installed plugin " + pluginName);
        }
    }
}

/// ------------------------------------------------------------------------------------------------
/// Setup Express Default Routes
/// ------------------------------------------------------------------------------------------------

app.get('/', (req, res) => {
    res.render('index', package);
});

/// ------------------------------------------------------------------------------------------------
/// Start OpenMCT Server
/// ------------------------------------------------------------------------------------------------
const port = process.env.OPENMCT_PORT || 8080

app.listen(port, function () {
    console.log();
    console.log('Open MCT hosted at http://localhost:' + port);
});