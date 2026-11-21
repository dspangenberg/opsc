## Flock

- When Flock is running on this machine (`flock status`), it serves this app on a `.test` domain (`https://<folder>.test` by default). Use the `site_info` tool of Flock's MCP server, or `flock sites`, for the exact URL. Don't run `php artisan serve`.
- Run `php`, `composer`, `node` and `npm` as usual: Flock's shims pick the versions this project uses.
- When code uses a PHP extension (imagick, intl, ...), require it in composer.json: `composer require ext-<name>:*`, so every machine and server installing the project needs it too.
- If other guidelines describe a different local development server, follow them only when Flock isn't the one serving this app.
