<?php

require_once 'vendor/autoload.php';

use App\SushiModels\MoneyMoneyTransaction;

// Create a test JSON file
$testJson = [
    'transactions' => [
        [
            'id' => 123,
            'booking_date' => time() - 86400,
            'value_date' => time() - 86400,
            'booking_text' => 'Test Transaction',
            'amount' => 100.50,
            'category' => 'Test Category'
        ]
    ]
];

$testFile = storage_path('app/temp/test_moneymoney.json');
if (!is_dir(dirname($testFile))) {
    mkdir(dirname($testFile), 0755, true);
}

file_put_contents($testFile, json_encode($testJson));

try {
    // Test the SushiModel
    MoneyMoneyTransaction::setFilename($testFile, 1);
    $transactions = MoneyMoneyTransaction::all();

    echo "Success! Found " . $transactions->count() . " transactions\n";

    // Test with invalid file
    MoneyMoneyTransaction::setFilename('/nonexistent/file.json', 1);
    $emptyTransactions = MoneyMoneyTransaction::all();

    echo "Invalid file test: Found " . $emptyTransactions->count() . " transactions (should be 0)\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
} finally {
    // Clean up
    if (file_exists($testFile)) {
        unlink($testFile);
    }
}
