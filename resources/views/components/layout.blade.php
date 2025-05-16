<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8">
    <title></title>
    <style>
      {{ $styles['letterhead_default_css'] }}
      {{ $styles['letterhead_css'] }}
      {{ $styles['layout_default_css'] }}
      {{ $styles['layout_css'] }}
    </style>
  </head>
  <body>
    {{ $slot }}
    <x-footer :footer="$footer" />
  </body>
</html>

