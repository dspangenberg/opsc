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
use Stancl\Tenancy\UniqueIdentifierGenerators\RandomHexGenerator;

class InboxCreateController extends Controller
{
    public function __invoke()
    {

        $inbox = new Inbox;
        $hex = RandomHexGenerator::generate($inbox);

        $inbox->email_address = $hex.'+'.tenant('prefix').'@in.ooboo.cloud';
        $inbox->is_default = false;

        return Inertia::modal('App/Settings/Email/Inbox/InboxEdit', [
            'inbox' => InboxData::from($inbox),
        ])->baseRoute('app.settings.email.inboxes');
    }
}
