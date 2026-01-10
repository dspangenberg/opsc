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
use Plank\Mediable\Exceptions\MediaUpload\ConfigurationException;
use Plank\Mediable\Exceptions\MediaUpload\FileExistsException;
use Plank\Mediable\Exceptions\MediaUpload\FileNotFoundException;
use Plank\Mediable\Exceptions\MediaUpload\FileNotSupportedException;
use Plank\Mediable\Exceptions\MediaUpload\FileSizeException;
use Plank\Mediable\Exceptions\MediaUpload\ForbiddenException;
use Plank\Mediable\Exceptions\MediaUpload\InvalidHashException;
use Plank\Mediable\Facades\MediaUploader;

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
        $project->load(['category', 'owner', 'manager']);

        return Inertia::render('App/Project/ProjectDetails', [
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

    /**
     * @throws FileNotSupportedException
     * @throws FileExistsException
     * @throws ForbiddenException
     * @throws FileNotFoundException
     * @throws FileSizeException
     * @throws InvalidHashException
     * @throws ConfigurationException
     */
    public function update(ProjectRequest $request, Project $project) {
        $data = $request->safe()->except('avatar');
        $project->update($data);

        if ($request->hasFile('avatar')) {
            $project->detachMediaTags('avatar');

            $media = MediaUploader::fromSource($request->file('avatar'))
                ->toDestination('s3', 'avatars/projects')
                ->upload();

            $project->attachMedia($media, 'avatar');
        }

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
