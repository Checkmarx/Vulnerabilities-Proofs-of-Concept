# POC for Vulnerability in NPM package `jsonwebtoken`

- **Issue**: [#13](https://github.com/auth0/node-jsonwebtoken/issues/13)
- **Package Repository**: [jsonwebtoken GitHub](https://github.com/auth0/node-jsonwebtoken)
- **Package Manager**: [NPM jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

## Steps to Reproduce

1. Install a vulnerable version of `jsonwebtoken`: ```npm install jsonwebtoken@0.4.0```
2. Run the exploit: ```node exploit.js```
3. Check that the verify function successfully returns the decoded unsigned JWT, which was issued with the None algorithm and without a signature.