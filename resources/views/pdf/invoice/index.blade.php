<x-layout :styles="$styles" :footer="$pdf_footer">
<style>
    table tr th
    {border-bottom: 1px solid #aaa;border-collapse: collapse;}
    table tr td
    {
        line-height:1.4;
    }
    table tr.border_top td
    {border-top: 1px solid #444;border-collapse: collapse;}
    table tr.border_bottom td
    {border-bottom: 1px solid #444;border-collapse: collapse;padding-bottom:0mm;}

    table tr td.right,  table tr th.right {
        text-align: right;
        padding-right: 0px;
    }

    table tr td.center {
        text-align: center;
    }
</style>

    <htmlpageheader name="first_header">
        <div id="recipient">
            {!! nl2br($invoice->address) !!}
        </div>

        <div id="infobox-first-page">
        <table>
            <tr>
                <td>
                    Rechnungsdatum:
                </td>
            <td class="right">
                {{ $invoice->issued_on->format('d.m.Y') }}
            </td>
            </tr>
            <tr>
                <td>
                    Rechnungsnummer:&nbsp;&nbsp;
                </td>
                <td class="right">
                    {{ $invoice->formated_invoice_number }}
                </td>
            </tr>
            <tr>
                <td>
                    Kundennummer:&nbsp;&nbsp;
                </td>
                <td class="right">
                    {{ number_format($invoice->contact->debtor_number, 0, ',', '.') }}
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
            @if(($invoice->type_id !== 2 && $invoice->type_id !== 4) && $invoice->service_period_begin && $invoice->service_period_end)
            <tr>
                <td colspan="2">
                    <br>Leistungszeitraum:&nbsp;&nbsp;
                </td>

            </tr>
            <tr>
                <td colspan="2">
                    {{ $invoice->service_period_begin->format('d.m.Y') }} - {{ $invoice->service_period_end->format('d.m.Y') }}
                </td>

            </tr>
            @endif



        </table>
    </div>
    </htmlpageheader>
    <htmlpageheader name="header">
        <div id="infobox">
            <table>
                <tr>
                    <td>
                        Rechnungsdatum:
                    </td>
                    <td class="right">
                        {{ $invoice->issued_on->format('d.m.Y') }}
                    </td>
                </tr>
                <tr>
                    <td>
                        Rechnungsnummer:&nbsp;&nbsp;
                    </td>
                    <td class="right">
                        {{ $invoice->formated_invoice_number }}
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

        <h2>{{$invoice->type->print_name}}</h2>



        @if($invoice->project_id)
        <table border-spacing="0" cellspacing="0">


            <tr>
                <td style="width:30mm;">Projekt: </td>
                <td><strong>{{$invoice->project->name}}</strong></td>
            </tr>
            @if($invoice->project->manager_contact_id)
            <tr>
                <td style="width:30mm;">Ansprechperson: </td>
                <td><strong>{{$invoice->project->manager->full_name}}</strong></td>
            </tr>
             @endif

        </table>
       @endif

        <table style="vertical-align:top;" border-spacing="0" cellspacing="0">

            <thead>
            <tr>
                <th class="right">Pos.</th>
                <th class="right">Menge</th>
                <th style="text-align:center;"></th>
                <th colspan="2" style="text-align:left;">
                    Dienstleistung/Artikel</th>
                <th class="right">Einzelpreis</th>
                <th class="right">Gesamt</th>
                <th class="center">USt.</th>
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

            <tr>
                <td class="right">
                        {{ $counter }}
                </td>
                <td class="right">
                        {{ number_format($line->quantity, 2, ',', '.') }}
                </td>
                <td style="text-align:center;">
                        {{ $line->unit }}
                </td>
                <td colspan="2" style="text-align:left;">
                    {!! md(nl2br($line->text))  !!}
                    @if($line->service_period_begin)
                        <br/>
                        ({{$line->service_period_begin->format('d.m.Y')}} - {{ $line->service_period_end->format('d.m.Y')}})
                    @endif
               </td>
               <td class="right">
                   @if($line->type_id === 3)
                   ({{ number_format($line->price, 2, ',', '.') }})
                   @else
                       {{ number_format($line->price, 2, ',', '.') }}
                   @endif
               </td>
               <td class="right">
                   {{ number_format($line->amount, 2, ',', '.') }}
               </td>
               <td class="center">
                   ({{$line->tax_rate_id}})
               </td>
           </tr>
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
                        <strong>abzüglich geleisteter Akontozahlungen:</strong>
                    </td>
                    <td colspan="1" class="right" style="border-bottom: 1px solid #aaa;">
                        <strong>USt.</strong>
                    </td>
                    <td colspan="1" class="right" style="border-bottom: 1px solid #aaa;">
                        <strong>Netto</strong>
                    </td >
                    <td style="border-bottom: 1px solid #aaa;" />
                </tr>


                @foreach ($invoice->linked_invoices as $line)
                    <tr>
                        <td colspan="3">&nbsp;</td>
                        <td colspan="2">
                            Rechnung Nr. {{$line->linked_invoice->formated_invoice_number}} vom {{ $line->linked_invoice->issued_on->format('d.m.Y') }}<br/>
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

       <p><strong>
           Der Rechnungsbetrag ist ohne Abzug sofort zahlbar.<br/>
       </strong>
       </p>




       <div style="float: left; width: 2cm;">
           <img src="{{ $invoice->qr_code }}" style="width: 1.5cm;">
       </div>
       <div style="float: left;text-align: justify;">
           <p>
           Bitte überweisen Sie den Rechnungsbetrag unter Angabe der Rechnungs- und Kundennummer kurzfristig auf
           unser Konto <strong>{{ iban_to_human_format($bank_account->iban) }}</strong> bei der <strong>{{ $bank_account->bank_name }}</strong> ({{ $bank_account->bic }}).
           </p>
       </div>
    <p>
        Bitte beachten Sie, dass Sie, ohne dass es einer Mahnung bedarf, spätestens in Verzug kommen, wenn Sie Ihre Zahlung nicht innerhalb von 30 Tagen nach Zugang dieser Rechnung leisten (§ 286 Abs. 3 BGB).
    </p>





</x-layout>
