<tr>
    <td class="right">
        @if($line->type_id !== 2)
            {{ $counter }}
        @endif
    </td>
    <td class="right">
        @if($line->type_id === 1)
            {{ number_format($line->quantity, 2, ',', '.') }}
        @endif
    </td>
    <td style="text-align:center;">
        @if($line->type_id === 1)
            {{ $line->unit }}
        @endif
    </td>
    <td colspan="2" style="text-align:left;">
        {!! md(nl2br($line->text))  !!}
    </td>
    <td class="right">
        @if($line->type_id === 2)
            {{ number_format($line->price, 2, ',', '.') }}
        @endif
    </td>
    <td class="right">
        @if($line->type_id !== 2)
            {{ number_format($line->amount, 2, ',', '.') }}
        @endif
    </td>
    <td class="center">
        @if($line->type_id !== 2)
            ({{$line->tax_rate_id}})
        @endif
    </td>
</tr>
