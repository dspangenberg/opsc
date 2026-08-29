# Project Rules Index

Before planning or editing, find the row whose globs match the file's path and read that rule file. When multiple rows match, the most specific mapping takes precedence: explicit-path rows (e.g. `app/Http/Controllers/App/TodoController.php`, `resources/js/app.tsx`) select app.md / js.md over the broad `**/*` entry, which is only a fallback.

| Applies to | Rule file |
| --- | --- |
| app/Http/Controllers/App/TodoController.php | .ai/rules/app.md |
| **/* | .ai/rules/general.md |
| resources/js/app.tsx | .ai/rules/js.md |
