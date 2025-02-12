# POC for Vulnerability in NPM package `debug`

- **Issue**: [#737](https://github.com/debug-js/debug/issues/737)
- **Package Repository**: [debug GitHub](https://github.com/debug-js/debug)
- **Package Manager**: [NPM debug](https://www.npmjs.com/package/debug)

## Steps to Reproduce

1. Install a vulnerable version of `debug`: ```npm i debug@2.6.9```
2. Run the exploit: ```node exploit.js```
3. You can see that the program stalls and never reaches the second console.log.