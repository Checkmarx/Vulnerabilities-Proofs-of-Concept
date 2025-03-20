# POC for Vulnerability in PHP package `monolog/monolog`

- Issue: [#458](https://github.com/Seldaek/monolog/issues/458)
- PR: [#448](https://github.com/Seldaek/monolog/pull/448)
- Package Repository: [monolog GitHub](https://github.com/Seldaek/monolog)
- Package Manager: [PHP monolog/monolog](https://packagist.org/packages/monolog/monolog)

## Steps to Reproduce

1. Initialize a new Composer project: `composer init`
2. Install a vulnerable version of `monolog/monolog` using Composer: `composer require monolog/monolog:1.11.0`
3. Set the `$to` and `$from` params of the `NativeMailerHandler` in the `index.php` file
4. Set a valid accesible email address in the setters (`setContentType()` or `setEncoding()`) for the purpose of the PoC 
5. Run the exploit: `php index.php`
6. Confirm that the email address mentioned in the setters methods after newline characters `\r\n` received the email
