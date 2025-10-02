<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Http\Requests\NoteStoreRequest;
use Illuminate\Support\Str;
class NotableController extends Controller
{
    protected function getModel(string $tableName, int $id)
    {
        $className = 'App\Models\\' . Str::studly(Str::singular($tableName));
        if (class_exists($className)) {
            return $className::findOrFail($id);
        }
        return null;
    }
    public function store(NoteStoreRequest $request, string $tableName, int $id)
    {
        $model = $this->getModel($tableName, $id);
        if ($model) {
            $model->addNote($request->validated('note'), auth()->user());
        }
        redirect()->back();
    }

    public function update(NoteStoreRequest $request, string $tableName, int $id, int $noteId)
    {

        $model = $this->getModel($tableName, $id);
        if ($model) {
            $model->updateNote($noteId, $request->validated('note'));
        }
        redirect()->back();
    }

    public function destroy(string $tableName, int $id, int $noteId)
    {

        $model = $this->getModel($tableName, $id);
        if ($model) {
            $model->deleteNote($noteId);
        }
        redirect()->back();
    }
}
