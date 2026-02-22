<?php

namespace Tests\Unit;

use App\Models\Bookmark;
use App\Models\BookmarkFolder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookmarkFolderTest extends TestCase
{
    use RefreshDatabase;

    public function test_bookmark_folder_has_many_bookmarks_relationship()
    {
        // Create a bookmark folder
        $folder = BookmarkFolder::create([
            'name' => 'Test Folder',
            'pos' => 1,
        ]);

        // Create bookmarks belonging to this folder
        $bookmark1 = Bookmark::create([
            'name' => 'Test Bookmark 1',
            'model' => 'TestModel',
            'route_name' => 'test.route',
            'route_params' => [],
            'is_pinned' => false,
            'bookmark_folder_id' => $folder->id,
            'pos' => 1,
        ]);

        $bookmark2 = Bookmark::create([
            'name' => 'Test Bookmark 2',
            'model' => 'TestModel',
            'route_name' => 'test.route',
            'route_params' => [],
            'is_pinned' => false,
            'bookmark_folder_id' => $folder->id,
            'pos' => 2,
        ]);

        // Test the relationship
        $this->assertInstanceOf(Bookmark::class, $folder->bookmarks->first());
        $this->assertCount(2, $folder->bookmarks);
        $this->assertEquals('Test Bookmark 1', $folder->bookmarks->first()->name);
        $this->assertEquals('Test Bookmark 2', $folder->bookmarks->last()->name);
    }

    public function test_bookmark_folder_can_be_loaded_with_bookmarks()
    {
        // Create a bookmark folder
        $folder = BookmarkFolder::create([
            'name' => 'Test Folder',
            'pos' => 1,
        ]);

        // Create a bookmark belonging to this folder
        Bookmark::create([
            'name' => 'Test Bookmark',
            'model' => 'TestModel',
            'route_name' => 'test.route',
            'route_params' => [],
            'is_pinned' => false,
            'bookmark_folder_id' => $folder->id,
            'pos' => 1,
        ]);

        // Test eager loading
        $folderWithBookmarks = BookmarkFolder::with('bookmarks')->find($folder->id);
        
        $this->assertNotNull($folderWithBookmarks);
        $this->assertCount(1, $folderWithBookmarks->bookmarks);
        $this->assertEquals('Test Bookmark', $folderWithBookmarks->bookmarks->first()->name);
    }
}