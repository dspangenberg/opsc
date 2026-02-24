<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookmarkFolderRequest;
use App\Http\Requests\BookmarkPinRequest;
use App\Http\Requests\BookmarkRenameRequest;
use App\Http\Requests\BookmarkRequest;
use App\Models\Bookmark;
use App\Models\BookmarkFolder;
use Illuminate\Http\RedirectResponse;

class BookmarkController extends Controller
{
    public function store(BookmarkRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['pos'] = 0;
        Bookmark::create($data);

        return redirect()->back();
    }

    public function rename(BookmarkRenameRequest $request, Bookmark $bookmark): RedirectResponse
    {
        $bookmark->update($request->validated());
        return redirect()->back();
    }

    public function togglePin(BookmarkPinRequest $request, Bookmark $bookmark): RedirectResponse
    {
        $bookmark->update($request->validated());
        return redirect()->back();
    }

    public function trash(Bookmark $bookmark): RedirectResponse {
        $bookmark->delete();
        return redirect()->back();
    }

    public function restore(Bookmark $bookmark): RedirectResponse {
        $bookmark->restore();
        return redirect()->back();
    }

    public function storeFolder(BookmarkFolderRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['pos'] = 0;
        BookmarkFolder::create($data);

        return redirect()->back();
    }
}
