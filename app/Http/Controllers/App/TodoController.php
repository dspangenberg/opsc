<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Http\Requests\TodoRequest;
use App\Models\Todo;
use Illuminate\Http\RedirectResponse;

class TodoController extends Controller
{
    public function store(TodoRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['created_by_user_id'] = auth()->id();
        Todo::create($data);

        return redirect()->back();
    }
}
