<?php

namespace App\Http\Controllers\App;

use App\Data\ContactData;
use App\Data\ProjectCategoryData;
use App\Data\ProjectData;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectRequest;
use App\Models\Contact;
use App\Models\Project;
use App\Models\ProjectCategory;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::query()->with(['category', 'owner'])->where('is_archived', false)->orderBy('name')->paginate();
        return Inertia::render('App/Project/ProjectIndex', [
            'projects' => ProjectData::collect($projects),
        ]);
    }

    public function create() {
        $project = new Project();
        $categories = ProjectCategory::query()->orderBy('name')->get();
        $contacts = Contact::query()->orderBy('name')->orderBy('first_name')->get();

        return Inertia::render('App/Project/ProjectEdit', [
            'project' => ProjectData::from($project),
            'categories' => ProjectCategoryData::collect($categories),
            'contacts' => ContactData::collect($contacts),
        ]);
    }

    public function show(Project $project) {
        $project->load(['category', 'owner']);

        return Inertia::render('App/Setting/TextModule/TextModuleEdit', [
            'project' => ProjectData::from($project)
        ]);
    }
    public function edit(Project $project) {
        $categories = ProjectCategory::query()->orderBy('name')->get();
        $contacts = Contact::query()->orderBy('name')->orderBy('first_name')->get();

        return Inertia::render('App/Project/ProjectEdit', [
            'project' => ProjectData::from($project),
            'categories' => ProjectCategoryData::collect($categories),
            'contacts' => ContactData::collect($contacts),
        ]);
    }

    public function update(ProjectRequest $request, Project $project) {
        $project->update($request->validated());
        return redirect()->route('app.project.index');
    }

    public function trash(Project $project) {
        $project->delete();
        return redirect()->route('app.project.index');
    }

    public function store(ProjectRequest $request) {
        Project::create($request->validated());
        return redirect()->route('app.project.index');
    }
}
