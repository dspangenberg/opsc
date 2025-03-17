<?php
/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Contact;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Maize\Markable\Models\Favorite;

class ContactToggleFavoriteController extends Controller
{
    public function __invoke(Contact $contact)
    {
        Favorite::toggle($contact, auth()->user());
    }
}
