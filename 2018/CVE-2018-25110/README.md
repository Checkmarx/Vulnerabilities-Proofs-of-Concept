# POC for vulnerability in NPM package `marked`

- **Pull Request**: [#1083](https://github.com/markedjs/marked/pull/1083)
- **Package Repository**: [marked GitHub](https://github.com/markedjs/marked)
- **Package Manager**: [NPM marked](https://www.npmjs.com/package/marked)

## Steps to Reproduce

1. Install a vulnerable version of `marked`: ```npm install marked@0.3.16```
2. Execute the exploit demonstration: ```node index.js```
3. You can see from the counter that the application hangs and keeps running for a long time.
4. This proof-of-concept uses a real example file as default, however, other variations can be used to fully understand the vulnerability. Such as "redos_html_closing.md" and "redos_nolink.md".