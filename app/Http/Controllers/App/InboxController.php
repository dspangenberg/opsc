<?php

namespace App\Http\Controllers\App;

use App\Data\InboxEntryData;
use App\Http\Controllers\Controller;
use App\Models\InboxEntry;
use Inertia\Inertia;

class InboxController extends Controller
{
    public function index()
    {
        $mails = InboxEntry::query()->where('user_id', auth()->id())->orderBy('sent_at', 'desc')->paginate();
        return Inertia::render('App/Inbox/InboxIndex', [
            'mails' => InboxEntryData::collect($mails),
        ]);
    }

}
