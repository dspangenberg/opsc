<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Http\Requests\TodoRequest;
use App\Models\Todo;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;

class TodoController extends Controller
{
    public function store(TodoRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['created_by_user_id'] = auth()->id();

        if (! empty($data['due_at'])) {
            $data['due_at'] = Carbon::createFromFormat('d.m.Y H:i', $data['due_at'])->format('Y-m-d H:i:s');
        }

        Todo::create($data);

        return redirect()->back();
    }
}
