<?php

namespace App\Http\Controllers;

use App\Http\Requests\PasswordUpdateRequest;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function editPassword(Request $request): Response
    {
        return Inertia::render('App/Setting/Profile/ChangePassword', [
            'user' => Auth::user(),
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function edit(Request $request): Response
    {
        return Inertia::render('App/Setting/Profile/ProfileEdit', [
            'user' => Auth::user()
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->safe()->except('avatar', 'email');
        $user->fill($data);
        $newEmail = $request->validated('email');

        if ($newEmail !== $user->email) {
            $user->newEmail($newEmail);
        }

        $user->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Dein Profil wurde erfolgreich geändert']);
        return Redirect::route('app.profile.edit');
    }

    public function updatePassword(PasswordUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->password = $request->validated('password');
        $user->setRememberToken(Str::random(60));
        $user->save();
        DB::table('sessions')
            ->where('user_id', $user->getAuthIdentifier())
            ->where('id', '!=', $request->session()->getId())
            ->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Dein Kennwort wurde erfolgreich geändert']);
        return Redirect::route('app.profile.change-password');
    }

    /**
     * Delete the user's account.
     */
}
