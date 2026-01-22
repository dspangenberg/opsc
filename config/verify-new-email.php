<?php

return [
    /**
     * Here you can specify the name of a custom route to handle the verification.
     */
    'route' => 'pendingEmail.verify',

    /**
     * Here you can specify the path to redirect to after verification.
     */
    'redirect_to' => '/app',

    /**
     * Whether to login the user after successfully verifying its email.
     */
    'login_after_verification' => true,

    /**
     * Should the user be permanently "remembered" by the application.
     */
    'login_remember' => false,

    /**
     * Model class that will be used to store and retrieve the tokens.
     */
    'model' => \App\Models\PendingUserEmail::class,

    /**
     * The Mailable that will be sent when the User wants to verify
     * its initial email address (that got used with registering).
     */
    'mailable_for_first_verification' => \App\Mail\VerifyFirstEmail::class,

    /**
     * The Mailable that will be sent when the User wants to verify
     * a new email address, for example when the User wants to
     * update its email address.
     */
    'mailable_for_new_email' => \App\Mail\VerifyNewEmail::class,
];
