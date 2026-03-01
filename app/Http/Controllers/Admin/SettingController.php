<?php

namespace App\Http\Controllers\Admin;

use App\Data\SettingData;
use App\Http\Controllers\Controller;
use App\Http\Requests\SettingUpdateRequest;
use App\Settings\GeneralSettings;
use App\Settings\InvoiceReminderSettings;
use App\Settings\MailSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index(Request $request)
    {
        $generalSettings = app(GeneralSettings::class);
        $invoiceReminderSettings = app(InvoiceReminderSettings::class);
        $mailSettings = app(MailSettings::class);

        $settingsCollection = collect([
            $generalSettings,
            $invoiceReminderSettings,
            $mailSettings
        ])->flatMap(function ($settings) {
            $group = $settings::group();

            return collect($settings->toArray())
                ->filter(function ($value, $key) use ($group) {
                    return ! ($group === 'general' && $key === 'pdf_global_css');
                })
                ->map(function ($value, $key) use ($group) {
                    return [
                        'group' => $group,
                        'key' => $key,
                        'value' => $value,
                    ];
                });
        })->values();

        $perPage = 20;
        $currentPage = (int) $request->input('page', 1);

        $paginatedSettings = new LengthAwarePaginator(
            $settingsCollection->forPage($currentPage, $perPage)->values(),
            $settingsCollection->count(),
            $perPage,
            $currentPage,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        $paginatedSettings->appends($request->query());

        return Inertia::render('Admin/Setting/SettingIndex', [
            'settings' => SettingData::collect($paginatedSettings),
        ]);
    }

    public function update(SettingUpdateRequest $request): RedirectResponse
    {
        $group = $request->validated('group');
        $key = $request->validated('key');
        $value = $request->validated('value');

        $settingsClass = match ($group) {
            'general' => GeneralSettings::class,
            'invoice_reminders' => InvoiceReminderSettings::class,
            'mail' => MailSettings::class,
            default => null,
        };

        if (! $settingsClass) {
            return back()->withErrors(['group' => 'Ungültige Einstellungsgruppe.']);
        }

        $settings = app($settingsClass);

        if (! property_exists($settings, $key)) {
            return back()->withErrors(['key' => 'Ungültiger Einstellungsschlüssel.']);
        }

        $settings->$key = $value;
        $settings->save();

        return back()->with('success', 'Einstellung wurde erfolgreich aktualisiert.');
    }
}
