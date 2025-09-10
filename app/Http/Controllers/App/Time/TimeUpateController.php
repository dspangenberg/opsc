<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Time;

use App\Http\Controllers\Controller;
use App\Http\Requests\TimeStoreRequest;
use App\Models\Time;

class TimeUpateController extends Controller
{
    public function __invoke(TimeStoreRequest $request, Time $time)
    {
        $validatedData = $request->validated();

        $time->update($validatedData);

        $baseRoute = $request->query('view', 'my-week') === 'my-week' ? 'app.time.my-week' : 'app.time.index';

        return redirect()->route($baseRoute);
    }
}
