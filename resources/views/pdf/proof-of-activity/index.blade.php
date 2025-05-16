<x-layout :styles="$styles" :footer="$pdf_footer">
    <h2>Leistungsnachweis</h2>
    <p>
      Zeitraum:
      @if($times['stats']['start'])
        {{ $times['stats']['start']->format("d.m.Y") }}
      @endif
        -
      @if($times['stats']['end'])
      {{ $times['stats']['end']->format("d.m.Y") }}
      @endif
  </p>


  <table border-spacing="0" cellspacing="0" style="margin-top: 5mm; margin-bottom: 5mm;">
    <tbody>
    @foreach ($times['groupedByProject'] as $project)

      <tr class="day">
        <td class="date" colspan="2">{{ $project['name'] }}</td>
        <td class="duration right">
          {{ minutes_to_hours($project['sum']) }}
        </td>
        <td class="duration right">
          &nbsp;
        </td>
      </tr>

    @endforeach
      <tr class="project-sum">
        <th colspan="2">Summe</th>
        <th class="duration right">
          {{ minutes_to_hours($times['stats']['sum']) }}
        </th>
        <th class="duration right">
          ({{ minutes_to_units($times['stats']['sum']) }} h)
        </th>
      </tr>
    </tbody>
  </table>


  @foreach ($times['groupedByProject'] as $project)

    <h3>{{ $project['name'] }}</h3>
    <table border-spacing="0" cellspacing="0">
    @foreach ($project['entries'] as $entries)
        <tbody>
        <tr class="day">
            <th class="date" colspan="2">{{ $entries['formatedDate'] }}</th>
            <th class="duration right">
              {{ minutes_to_hours($entries['sum']) }}
            </th>
          </tr>
        </tbody>
      @foreach ($entries['entries'] as $entry)
          <tbody style="page-break-inside: avoid;">
            <tr class="summary">
              <td class="time">
                {{ $entry['begin_at']->format("H:i") }} - {{ $entry['end_at']->format("H:i") }}
              </td>
              <td class="category">
                {{$entry['category']['name'] }}
              </td>
              <td class="duration right">
                {{ minutes_to_hours($entry['mins']) }}
              </td>
            </tr>
            @if($entry['note'])
          <tr>
            <td colspan="3" class="note">
              {!!  md($entry['note']) !!}
            </td>
          </tr>
            @endif
            <tr>
              <td colspan="3">
                <br/>
              </td>
            </tr>
        </tbody>
      @endforeach
    @endforeach
  </table>
@endforeach
</x-layout>
