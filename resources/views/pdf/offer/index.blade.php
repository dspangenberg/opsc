<x-layout :config="$config" :styles="$styles" :footer="$pdf_footer">

    <div id="recipient">
        {!! nl2br(e($offer->address)) !!}
    </div>

    <div id="infobox-first-page">
        <x-pdf.info-box
                :issued-on="$offer->issued_on->format('d.m.Y')"
                :due-date="$offer->valid_until?->format('d.m.Y')"
                :reference="$offer->formated_offer_number"
                reference-label="Angebotsnummer"
                :account-id="number_format($offer->contact->debtor_number, 0, ',', '.')"
        />
    </div>

    <div id="infobox">
        <x-pdf.info-box
                :issued-on="$offer->issued_on->format('d.m.Y')"
                :reference="$offer->formated_offer_number"
                reference-label="Angebotsnummer"
        />
    </div>


    <h2>Angebot</h2>


    @if($offer->project_id)
        <table style="padding: 0;border:0;">


            <tr>
                <td style="width:30mm;">Projekt:</td>
                <td><strong>{{$offer->project->name}}</strong></td>
            </tr>
            @if($offer->project->manager_contact_id)
                <tr>
                    <td style="width:30mm;">Ansprechperson:</td>
                    <td><strong>{{$offer->project->manager->full_name}}</strong></td>
                </tr>
            @endif

        </table>
    @endif

    <table style="vertical-align:top; table-layout: fixed; max-width: 149mm;">

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
        @foreach ($offer->lines as $line)
            @if($line->type_id === 0 || $line->type_id === 1 || $line->type_id === 3)
                @php
                    $counter++;
                @endphp
            @endif

            @if($line->type_id === 1 || $line->type_id === 3)
                @include('pdf.offer.defaultLine')
            @endif

            @if($line->type_id === 2)
                @include('pdf.offer.caption')
            @endif

            @if($line->type_id === 4)
                @include('pdf.offer.text')
            @endif

            @if($line->type_id === 8)
                <tr class="page-break">
                    <td colspan="8"></td>
                </tr>
            @endif

        @endforeach

        <tr>
            <td colspan="8">&nbsp;</td>
        </tr>

        <tr>
            <td colspan="4"></td>
            <td colspan="2" style="border-top: 1px solid #aaa;">
                Nettobetrag
            </td>
            <td style="border-top: 1px solid #aaa;text-align: right;">

                {{ number_format($offer->amount_net, 2, ',', '.') }}

            </td>
            <td style="border-top: 1px solid #aaa;text-align: center;">
                EUR
            </td>
        </tr>

        @foreach ($taxes as $tax)
            <tr>
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

                {{ number_format($offer->amount_gross, 2, ',', '.') }}

            </td>
            <td style="border-top: 1px solid #aaa;text-align: center;font-weight: bold;">
                EUR
            </td>
        </tr>

        <tr>
            <td colspan="4"></td>
            <td colspan="2" style="border-bottom: 1px solid #aaa;border-top: 1px solid #aaa;"></td>
            <td style="border-bottom: 1px double #aaa;border-top: 1px solid #aaa;text-align: right;"></td>
            <td style="border-bottom: 1px double #aaa;border-top: 1px solid #aaa;text-align: center;"></td>
        </tr>

    </table>

    @foreach($offer->sections as $section)
        @if($section->pagebreak)
            <div class="page-break" />
        @endif
        <div>
            {!!  md($section->content) !!}
        </div>
    @endforeach


    @if($offer->additional_text)
        {!!  md($offer->additional_text) !!}
    @endif

    @if($attachments)
        <h5>Anlagen</h5>
    <ul>
        @foreach($attachments as $attachment)
            <li>{{$attachment->document->title}}</li>
        @endforeach
    </ul>
    @endif


</x-layout>
