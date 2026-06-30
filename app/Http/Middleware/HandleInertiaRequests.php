<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Middleware;

use App\Data\BookmarkData;
use App\Data\BookmarkFolderData;
use App\Data\DropboxData;
use App\Data\EmailAccountData;
use App\Data\TenantData;
use App\Data\TimeData;
use App\Data\UserData;
use App\Models\Bookmark;
use App\Models\BookmarkFolder;
use App\Models\Dropbox;
use App\Models\EmailAccount;
use App\Models\Time;
use App\Settings\GeneralSettings;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $tenant = tenant();

        $user = $request->user();

        $mailAccounts = [];
        $dropBoxes = [];
        $bookmarks = [];
        $bookmarkFolders = [];
        $runningTimer = [];
        $settings = null;
        if ($user) {
            $ids = [];
            $defaultMailAccount = EmailAccount::query()->where('is_default', true)->first();
            if ($defaultMailAccount) {
                $ids[] = $defaultMailAccount->id;
            }

            if ($user->email_account_id) {
                $ids[] = $user->email_account_id;
            }

            $settings = app(GeneralSettings::class);

            $mailAccounts = EmailAccount::query()->whereIn('id', $ids)->orderBy('email')->get();

            $runningTimer = $user ? Time::query()
                ->where('user_id', $user->id)
                ->whereNull('end_at')
                ->latest('begin_at')
                ->with(['category', 'project'])
                ->first() : null;

            $bookmarks = Bookmark::where('is_pinned', true)->whereNull('bookmark_folder_id')->orderBy('name')->get();
            $bookmarkFolders = BookmarkFolder::with('bookmarks')->orderBy('name')->get();

            $dropBoxes = Dropbox::query()->withCount(['mails' => function ($query) {
                $query->whereNull('seen_at');
            }])->where('user_id', $user->id)->orWhere('is_shared', true)->orderBy('name')->get();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? UserData::from($request->user()) : null,
                'tenant' => $request->user() ? tenant('id') ? TenantData::from($tenant) : [] : null,
                'runningTimer' => $runningTimer ? TimeData::from($runningTimer) : null,
                'bookmarks' => BookmarkData::collect($bookmarks),
                'bookmarkFolders' => BookmarkFolderData::collect($bookmarkFolders),
                'email_accounts' => count($mailAccounts) ? EmailAccountData::collect($mailAccounts) : [],
                'dropboxes' => count($dropBoxes) ? DropboxData::collect($dropBoxes) : [],
                'domain' => $request->getHost(),
                'is_accounting_enabled' => $settings?->is_accouting_enabled === 'true',
            ],
        ];
    }
}
