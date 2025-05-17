<?php

namespace App\Http\Controllers\Cloud\Register;

use App\Facades\CloudRegisterService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VerifyMailAddressAndCredentialsController
{
    public function __invoke(Request $request)
    {
        if (! $request->hasValidSignature()) {
            abort(500, 'Der Bestätigungslink ist leider ungültig oder bereits abgelaufen.');
        }

        $tenant = CloudRegisterService::verifyEmailAddressAndCredentials($request->hid);
        $tenant['hid'] = $request->hid;

        return Inertia::render('Cloud/RegisterCredentials', [
            'registrationData' => $tenant,
        ]);
    }
}
