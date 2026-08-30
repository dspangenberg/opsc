---
paths:
  - app/Http/Controllers/App/TodoController.php
---

# App

## Authorize Todo mutations via TodoPolicy update
TodoController::complete/uncomplete call $this->authorize('update', $todo) before saving. TodoPolicy::update grants access when the authenticated user is the Todo's created_by_user_id OR assigned_to_user_id. Feature tests live in tests/Feature/TodoControllerTest.php: they create a single shared tenant once per test run and run `tenants:migrate` on it only the first time, then reuse that tenant database for every test in the file (unlike ProjectControllerTest, which migrates a fresh tenant before each test).
