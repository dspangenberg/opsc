<?php

test('confirm password screen can be rendered')
    ->skip('Password confirmation routes are not available in this application')
    ->get('/confirm-password')
    ->assertStatus(200);

test('password can be confirmed')
    ->skip('Password confirmation routes are not available in this application');

test('password is not confirmed with invalid password')
    ->skip('Password confirmation routes are not available in this application');
