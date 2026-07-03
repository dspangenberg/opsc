<?php

namespace App\Http\Controllers\App\Setting;

use App\Data\ContactData;
use App\Data\ZugferdSettingData;
use App\Http\Controllers\Controller;
use App\Http\Requests\ZugferdSettingUpdateRequest;
use App\Models\Contact;
use App\Settings\ZugferdSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ZugferdSettingController extends Controller
{
    public function edit(Request $request)
    {
        $zugferdSettings = app(ZugferdSettings::class);

        $contacts = Contact::query()->with(['addresses.category', 'contacts'])->where('is_org', true)->orderBy('name')->get();

        return Inertia::render('App/Setting/ZugferdSetting/ZugferdSettingEdit', [
            'settings' => ZugferdSettingData::from($zugferdSettings),
            'contacts' => ContactData::collect($contacts),
        ]);
    }

    public function update(ZugferdSettingUpdateRequest $request): RedirectResponse
    {
        $zugferdSettings = app(ZugferdSettings::class);

        foreach ($request->validated() as $key => $value) {
            $zugferdSettings->{$key} = $value;
        }

        $zugferdSettings->save();

        return back()->with('success', 'Einstellung wurde erfolgreich aktualisiert.');
    }
}
