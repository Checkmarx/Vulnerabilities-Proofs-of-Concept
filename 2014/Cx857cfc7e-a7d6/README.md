
# POC for Vulnerability in PHP package `mikecao/flight`

- PR: [#125](https://github.com/flightphp/core/pull/125)
- Package Repository: [flightphp GitHub](https://github.com/flightphp/core)
- Package Manager: [PHP mikecao/flight](https://packagist.org/packages/mikecao/flight)
- Fix commit: [da40e03](https://github.com/flightphp/core/commit/da40e03eb4a39745107912dffe926a8fce0d38dc)

## System Requirements

### Hardware
- MacBook Pro 2020 with macOS Sequoia 15.3.1 
- Processor: 2.3 GHz Quad-Core Intel Core i7
- Memory: 32 GB RAM

### Software
- PHP PHP 5.6.40 (cli)
- PHP-FPM 5.6
- nginx 1.27.4
- Homebrew


## Steps to Reproduce

1. Initialize a new Composer project: `composer init`
2. Install a vulnerable version of `mikecao/flight` using Composer: `composer require mikecao/flight:v1.1.10`
3. Set the nginx server with the following configurations:
* Server is running on 127.0.0.1:4444
* `client_max_body_size 128M`
4. Keep the default PHP-FPM config  `pm.max_children = 5` and PHP `memory_limit = 128M`
5. Start the nginx and php-fpm services using `brew services start nginx` and `brew services start php@5.6`
6. Confirm that the endpoint `PUT /vulnerable` is accessible 
7. Use the `client.py` to simulate an attack where 100 concurrent requests are sent using ThreadPool each with 100Mb body
8. Monitor the memory and CPU consumption. It can be seen that with the help of one client who uses threading we were able to increase memory and CPU consumption significantly.