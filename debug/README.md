## POC for NPM package `debug`

- Issue [#737](https://github.com/debug-js/debug/issues/737)
- [Repository](https://github.com/debug-js/debug)


### Steps to reproduce:

1. Install a vulnerable version of `debug`: ```npm i debug@2.6.9```
2. Run the exploit: ```node exploit.js```
3. You can see that the program never reaches the second console.log.