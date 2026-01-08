<x-layout :config="$config" :styles="$styles" :footer="$pdf_footer">
<style>

  body {
    font-family: facit, serif;
    font-size: 10pt;
    hyphens: auto;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: bold;
  }

  h2 {
    font-size: 14pt;
    line-height: 1.5;
  }


  header {
    font-size: 10pt;
  }

  body {
    font-size: 10pt;
    color: #000;
  }

  p {
    margin: 0;
    padding:0;
  }


  p {
    text-align: justify;
    line-height: 1.5;
    font-size: 10pt;
    hyphens: auto;
  }

  table p {
    margin-left: -1.6em;
  }


  table {
    vertical-align: bottom;
    font-size: 9pt;
    width: 100%;
    padding: 0;
    border-collapse: collapse;
    margin: 0 0 5mm;
  }

  h2 {
    font-size: 14pt;
    line-height: 1;
    margin:0;
    padding: 0 0 1mm;

  }

  h4 {
    font-size: 11pt;
    font-weight: 600;
    margin-bottom: 4mm;
  }


  h3 {
    font-size: 11pt;
    margin:0;
    padding: 0 0 3mm;
  }

  h1 {
    font-size: 16pt;
    font-weight: bold;
    color: #444;
    padding: 0;
    margin: 0;
    line-height: 1;
  }


  table {
    table-layout: fixed;
  }

  table tbody tr th {
    border-top: 1px solid #aaa;
    border-bottom: 1px solid #aaa;
    border-collapse: collapse;
    vertical-align: bottom;
  }

  table tbody tr th, table tbody tr td {
    padding: 2px;
    text-align: left;
  }

  table tbody tr td.time {
    width: 20mm !important;
    max-width: 20mm !important;
  }

  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  table tbody tr td.category {
    text-align: left;
  }

  table tbody tr.day th.date {
  }

  table tr th.duration, table tr td.duration {
    width: 18mm;
    text-align: right
  }



  table tbody tr td.sep {
    height: 24px;
    text-align: center;
  }

  table tr td {
    vertical-align: top;
    font-weight: 400;
  }

  table tr th.right, table tr td.right {
    text-align: right
  }

  ul {
    list-style: none;
    padding: 0;
    margin:0;
  }

  ul li ul {
    list-style: none;
    padding: 0;
    margin: 0 0 0 0.5cm;
  }

  a {
    color: #000;
    text-decoration: none;
  }

  table tr.day th {
    font-weight: bold;
    border-top: none;
  }

  table tbody tr.summary td {
    background-color: #eee;
    border-bottom: 1px solid #aaa;
  }

  table tr.day, tr.day th {
    font-weight: bold;
  }

  ul > li:before {
    content: "–"; /* en dash here */
    position: absolute;
    margin-left: -1.1em;
  }

  table tbody tr td.note {
    font-weight: 400;
    text-align: left;
    border-bottom: 1px solid #aaa;
    padding-left: 5mm;
  }


  table tbody th.project-sum {
    border-bottom: none;
  }


  div.note {
    line-height: 1.5;
    font-size: 9pt;


    margin-left: 20px;
    margin-right: 20px;

    page-break-inside: avoid;
  }

  tr.strong th {
    background-color: #eee;
  }

  table tr.border td {
    border-top: 1px solid #aaa;
  }

</style>


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
                {{ $entry['begin_at']?->format("H:i") }} -
                @if($entry['end_at'])
                  {{ $entry['end_at']?->format("H:i") }}
                @endif
              </td>
              <td class="category">
                @if($entry['category'])
                  {{$entry['category']['name'] }}
                @endif
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
