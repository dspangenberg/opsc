<?php

use App\Data\DocumentData;
use App\Data\DocumentTagData;
use App\Models\Document;
use App\Models\DocumentTag;

it('maps the tags relation to an array of DocumentTagData', function () {
    $tag = (new DocumentTag)->forceFill([
        'id' => 1,
        'name' => 'Wichtig',
        'color' => '#ff0000',
        'icon' => 'tag',
    ]);

    $document = new Document;
    $document->forceFill([
        'id' => 1,
        'filename' => 'test.pdf',
        'folder' => 'Test',
        'is_pinned' => false,
        'is_confirmed' => true,
    ]);
    $document->setRelation('tags', collect([$tag]));
    $document->setRelation('sender_contact', null);
    $document->setRelation('receiver_contact', null);
    $document->setRelation('type', null);
    $document->setRelation('project', null);

    $data = DocumentData::from($document);

    expect($data->tags)
        ->toBeArray()
        ->and($data->tags[0])
        ->toBeInstanceOf(DocumentTagData::class)
        ->and($data->tags[0]->name)
        ->toBe('Wichtig');
});

it('maps an empty tags relation to an empty array', function () {
    $document = new Document;
    $document->forceFill([
        'id' => 1,
        'filename' => 'test.pdf',
        'folder' => 'Test',
        'is_pinned' => false,
        'is_confirmed' => true,
    ]);
    $document->setRelation('tags', collect());
    $document->setRelation('sender_contact', null);
    $document->setRelation('receiver_contact', null);
    $document->setRelation('type', null);
    $document->setRelation('project', null);

    $data = DocumentData::from($document);

    expect($data->tags)->toBe([]);
});
