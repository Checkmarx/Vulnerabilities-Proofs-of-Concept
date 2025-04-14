# POC for Vulnerability in NPM package `sanitize-html`

- **Issue**: [#1](https://github.com/apostrophecms/sanitize-html/issues/1)
- **Package Repository**: [sanitize-html GitHub](https://github.com/apostrophecms/sanitize-html)
- **Package Manager**: [NPM sanitize-html](https://www.npmjs.com/package/sanitize-html)

## Steps to Reproduce

1. Install a vulnerable version of `sanitize-html`: ```npm install sanitize-html@1.0.1```
2. Run the demonstration server: ```node index.js```
3. In the browser, navigate to ```http://localhost:3000```
4. Check that if you click any of the links, Javascript alert popup is triggered.