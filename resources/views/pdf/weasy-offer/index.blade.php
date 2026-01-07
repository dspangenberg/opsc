<x-layout :styles="$styles" :footer="$pdf_footer">
    <style>
        table {
            page-break-inside: initial;
        }

        table tr th {
            border-bottom: 1px solid #aaa;
            border-collapse: collapse;
        }

        table tr td {
            line-height: 1.4;
        }

        table tr td.center {
            text-align: center !important;
        }

        table tr td.mdx-cell p {
            padding: 0;
            margin: 0;
        }

        table tr.border_top td {
            border-top: 1px solid #444;
            border-collapse: collapse;
        }

        table tr.border_bottom td {
            border-bottom: 1px solid #444;
            border-collapse: collapse;
            padding-bottom: 0;
        }

        table tr td.right, table tr th.right {
            text-align: right;
            padding-right: 0;
        }


        p {
            margin-bottom: 3mm; /* ca. 1 Zeile Abstand */
            line-height: 1.5;
            hyphens: auto;
        }

        h1 {
            margin-top: 8mm;
            margin-bottom: 4mm;
        }

        h2 {
            margin-top: 6mm;
            margin-bottom: 3mm;
        }

        h3 {
            margin-top: 4mm;
            margin-bottom: 2mm;
        }

        h4, h5, h6 {
            margin-top: 3mm;
            margin-bottom: 2mm;
        }

        h5 {
            font-size: 10pt;
            font-weight: bold;
            color: #000;
            line-height: 1;
        }

        h4 {
            font-size: 12pt;
            font-weight: bold;
            color: #000;
            line-height: 1;
        }

        a {
            color: #0b5ed7;
        }


        ul {
            list-style-type: circle;
            list-style-position: inside;
        }


        ul li ul {
            list-style-type: circle;
            padding: 0;
            margin: 0 0 0 0.5cm;
        }


        .page-break {
            page-break-before: always;
        }
    </style>

    <div id="recipient">
        {!! nl2br($offer->address) !!}
    </div>

    <div id="infobox-first-page">
        <x-pdf.info-box
                :issued-on="$offer->issued_on->format('d.m.Y')"
                :due-date="$offer->valid_until->format('d.m.Y')"
                :reference="$offer->formated_offer_number"
                reference-label="Angebotsnummer"
                :account-id="number_format($offer->contact->debtor_number, 0, ',', '.')"
        />
    </div>

    <div id="infobox">
        <x-pdf.info-box
                :issued-on="$offer->issued_on->format('d.m.Y')"
                :reference="$offer->formated_offer_number"
                reference-label="Angebotsnr."
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
                @include('pdf.weasy-offer.defaultLine')
            @endif

            @if($line->type_id === 2)
                @include('pdf.weasy-offer.caption')
            @endif

            @if($line->type_id === 4)
                @include('pdf.weasy-offer.text')
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

        <tr class="">
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

                {{ number_format($offer->amount_gross, 2, ',', '.') }}

            </td>
            <td style="text-align:right;border-top: 1px solid #aaa;text-align: center;font-weight: bold;">
                EUR
            </td>
        </tr>

        <tr class="">
            <td colspan="4"></td>
            <td colspan="2" style="border-bottom: 1px solid #aaa;border-top: 1px solid #aaa;"></td>
            <td style="border-bottom: 1px double #aaa;border-top: 1px solid #aaa;text-align: right;"></td>
            <td style="border-bottom: 1px double #aaa;border-top: 1px solid #aaa;text-align: center;"></td>
        </tr>

    </table>


    @if($offer->additional_text)
        {!!  md($offer->additional_text) !!}
    @endif


</x-layout>
