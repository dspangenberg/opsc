<x-layout :config="$config" :styles="$styles" :footer="$pdf_footer">

    <div id="recipient">
        {!! nl2br($invoice->address) !!}
    </div>

    <div id="infobox-first-page">
        <x-pdf.info-box
            :issued-on="$invoice->issued_on->format('d.m.Y')"
            :reference="$invoice->formated_invoice_number"
            reference-label="Rechnungsnummer"
            :account-id="number_format($invoice->contact->debtor_number, 0, ',', '.')"
            :service-period-begin="$invoice->service_period_begin?->format('d.m.Y')"
            :service-period-end="$invoice->service_period_end?->format('d.m.Y')"
        />
    </div>

    <div id="infobox">
        <x-pdf.info-box
            :issued-on="$invoice->issued_on->format('d.m.Y')"
            :reference="$invoice->formated_invoice_number"
            reference-label="Rechnungsnummer"
        />
    </div>




    @if ($invoice->type)
        <h2>{{$invoice->type->print_name}}</h2>
    @else
        <h2>Rechnung</h2>
    @endif



    @if($invoice->project_id)
        <table border-spacing="0" cellspacing="0">


            <tr>
                <td style="width:30mm;">Projekt:</td>
                <td><strong>{{$invoice->project->name}}</strong></td>
            </tr>
            @if($invoice->project->manager_contact_id)
                <tr>
                    <td style="width:30mm;">Ansprechperson:</td>
                    <td><strong>{{$invoice->project->manager->full_name}}</strong></td>
                </tr>
            @endif

        </table>
    @endif

    <table style="vertical-align:top;" border-spacing="0" cellspacing="0">


        <colgroup>
            <col style="width: 8mm">
            <col style="width: 12mm">
            <col style="width: 8mm">
            <col style="width: 30mm">
            <col style="width: 30mm">
            <col style="width: 18mm">
            <col style="width: 21mm">
            <col style="width: 12mm">
        </colgroup>
        <thead>
        <tr>
            <th class="right">Pos.</th>
            <th class="right">Menge</th>
            <th></th>
            <th colspan="2">
                Dienstleistung/Artikel
            </th>
            <th class="right">Einzelpreis</th>
            <th class="right">Gesamt</th>
            <th class="center">USt.</th>
        </tr>
        <tr>
            <td colspan="8">&nbsp;</td>
        </tr>
        </thead>

        @php
            $counter = 0;
        @endphp
        @foreach ($invoice->lines as $line)
            @if($line->type_id === 0 || $line->type_id === 1 || $line->type_id === 3)
                @php
                    $counter++;
                @endphp
            @endif

            <tr>
                <td colspan="9" style="padding-top:2mm"></td>
            </tr>
            @if($line->type_id === 1 || $line->type_id === 3)
                @include('pdf.invoice.defaultLine')
            @endif

            @if($line->type_id === 2)
                @include('pdf.invoice.caption')
            @endif

            @if($line->type_id === 4)
                @include('pdf.invoice.text')
            @endif

                @if($line->type_id === 8)
                    <tr class="page-break">
                        <td colspan="8"></td>
                    </tr>
                @endif

            @endforeach
            <tr>
                <td colspan="9" style="padding-top:2mm"></td>
            </tr>
            @if($invoice->linked_invoices->count() > 0)
                <tr class="">
                    <td colspan="3" style=""></td>
                    <td colspan="3" style="border-top: 1px solid #aaa;border-bottom: 1px solid #aaa;">
                        Zwischensumme
                    </td>
                    <td style="border-top: 1px solid #aaa;text-align: right;border-bottom: 1px solid #aaa;">

                        {{ number_format($invoice->lines->sum('amount'), 2, ',', '.') }}

                    </td>
                    <td style="text-align:right;border-top: 1px solid #aaa;text-align: center;border-bottom: 1px solid #aaa;">
                        EUR
                    </td>
                </tr>
                <tr>
                    <td colspan="9" style="padding-top:2mm"></td>
                </tr>
                <tr>
                    <td colspan="3">&nbsp;</td>
                    <td colspan="2" style="border-bottom: 1px solid #aaa;">
                        <strong>abzüglich Akontorechnungen:</strong>
                    </td>
                    <td colspan="1" class="right" style="border-bottom: 1px solid #aaa;">
                        <strong>USt.</strong>
                    </td>
                    <td colspan="1" class="right" style="border-bottom: 1px solid #aaa;">
                        <strong>Netto</strong>
                    </td>
                    <td style="border-bottom: 1px solid #aaa;" />
                </tr>


                @foreach ($invoice->linked_invoices as $line)
                    <tr>
                        <td colspan="3">&nbsp;</td>
                        <td colspan="2">
                            {{ $line->linked_invoice->issued_on->format('d.m.Y') }} RG-{{$line->linked_invoice->formated_invoice_number}}
                        </td>
                        <td class="right">
                            ({{ number_format($line->tax * -1, 2, ',', '.') }})
                        </td>
                        <td class="right">
                            {{ number_format($line->amount, 2, ',', '.') }}
                        </td>
                        <td class="center">EUR</td>
                    </tr>
                @endforeach

            @endif


        <tr>
            <td colspan="8">&nbsp;</td>
        </tr>


            <tr class="">
                <td colspan="4"></td>
                <td colspan="2" style="border-top: 1px solid #aaa;">
                    Nettobetrag
                </td>
                <td style="border-top: 1px solid #aaa;text-align: right;">

                    {{ number_format($invoice->amount_net, 2, ',', '.') }}

                </td>
                <td style="text-align:right;border-top: 1px solid #aaa;text-align: center;">
                    EUR
                </td>
            </tr>

            @foreach ($taxes as $tax)
                <tr class="">
                    <td colspan="4"></td>

                    <td colspan="2">


                        {{ number_format($tax['tax_rate']['rate'], 0, ',', '.') }}%
                        Umsatzsteuer
                        ({{$tax['tax_rate']['id'] }})
                    </td>

                    <td style="text-align: right;">

                        {{ number_format($tax['sum'], 2, ',', '.') }}

                    </td>

                    <td style="text-align: center;">
                        EUR
                    </td>
                </tr>
            @endforeach


            <tr>
                <td colspan="4"></td>
                <td colspan="2" style="border-top: 1px solid #aaa;font-weight: bold;">
                    Rechnungsbetrag (brutto)
                </td>
                <td style="border-top: 1px solid #aaa;text-align: right;font-weight: bold;">

                    {{ number_format($invoice->amount_gross, 2, ',', '.') }}

                </td>
                <td style="text-align:right;border-top: 1px solid #aaa;text-align: center;font-weight: bold;">
                    EUR
                </td>
            </tr>

            <tr class="">
                <td colspan="4"></td>
                <td colspan="2" style="border-bottom: 1px solid #aaa;border-top: 1px solid #aaa;"></td>
                <td style="border-bottom: 1px solid #aaa;border-top: 1px solid #aaa;text-align: right;"></td>
                <td style="border-bottom: 1px solid #aaa;text-align:right;border-top: 1px solid #aaa;text-align: center;"></td>
            </tr>

        </table>

        @if($invoice->contact->tax_id && $invoice->contact->tax->invoice_text)
            <p>{{ nl2br($invoice->contact->tax->invoice_text) }}</p>
            <p>
                USt-IdNr. des Auftraggebers: {{ $invoice->contact->vat_id }}
            </p>
        @endif

        @if($invoice->additional_text)
            <p>{!!  md($invoice->additional_text) !!}</p>
        @endif

        @if($invoice->amount_gross > 0)

            <p><strong>
                    Der Rechnungsbetrag ist ohne Abzug sofort zahlbar.<br />
                </strong>
            </p>

            <table>
                <tr>
                    <td><img src="{{ $invoice->qr_code }}" style="width: 1.5cm;"></td>
                    <td style="vertical-align: top; padding-left: 0.5cm; text-align: justify;">
                        Bitte überweisen Sie den Rechnungsbetrag unter Angabe der Rechnungs- und Kundennummer kurzfristig auf
                        unser Konto <strong>{{ iban_to_human_format($bank_account->iban) }}</strong> bei der
                        <strong>{{ $bank_account->bank_name }}</strong> ({{ $bank_account->bic }}).
                    </td>
                </tr>
            </table>
        <p>
            Bitte beachten Sie, dass Sie, ohne dass es einer Mahnung bedarf, spätestens in Verzug kommen, wenn Sie Ihre
            Zahlung nicht innerhalb von 30 Tagen nach Zugang dieser Rechnung leisten (§ 286 Abs. 3 BGB).
        </p>

        @endif

        @if($groupedByCategoryTimes)
            <pagebreak>
                <h1>Leistungsnachweis</h1>
                <table border-spacing="0" cellspacing="0" style="margin-top: 5mm; margin-bottom: 5mm;">
                    <tbody>
                    @foreach ($groupedByCategoryTimes as $project)

                        <tr class="day">
                            <td class="date" colspan="2">{{ $project['name'] }}</td>
                            <td class="duration right">
                                {{ minutes_to_hours($project['sum']) }}
                            </td>
                            <td class="duration right">
                                &nbsp;
                            </td>
                        </tr>
                    @endforeach
                    <tr class="project-sum">
                        <th colspan="2">Summe</th>
                        <th class="duration right">
                            {{ minutes_to_hours($timesSum) }}
                        </th>
                        <th class="duration right">
                            ({{ minutes_to_units($timesSum) }} h)
                        </th>
                    </tr>
                    </tbody>
                </table>


                @foreach ($groupedByCategoryTimes as $project)
                    <h2>{{ $project['name'] }}</h2>
                    <table border-spacing="0" cellspacing="0">
                        @foreach ($project['entries'] as $entries)
                            <tbody>
                            <tr class="day">
                                <th class="date" colspan="2">{{ $entries['formatedDate'] }}</th>
                                <th class="duration right">
                                    {{ minutes_to_hours($entries['sum']) }}
                                </th>
                            </tr>
                            </tbody>
                            @foreach ($entries['entries'] as $entry)
                                <tbody style="page-break-inside: avoid;">
                                <tr class="summary">
                                    <td class="time" style="width: 25mm;">
                                        {{ $entry['begin_at']?->format("H:i") }} -
                                        @if($entry['end_at'])
                                            {{ $entry['end_at']?->format("H:i") }}
                                        @endif
                                    </td>
                                    <td class="category">
                                        &nbsp;
                                    </td>
                                    <td class="duration right">
                                        {{ minutes_to_hours($entry['mins']) }}
                                    </td>
                                </tr>
                                @if($entry['note'])
                                    <tr>
                                        <td colspan="3" class="note">
                                            {!!  md($entry['note']) !!}
                                        </td>
                                    </tr>
                                @endif
                                <tr>
                                    <td colspan="3">
                                        <br/>
                                    </td>
                                </tr>
                                </tbody>
                            @endforeach
                        @endforeach
                    </table>
    @endforeach
    @endif




</x-layout>
