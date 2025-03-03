<?php

namespace App\Http\Controllers\Cloud\Register;

use App\Facades\CloudRegisterService;
use App\Http\Requests\RegisterStoreRequest;

class TemporaryStoreRegistrationController
{
    public function __invoke(RegisterStoreRequest $request)
    {
        CloudRegisterService::storeRegistrationTemporary($request->validated());
        return inertia('Cloud/RegisterMailSend');
    }
}
