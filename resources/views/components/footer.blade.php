<htmlpagefooter name="footer">
  @if($footer['hide'] === false)
    <table class="pdf-footer">
      <tr>
        <td>{DATE d.m.Y H:i}</td>
        <td class="center">
          @if($footer['title'])
            {{ $footer['title'] }}
          @endif
        </td>
        <td class="right">{PAGENO}/{nbpg}</td>
      </tr>
    </table>
   @endif
</htmlpagefooter>
