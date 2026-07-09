<?php

test('registration screen can be rendered')
    ->skip('Registration routes are not available in this application')
    ->get('/register')
    ->assertStatus(200);

test('new users can register')
    ->skip('Registration routes are not available in this application');
