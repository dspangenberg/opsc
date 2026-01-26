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
        @if($line->service_period_begin)
            <div style="margin-top: -3mm;">
                ({{$line->service_period_begin->format('d.m.Y')}} - {{ $line->service_period_end->format('d.m.Y')}})
            </div>
        @endif
    </td>
    <td class="right">
        @if($line->type_id === 3)
            ({{ number_format($line->price, 2, ',', '.') }})
        @else
            @if($line->type_id !== 2)
                {{ number_format($line->price, 2, ',', '.') }}
            @endif
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
