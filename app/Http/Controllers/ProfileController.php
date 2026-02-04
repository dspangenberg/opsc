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
use Plank\Mediable\Exceptions\MediaUpload\ConfigurationException;
use Plank\Mediable\Exceptions\MediaUpload\FileExistsException;
use Plank\Mediable\Exceptions\MediaUpload\FileNotFoundException;
use Plank\Mediable\Exceptions\MediaUpload\FileNotSupportedException;
use Plank\Mediable\Exceptions\MediaUpload\FileSizeException;
use Plank\Mediable\Exceptions\MediaUpload\ForbiddenException;
use Plank\Mediable\Exceptions\MediaUpload\InvalidHashException;
use Plank\Mediable\Facades\MediaUploader;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function editPassword(Request $request): Response
    {
        return Inertia::render('App/Profile/ChangePassword', [
            'user' => Auth::user(),
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function edit(): Response
    {
        return Inertia::render('App/Profile/ProfileEdit', [
            'user' => Auth::user(),
        ]);
    }

    public function resendVerificationEmail(Request $request): RedirectResponse
    {
        $request->user()->resendPendingEmailVerificationMail();
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Bestätigungs-E-Mail wurde erneut gesendet.']);
        return Redirect::back();
    }

    public function clearPendingMailAddress(Request $request)
    {
        $request->user()->clearPendingEmail();
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Die Änderung der E-Mail-Adresse wurde zurückgesetzt.']);
        return redirect()->back();
    }

    /**
     * Update the user's profile information.
     * @param  ProfileUpdateRequest  $request
     * @return RedirectResponse
     * @throws ConfigurationException
     * @throws FileExistsException
     * @throws FileNotFoundException
     * @throws FileNotSupportedException
     * @throws FileSizeException
     * @throws ForbiddenException
     * @throws InvalidHashException
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->safe()->except('avatar', 'email', 'remove_avatar');
        $user->fill($data);
        $newEmail = $request->validated('email');

        if ($newEmail !== $user->email) {
            $user->newEmail($newEmail);
            $user->email_verified_at = null;
        }

        $user->save();

        if ($request->hasFile('avatar')) {
            $user->detachMediaTags('avatar');

            $media = MediaUploader::fromSource($request->file('avatar'))
                ->toDestination('s3', 'avatars/users')
                ->upload();

            $user->attachMedia($media, 'avatar');
        }  else {
            if ($request->input('remove_avatar', false)) {
                if ($user->firstMedia('avatar')) {
                    $user->detachMediaTags('avatar');
                }
            }
        }

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
}
