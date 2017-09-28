# Change Log
Details on how to contribute to this changelog see the website
[Keep a change Log.](http://keepachangelog.com/) All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [0.3.0]
### Initial Release
- Bumping minor version to match Core's bump

## [0.2.4]
### Added
- Adds `burnside-firefox` to the list of browsers available for testing
### Changed
- Refactors the localproxy logging to `DEBUG` output only, adds request interception to output

## [0.2.3]
### Changed
- switches use of rc for cosmiconfig for configuration discovery

## [0.2.2]
### Changed
- bumps the Burnside dependency

## [0.2.1]
### Changed
- Adds support for HTML fragment testing (fixes missing <head> tag failure)
- Adds `method` filtering to Response interception to keep it consistent with Request interception

## [0.2.0]
### Changed
- Adds optional list of methods for intercepting. Prevents interference when POSTing by defaulting the interception to only GET and OPTIONS

## [0.1.11]
### Changed
- Adjusts the way the proxy intercepts responses to remove the body parsing
- Fixes CORS for non-html requests that go through the proxy by filtering less aggressively

## [0.1.10]
### Changed
- Fixes CORS with a '*' header.

## [0.1.9]
### Changed
- Fixed error with a completely missing config with a default param value
- Adds automatic check for Burnside-DOM

## [0.1.8]
### Changed
- Bumped version to match root

## [0.1.3]
### Added
- Added support for custom headers to Proxy

## [0.1.2]
### Changed
- Strip x-frame-options header instead of using poorly supported allow
  value

## [0.1.1]
### Initial Release
- Initial release with Proxy
