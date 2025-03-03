<?php
/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Setting\Email\Inbox;

use App\Data\InboxData;
use App\Http\Controllers\Controller;
use App\Models\Inbox;
use Inertia\Inertia;

class InboxIndexController extends Controller
{
    public function __invoke()
    {
        $inboxes = Inbox::orderBy('is_default', 'DESC')->orderBy('name')->get();

        return Inertia::render('App/Settings/Email/Inbox/InboxIndex', [
            'inboxes' => InboxData::collect($inboxes)
        ]);
    }
}
