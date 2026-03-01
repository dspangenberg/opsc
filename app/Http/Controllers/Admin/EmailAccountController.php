<?php

namespace App\Http\Controllers\Admin;

use App\Data\EmailAccountData;
use App\Http\Controllers\Controller;
use App\Http\Requests\EmailAccountStoreRequest;
use App\Http\Requests\EmailAccountUpdateRequest;
use App\Models\Contact;
use App\Models\EmailAccount;
use App\Models\EmailTemplate;
use App\Services\SendEmailAsTenantService;
use Inertia\Inertia;

class EmailAccountController extends Controller
{
    public function index()
    {
        $email_accounts = EmailAccount::query()->orderBy('email')->paginate();
        return Inertia::render('Admin/EmailAccount/EmailAccountIndex', [
            'email_accounts' => EmailAccountData::collect($email_accounts),
        ]);
    }

    public function create() {
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

    public function edit(EmailAccount $emailAccount) {
        return Inertia::render('Admin/EmailAccount/EmailAccountEdit', [
            'email_account' => EmailAccountData::from($emailAccount),
        ]);
    }

    public function update(EmailAccountUpdateRequest $request, EmailAccount $emailAccount) {
        $data = $request->safe()->except('smtp_password');

        $emailAccount->update($data);
        if ($request->validated('smtp_password')) {
            $emailAccount->smtp_password = $request->validated('smtp_password');
            $emailAccount->save();
        }

        $emailAccount->update($request->validated());
        return redirect()->route('admin.email-account.index');
    }

    public function sendTestMail(EmailAccount $emailAccount) {
        $template = EmailTemplate::where('name', 'test')->first();
        $mailer = new SendEmailAsTenantService($template, $emailAccount);
        $mailer->sendEmail('info@twiceware.de', 'Test User', 'Test City', []);


        return redirect()->back();
    }


    public function destroy(EmailAccount $email_account) {
        $email_account->delete();
        return redirect()->route('admin.email-account.index');
    }


    public function store(EmailAccountStoreRequest $request) {
        EmailAccount::create($request->validated());
        return redirect()->route('admin.email-account.index');
    }

}
