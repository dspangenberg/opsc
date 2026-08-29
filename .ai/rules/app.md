---
paths:
  - app/Http/Controllers/App/TodoController.php
---

# App

## Authorize Todo mutations via TodoPolicy update
TodoController::complete/uncomplete call $this->authorize('update', $todo) before saving. TodoPolicy::update grants access when the authenticated user is the Todo's created_by_user_id OR assigned_to_user_id. Feature tests live in tests/Feature/TodoControllerTest.php and use the stancl tenancy setup (tenants:migrate per test) like ProjectControllerTest.
