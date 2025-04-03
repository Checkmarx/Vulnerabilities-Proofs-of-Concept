# POC for Vulnerability in NPM package `validator`

- **Pull Request**: [#503](https://github.com/validatorjs/validator.js/pull/503)
- **Package Repository**: [validator.js GitHub](https://github.com/validatorjs/validator.js)
- **Package Manager**: [NPM validator](https://www.npmjs.com/package/validator)

## Steps to Reproduce:

1. Install the local dependencies: ```npm install```
2. Start the application locally: ```node index.js```
3. Observe the console output and you'll see that the application crashed with a ```RangeError: Maximum call stack size exceeded``` error