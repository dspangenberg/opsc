<style>
    table.info-table tr td:last-child {
        text-align: right;
    }
</style>
<table class="info-table">
    <tr>
        <td>Datum:</td>
        <td>{{ $issuedOn }}</td>
    </tr>
    @if($accountId)
        <tr>
            <td>Kundennummer:</td>
            <td>{{ $accountId }}</td>
        </tr>
    @endif
    <tr>
        <td>{{ $referenceLabel }}:</td>
        <td>{{ $reference }}</td>
    </tr>
    @if($dueDate)
        <tr>
            <td>Angebot gültig bis:</td>
            <td>{{ $dueDate }}</td>
        </tr>
    @endif
    <tr>
        <td>Seite:</td>
        <td><span class="page-number"></span>/<span class="total-pages"></span></td>
    </tr>
</table>
