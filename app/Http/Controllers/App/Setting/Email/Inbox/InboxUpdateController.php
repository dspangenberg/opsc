<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Setting\Email\Inbox;

use App\Http\Controllers\Controller;
use App\Http\Requests\InboxRequest;
use App\Models\Inbox;

class InboxUpdateController extends Controller
{
    public function __invoke(InboxRequest $request, Inbox $inbox)
    {
        $inbox->update($request->validated());

        return redirect()->route('app.settings.email.inboxes');
    }
}
