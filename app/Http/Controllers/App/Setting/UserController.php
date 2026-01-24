<?php

namespace App\Http\Controllers\App\Setting;

use App\Data\UserData;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserUpdateRequest;
use App\Models\User;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Plank\Mediable\Exceptions\MediaUpload\ConfigurationException;
use Plank\Mediable\Exceptions\MediaUpload\FileExistsException;
use Plank\Mediable\Exceptions\MediaUpload\FileNotFoundException;
use Plank\Mediable\Exceptions\MediaUpload\FileNotSupportedException;
use Plank\Mediable\Exceptions\MediaUpload\FileSizeException;
use Plank\Mediable\Exceptions\MediaUpload\ForbiddenException;
use Plank\Mediable\Exceptions\MediaUpload\InvalidHashException;
use Plank\Mediable\Facades\MediaUploader;
use Str;

class UserController extends Controller
{
    public function index()
    {
        $users = User::query()->orderBy('last_name')->orderBy('first_name')->paginate();
        return Inertia::render('App/Setting/User/UserIndex', [
            'users' => UserData::collect($users),
        ]);
    }

    public function create() {
        $user = new User();
        $user->first_name = '';
        $user->last_name = '';
        $user->email = '';
        $user->is_admin = false;
        return Inertia::render('App/Setting/User/UserEdit', [
            'user' => UserData::from($user),
        ]);
    }

    public function edit(User $user) {
        return Inertia::render('App/Setting/User/UserEdit', [
            'user' => UserData::from($user),
        ]);
    }

    /**
     * @throws FileNotSupportedException
     * @throws FileExistsException
     * @throws ForbiddenException
     * @throws FileNotFoundException
     * @throws FileSizeException
     * @throws InvalidHashException
     * @throws ConfigurationException
     */
    public function update(UserUpdateRequest $request, User $user) {
        $data = $request->safe()->except('avatar');

        if ($data['email'] !== $user->email) {
            $user->newEmail($data['email']);
            unset($data['email']);
        }

        $user->update($data);

        if ($request->hasFile('avatar')) {
            $user->detachMediaTags('avatar');

            $media = MediaUploader::fromSource($request->file('avatar'))
                ->toDestination('s3', 'avatars/projects')
                ->upload();

            $user->attachMedia($media, 'avatar');
        }

        /*
        Password::sendResetLink(
            $request->only('email')
        );
        $url = URL::temporarySignedRoute('initial-password', now()->addHours(24), ['id' => $user->id]);

        Mail::to($user->email)->send(new VerifyEmailAddressForCloudRegistrationMail($user,$url));
        */

        return redirect()->route('app.setting.system.user.index');
    }

    public function destroy(User $user) {
        if ($user->id === auth()->id()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Du kannst Dich nicht selbst löschen.']);
            return redirect()->route('app.setting.system.user.index');
        }
        $user->delete();
        return redirect()->route('app.setting.system.user.index');
    }

    /**
     * @throws FileNotSupportedException
     * @throws FileExistsException
     * @throws ForbiddenException
     * @throws FileNotFoundException
     * @throws FileSizeException
     * @throws InvalidHashException
     * @throws ConfigurationException
     */
    public function store(UserUpdateRequest $request) {
        $data = $request->safe()->except('avatar');

        $data['password'] = Str::random(20);
        $user = User::create($data);

        Password::sendResetLink(
            $request->only('email')
        );

        if ($request->hasFile('avatar')) {
            $media = MediaUploader::fromSource($request->file('avatar'))
                ->toDestination('s3', 'avatars/projects')
                ->upload();

            $user->attachMedia($media, 'avatar');
        }

        return redirect()->route('app.setting.system.user.index');
    }
}
