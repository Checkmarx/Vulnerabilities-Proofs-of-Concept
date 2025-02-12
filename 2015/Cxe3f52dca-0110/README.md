# POC for Vulnerability in NPM package `sequelize`

- **Issue**: [#4680](https://github.com/sequelize/sequelize/issues/4680)
- **Package Repository**: [Sequelize GitHub](https://github.com/sequelize/sequelize)
- **Package Manager**: [NPM Sequelize](https://www.npmjs.com/package/sequelize)

## Steps to Reproduce:

1. Install the local dependencies: ```npm install```
2. Start the website locally: ```node index.js```
3. In the browser, navigate to ```http://localhost:3000```
4. In the search functionality, search for `$password$`
5. See that all users whose username equals their password are displayed.