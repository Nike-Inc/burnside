# Change Log
Details on how to contribute to this changelog see the website
[Keep a change Log.](http://keepachangelog.com/) All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [0.3.2]
### Changed
- Replaces Unix `rm -rf` with the rmraf module for Windows development

## [0.3.1]
### Changed
- Updates the package.json description

## [0.3.0]
### Changed
- Refactors Burnside's internal execution logic back to realtime.
- Adds `{keepAlive: true}` and `burnside.close()` persistency options for long-running tests.

## [0.2.0]
# Added
- Added more explicit message for page load failures to differentiate it from normal command timeouts
- Adds Burnside's constants to its export list for easy validation by consumers
- Adds `wait` and `park` to Burnside's core function list
# Changed
- Updates the serialization of Burnside's results to use `JSON.stringify`

## [0.1.9]
# Changed
- Added more explicit message for page load failures to differentiate it from normal command timeouts
- Adds Burnside's constants to its export list for easy validation by consumers

## [0.1.8]
# Changed
- Refactored how function results are processed to fix an issue with Burnside-DOM

## [0.1.7]
# Changed
- MonoRepo conversion

## [0.1.6]
# Changed
- Refactored the Client handshake to fix issues encountered when loading over the Proxy

## [0.1.5]
# Changed
- Adding viewPort option to set client iframe

## [0.1.4]
# Changed
- Adds a warning if `Burnside.then()` method is not invoked in the test harness
- Adds 'disable-no-then-warning' optional rule to Burnside invocation
- Updates readme.md with links and Troubleshooting section

## [0.1.3]
# Changed
- Removes our configuration files from the published package
- Updates the basic example to include invocation of `then`

## [0.1.2]
# Changed
- Adds the wrapClient function to the export list of the Client interface for use by external injectors

## [0.1.1]
# Changed
- Moves the Client source back into the main source folder and adds it to global export list for use by injectors

## [0.1.0]
# Changed
- Merges the core modules into the core of Burnside and removes them from the export list

## [0.0.16]
# Added
- Exposed middleware on the Burnside configuration object

## [0.0.15]
# Changed
- Reverts the changes to test configuration

## [0.0.14]
# Changed
- Found a bug where the remote host wasn't working properly, this sets up the Burnside e2e testing to work for remote clients (with cors turned off)

# Added
- http-server to work with karma to serve up the app in karma.conf.js

# Removed
- code pointing to utils dirs in the karma.conf.js, and references to host param in the Navigator

## [0.0.13]
# Changed
- Upgrades the `use` API to accept single extension parameters or shorthand functions

## [0.0.12]
# Changed
- Removed the Node engine requirement

## [0.0.11]
# Changed
- Added 'clean', 'babel', and 'prepublish' steps to compile src/ for publishing as a node module

## [0.0.10]
# Changed
- Refactored the way the Client injects code and simplified dependencies
- Added a test with a Sinon injection example

## [0.0.9]
# Changed
- Refactored Burnside to a single library plus extensions

## [0.0.8]
# Changed
- updated lifecycle actions
- major clean up on reducer and api's

# Added
- redux-thunk
- observeStore.js for easier subscription management

# Removed
- redux-loop
- redux-actions

## [0.0.7]
# Added
- Click and eventing functionality to nightwatch extensions"

## [0.0.6]
### Added
- Fluent Script support via run

## [0.0.5]
### Change
- refactored immutable.js to use seamless-immutable

## [0.0.4]
### Changed
- updated Artifactory publish location (https protocol)

## [0.0.3]
### Major internal refactor
- Reimplements internal logic. Now powered by Redux!

## [0.0.2]
### Removing start timeout option
- Removing the start timeout and tests

## [0.0.1]
### Initial Release
- Initial release with loadDoc/loadUrl, then, exec, and wait API
