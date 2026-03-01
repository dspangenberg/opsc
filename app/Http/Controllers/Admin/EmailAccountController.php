<?php

namespace App\Http\Controllers\Admin;

use App\Data\EmailAccountData;
use App\Http\Controllers\Controller;
use App\Http\Requests\EmailAccountStoreRequest;
use App\Http\Requests\EmailAccountUpdateRequest;
use App\Models\EmailAccount;
use App\Models\EmailTemplate;
use App\Services\SendEmailAsTenantService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EmailAccountController extends Controller
{
    public function index(): Response
    {
        $email_accounts = EmailAccount::query()->orderBy('email')->paginate();
        return Inertia::render('Admin/EmailAccount/EmailAccountIndex', [
            'email_accounts' => EmailAccountData::collect($email_accounts),
        ]);
    }

    public function create(): Response {
        $email_account = new EmailAccount();
        $email_account->email = '';
        $email_account->name = '';
        $email_account->smtp_username = '';
        $email_account->smtp_password = '';
        $email_account->signature = '';
        $email_account->is_default = false;
        return Inertia::render('Admin/EmailAccount/EmailAccountEdit', [
            'email_account' => EmailAccountData::from($email_account),
        ]);
    }

    public function edit(EmailAccount $emailAccount): Response {
        return Inertia::render('Admin/EmailAccount/EmailAccountEdit', [
            'email_account' => EmailAccountData::from($emailAccount),
        ]);
    }

    public function update(EmailAccountUpdateRequest $request, EmailAccount $emailAccount): RedirectResponse {
        $data = $request->safe()->except('smtp_password');

        $emailAccount->update($data);
        if ($request->validated('smtp_password')) {
            $emailAccount->smtp_password = $request->validated('smtp_password');
            $emailAccount->save();
        }

        return redirect()->route('admin.email-account.index');
    }

    public function sendTestMail(EmailAccount $emailAccount) {
        $template = EmailTemplate::where('name', 'test')->first();
        $mailer = new SendEmailAsTenantService($template, $emailAccount);
        $mailer->sendEmail(auth()->user()->email, 'Test User', 'Test City', []);

        return redirect()->back();
    }

    public function setDefault(EmailAccount $emailAccount): RedirectResponse {
        EmailAccount::query()->update(['is_default' => false]);
        $emailAccount->is_default = true;
        $emailAccount->save();
        return redirect()->back();
    }


    public function destroy(EmailAccount $email_account): RedirectResponse {
        $email_account->delete();
        return redirect()->route('admin.email-account.index');
    }


    public function store(EmailAccountStoreRequest $request): RedirectResponse {
        EmailAccount::create($request->validated());
        return redirect()->route('admin.email-account.index');
    }

}
