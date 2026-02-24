<table class="info-table" style="width: 60mm;">
    <tr>
        <td>Datum:</td>
        <td class="right">{{ $issuedOn }}</td>
    </tr>
    @if($accountId)
        <tr>
            <td>Kundennummer:</td>
            <td class="right">{{ $accountId }}</td>
        </tr>
    @endif
    @if($reference)
    <tr>
        <td>{{ $referenceLabel }}:</td>
        <td class="right">{{ $reference }}</td>
    </tr>
    @endif
    @if($dueDate)
        <tr>
            <td>Angebot gültig bis:</td>
            <td class="right">{{ $dueDate }}</td>
        </tr>
    @endif
    <tr>
        <td>Seite:</td>
        <td class="right"><span class="page-number"></span>/<span class="total-pages"></span></td>
    </tr>

    @if($servicePeriodBegin)
        <tr>
            <td colspan="2" class="left">
                <br>Leistungszeitraum:&nbsp;&nbsp;
            </td>
        </tr>
        <tr>
            <td colspan="2" class="left">
                {{ $servicePeriodBegin }}
                @if($servicePeriodEnd !== $servicePeriodBegin)
                    - {{ $servicePeriodEnd }}
                @endif
            </td>
        </tr>
    @endif
</table>
