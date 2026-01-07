<tr>
    <td class="right">
        {{ $counter }}
    </td>
    <td class="right">
        @if($line->type_id === 1)
            {{ number_format($line->quantity, 2, ',', '.') }}
        @endif
    </td>
    <td class="center">
        @if($line->type_id === 1)
            {{ $line->unit }}
        @endif
        &nbsp;
    </td>
    <td colspan="2" class="mdx-cell">
        {!! md(nl2br($line->text))  !!}
    </td>
    <td class="right">
        @if($line->type_id === 1)
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
