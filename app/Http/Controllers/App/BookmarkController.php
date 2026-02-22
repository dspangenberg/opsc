<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookmarkFolderRequest;
use App\Http\Requests\BookmarkPinRequest;
use App\Http\Requests\BookmarkRenameRequest;
use App\Http\Requests\BookmarkRequest;
use App\Models\Bookmark;
use App\Models\BookmarkFolder;
class BookmarkController extends Controller
{
    public function store(BookmarkRequest $request)
    {
        $data = $request->validated();
        $data['pos'] = 0;
        Bookmark::create($data);

        redirect()->back();
    }

    public function rename(BookmarkRenameRequest $request, Bookmark $bookmark)
    {
        $bookmark->update($request->validated());
        $bookmark->save();
    }

    public function togglePin(BookmarkPinRequest $request, Bookmark $bookmark)
    {
        ray($request->validated());

        $bookmark->update($request->validated());
        $bookmark->save();

        redirect()->back();
    }

    public function storeFolder(BookmarkFolderRequest $request)
    {
        $data = $request->validated();
        $data['pos'] = 0;
        BookmarkFolder::create($data);

        redirect()->back();
    }
}
