<?php

namespace App\Http\Controllers\App;

use App\Data\TodoData;
use App\Http\Controllers\Controller;
use App\Http\Requests\TodoRequest;
use App\Models\Todo;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TodoController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        $todos = Todo::query()
            /*
            ->where(fn ($query) => $query
                ->where('created_by_user_id', auth()->id())
                ->orWhere('assigned_to_user_id', auth()->id())
            )
            */
            ->with(['assigned_to', 'created_by', 'todoable'])
            ->paginate();

        return Inertia::render('App/Todo/TodoIndex', [
            'todos' => TodoData::collect($todos),
        ]);
    }

    public function store(TodoRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['created_by_user_id'] = auth()->id();

        Todo::create($data);

        return redirect()->back();
    }

    public function complete(Todo $todo): RedirectResponse
    {
        $this->authorize('update', $todo);

        $todo->completed_at = now();
        $todo->save();

        return redirect()->back();
    }

    public function uncomplete(Todo $todo): RedirectResponse
    {
        $this->authorize('update', $todo);

        $todo->completed_at = null;
        $todo->save();

        return redirect()->back();
    }
}
