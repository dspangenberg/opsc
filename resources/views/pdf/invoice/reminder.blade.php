<x-layout :config="$config" :styles="$styles" :footer="$pdf_footer">

    <div id="recipient">
        {!! nl2br($reminder->invoice->address) !!}
    </div>

    <div id="infobox-first-page">
    </div>




    <p style="text-align: right;">
        Bonn,  {{ $reminder->issued_on->translatedFormat('j. F Y') }}
    </p>

    <p><strong>Ihre Kundennummer {{number_format($reminder->invoice->contact->debtor_number, 0, ',', '.')}}<br/>{{ $reminder->type }}</strong><br/></p>

    @if($reminder->name)
        <p>Guten Tag, {{$reminder->name}},</p>
    @else
        <p>Guten Tag,</p>
    @endif

    {!! md(nl2br($reminder->intro_text))  !!}

    <table style="vertical-align:top;" border-spacing="0" cellspacing="0">


        <colgroup>
            <col style="width: 20mm">
            <col style="width: 20mm">
            <col style="width: 25mm">
            <col style="width: 25mm">
            <col style="width: 25mm">
            <col style="width: 15mm">
            <col style="width: 15mm">

        </colgroup>
        <thead>
        <tr>
            <th>Datum</th>
            <th>Fällig am</th>
            <th>Rechnung</th>

            <th class="right">Betrag</th>
            <th class="right">Offen</th>
            <th class="right">Tage</th>
            <th class="right">Stufe</th>

        </tr>
        </thead>
        <tbody style="padding-top: 3mm;">

        <tr>
            <td>{{$reminder->invoice->issued_on->format('d.m.Y')}}</td>
            <td>{{$reminder->invoice->due_on->format('d.m.Y')}}</td>
            <td>{{$reminder->invoice->formated_invoice_number}}</td>
            <td class="right">{{ number_format($reminder->invoice->amount_gross, 2, ',', '.') }} EUR</td>
            <td class="right">{{ number_format($reminder->open_amount, 2, ',', '.') }} EUR</td>
            <td class="right">{{ $reminder->dunning_days }}</td>
            <td class="right">{{ $reminder->dunning_level }}</td>



        </tr>
        </tbody>
        </table>

    {!! md(nl2br($reminder->outro_text))  !!}
    <p>Freundliche Grüße nach {{$reminder->city}}</p>
    <p>twiceware solutions e. K.</p>


</x-layout>
