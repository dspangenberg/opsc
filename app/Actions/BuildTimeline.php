<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Actions;

use App\Data\DropboxMailData;
use App\Data\NoteableData;
use App\Data\TimelineEntryData;
use App\Models\DropboxMail;
use DateTime;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use MohamedSaid\Notable\Notable;

class BuildTimeline
{
    private array $queries = [];

    public function withNotables(Model $model): static
    {
        $this->queries[] = DB::table('notables')
            ->selectRaw("'note' as type, created_at as date, id as source_id")
            ->where('notable_type', $model->getMorphClass())
            ->where('notable_id', $model->getKey());

        return $this;
    }

    public function withDropboxMails(Model $model): static
    {
        $this->queries[] = DB::table('dropbox_mails')
            ->selectRaw("'mail' as type, date, dropbox_mails.id as source_id")
            ->join('dropbox_mail_links', 'dropbox_mails.id', '=', 'dropbox_mail_links.dropbox_mail_id')
            ->where('dropbox_mail_links.mailable_type', $model->getMorphClass())
            ->where('dropbox_mail_links.mailable_id', $model->getKey());

        return $this;
    }

    public function get(): Collection
    {
        $rows = $this->buildUnionQuery()->get();

        return $this->hydrateRows($rows->all());
    }

    public function paginate(int $perPage = 20): LengthAwarePaginator
    {
        $paginator = $this->buildUnionQuery()->paginate($perPage);

        return $paginator->setCollection($this->hydrateRows($paginator->items()));
    }

    private function buildUnionQuery(): Builder
    {
        $queries = $this->queries;
        $base = array_shift($queries);

        foreach ($queries as $query) {
            $base = $base->unionAll($query);
        }

        return DB::query()->fromSub($base, 'timeline')->orderByDesc('date');
    }

    private function hydrateRows(array $rows): Collection
    {
        $rows = collect($rows);

        $noteIds = $rows->where('type', 'note')->pluck('source_id');
        $mailIds = $rows->where('type', 'mail')->pluck('source_id');

        $notables = Notable::with('creator')->whereIn('id', $noteIds)->get()->keyBy('id');
        $mails = DropboxMail::whereIn('id', $mailIds)->get()->keyBy('id');

        return $rows->map(fn ($row) => TimelineEntryData::from([
            'type' => $row->type,
            'date' => new DateTime($row->date),
            'note' => $row->type === 'note' ? NoteableData::from($notables[$row->source_id]) : null,
            'mail' => $row->type === 'mail' ? DropboxMailData::from($mails[$row->source_id]) : null,
        ]));
    }
}
