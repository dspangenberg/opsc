<x-layout :config="$config" :styles="$styles" :footer="$pdf_footer">
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

        table tr td.center {
            text-align: center;
        }

        p {
            font-size: 10pt;
        }

        h5 {
            font-size: 10pt;
            font-weight: bold;
            color: #000;
            padding: 0;
            padding-bottom: 2mm;
            margin: 0;
            line-height: 1;
        }

        h4 {
            font-size: 12pt;
            font-weight: bold;
            color: #000;
            padding: 0;
            padding-bottom: 2mm;
            margin: 0;
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



    </style>

    <htmlpageheader name="attachment"></htmlpageheader>
    <htmlpagefooter name="attachment">
        Seite {PAGENO} von {nbpg}
    </htmlpagefooter>

    <htmlpageheader name="first_header">
        <div id="recipient">
            {!! nl2br($offer->address) !!}
        </div>

        <div id="infobox-first-page">
            <table>
                <tr>
                    <td>
                        Datum:
                    </td>
                    <td class="right">
                        {{ $offer->issued_on->format('d.m.Y') }}
                    </td>
                </tr>
                <tr>
                    <td>
                        Angebotsnummer:&nbsp;&nbsp;
                    </td>
                    <td class="right">
                        {{ $offer->formated_offer_number }}
                    </td>
                </tr>
                <tr>
                    <td>
                        Gültig bis:
                    </td>
                    <td class="right">
                        {{ $offer->valid_until->format('d.m.Y') }}
                    </td>
                </tr>
                <tr>
                    <td>
                        Kundennummer:&nbsp;&nbsp;
                    </td>
                    <td class="right">
                        {{ number_format($offer->contact->debtor_number, 0, ',', '.') }}
                    </td>
                </tr>
                <tr>
                    <td>
                        Seite:&nbsp;&nbsp;
                    </td>
                    <td class="right">
                        {PAGENO}/{nbpg}
                    </td>
                </tr>
            </table>
        </div>
    </htmlpageheader>
    <htmlpageheader name="header">
        <div id="infobox">
            <table>
                <tr>
                    <td>
                        Datum:
                    </td>
                    <td class="right">
                        {{ $offer->issued_on->format('d.m.Y') }}
                    </td>
                </tr>
                <tr>
                    <td>
                        Angebotsnummer:&nbsp;&nbsp;
                    </td>
                    <td class="right">
                        {{ $offer->formated_offer_number }}
                    </td>
                </tr>

                <tr>
                    <td>
                        Seite:&nbsp;&nbsp;
                    </td>
                    <td class="right">
                        {PAGENO}/{nbpg}
                    </td>
                </tr>
            </table>
        </div>
    </htmlpageheader>

    <h2>Angebot</h2>



    @if($offer->project_id)
        <table border-spacing="0" cellspacing="0">


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

    <table style="vertical-align:top;" border-spacing="0" cellspacing="0">

        <thead>
        <tr>
            <th class="right" style="width:7mm;">Pos.</th>
            <th class="right" style="width:5mm;">Menge</th>
            <th style="text-align:center;"></th>
            <th colspan="2" style="text-align:left;">
                Dienstleistung/Artikel
            </th>
            <th class="right">Einzelpreis</th>
            <th class="right">Gesamt</th>
            <th class="center">USt.</th>
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

            <tr>
                <td colspan="9" style="padding-top:2mm"></td>
            </tr>
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
                <tr style="color: #fff;">


                    <td width="8mm">&nbsp;</td>
                    <td width="15mm">&nbsp;</td>
                    <td width="8mm">&nbsp;</td>
                    <td width="35mm">&nbsp;</td>
                    <td width="35mm">&nbsp;</td>
                    <td width="18mm">&nbsp;</td>
                    <td width="21mm">&nbsp;</td>
                    <td width="12mm">&nbsp;</td>

                </tr>
    </table>
    <pagebreak>

        <table style="vertical-align:top;" border-spacing="0" cellspacing="0">

            <thead>
            <tr>
                <th class="right">Pos.</th>
                <th class="right">Menge</th>
                <th style="text-align:center;"></th>
                <th colspan="2" style="text-align:left;">
                    Dienstleistung/Artikel
                </th>
                <th class="right">Einzelpreis</th>
                <th class="right">Gesamt</th>
                <th class="center">USt.</th>
            </tr>

            </thead>
            @endif

            @endforeach
            <tr>
                <td colspan="9" style="padding-top:2mm"></td>
            </tr>


            <tr style="color: #fff;">


                <td width="8mm">&nbsp;</td>
                <td width="15mm">&nbsp;</td>
                <td width="8mm">&nbsp;</td>
                <td width="35mm">&nbsp;</td>
                <td width="35mm">&nbsp;</td>
                <td width="18mm">&nbsp;</td>
                <td width="21mm">&nbsp;</td>
                <td width="12mm">&nbsp;</td>

            </tr>


            <tr class="">
                <td colspan="4"></td>
                <td colspan="2" style="border-top: 1px solid #aaa;">
                    Nettobetrag
                </td>
                <td style="border-top: 1px solid #aaa;text-align: right;">

                    {{ number_format($offer->amount_net, 2, ',', '.') }}

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

                    {{ number_format($offer->amount_gross, 2, ',', '.') }}

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


        @if($offer->additional_text)
            <p>{!!  md($offer->additional_text) !!}</p>
       @endif




</x-layout>
