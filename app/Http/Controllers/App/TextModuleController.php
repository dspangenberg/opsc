<?php

namespace App\Http\Controllers\App;

use App\Data\TextModuleData;
use App\Http\Controllers\Controller;
use App\Http\Requests\TextModuleRequest;
use App\Models\TextModule;
use Inertia\Inertia;

class TextModuleController extends Controller
{
    public function index()
    {
        $modules = TextModule::query()->orderBy('title')->paginate();
        return Inertia::render('App/TextModule/TextModuleIndex', [
            'modules' => TextModuleData::collect($modules),
        ]);
    }

    public function create() {
        $module = new TextModule();
        return Inertia::render('App/TextModule/TextModuleEdit', [
            'module' => TextModuleData::from($module),
        ]);
    }

    public function edit(TextModule $module) {
        return Inertia::render('App/TextModule/TextModuleEdit', [
            'module' => TextModuleData::from($module),
        ]);
    }

    public function update(TextModuleRequest $request, TextModule $module) {
        $module->update($request->validated());
        return redirect()->route('app.setting.text-module.index');
    }

    public function delete(TextModule $module) {
        $module->delete();
        return redirect()->route('app.setting.text-module.index');
    }

    public function store(TextModuleRequest $request) {
        TextModule::create($request->validated());
        return redirect()->route('app.setting.text-module.index');
    }
}
