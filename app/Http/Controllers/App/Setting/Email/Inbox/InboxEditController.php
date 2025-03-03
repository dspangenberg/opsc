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

class InboxEditController extends Controller
{
    public function __invoke(Inbox $inbox)
    {

        return Inertia::render('App/Settings/Email/Inbox/InboxEdit', [
            'inbox' => InboxData::from($inbox)
        ]);
    }
}
