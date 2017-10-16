Burnside OSS TODO

Team Members need to:

  - Engage the OSS group and find a Champion (Done: Thomas Lockney)
  - Sign up for `@nike.com` enabled GitHub account and get for Nike Organization access (Recommendation: Just Do It)
  - Read Code of Conduct for working in Open Source (Recommendation: Just Do It)
    - https://confluence.nike.com/display/OSS/Nike+Open+Source+Code+of+Conduct
  - Decide on maintainer (Recommendation: agreement)
  - Nike Patent Review (Recommendation: new Story)
    - We need to review with Nike if there is any patentable technology prior to Release
  - Draft a submission to the OSS process explaining what Burnside does and why (Recommendation: new Story)
    - Example: https://jira.nike.com/browse/OSS-55
  - Come to team agreement on Architecture Scope (and/or non-scoped pre-work items) for OSS Burnside v0.1.0

The Burnside Project will need the following updates:

  - __Nike Specific Scrub__ (Recommendation: new Story)
    - We should remove all Nike-specific default configuration

  - `Readme.md` (Recommendation: new Story)
    - + TODO Section
    - + Legal License section
    - + Contribution section

  - `LICENSE.txt` selected and committed (Recommendation: new Story or agreement)
      - Pick a license from the three approved (MIT, BSD, Apache)
        - https://help.github.com/articles/open-source-licensing/
        - Add reference to it to `package.json`

  - `travis.yml` written and tested (Recommendation: new Story)
    - Open Source projects used `travis` to run tests. We need to create a `travis.yml` to run tests, coverage, and linting
    - Identify Target machine configurations for testing against
    - https://confluence.nike.com/display/OSS/How+to+Contribute+to+Open+Source+at+Nikes

  - `API.md`? (Recommendation: Skip)
    - We should include basic API documentation. May be handled by the Readme.

  - Physically moved to the Github platform
