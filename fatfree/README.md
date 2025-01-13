## POC for PHP package `bcosca/fatfree`

- Issue [#850](https://github.com/bcosca/fatfree/issues/850)
- [Repository](https://github.com/bcosca/fatfree)


### Steps to reproduce:

1. Install a vulnerable version of `bcosca/fatfree`: ```composer require bcosca/fatfree:3.8.0```
2. Run the exploit: ```php exploit.php```
3. You can see that the program outputs two html link tags with a valid/unsanitized `alert` in the `onclick` event.