
@if($footer['hide'] === false)
  <div id="footer-left">
    {{now()->format('d.m.Y H:i')}}
  </div>
  <div id="footer-center">
    @if($footer['title'])
      {{ $footer['title'] }}
    @endif
  </div>
  <div id="footer-right">
      <span class="page-number"></span>/<span class="total-pages">
  </div>
@endif
