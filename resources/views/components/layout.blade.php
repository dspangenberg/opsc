<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8">
      <title>{{ $config['title'] }}</title>
      <meta name="generator" content="{{ $config['generator'] }}">
      <style>
        {{ $styles['default_css'] }}
        {{ $styles['letterhead_css'] }}
        {{ $styles['layout_css'] }}
      </style>
  </head>
  <body>
    {{ $slot }}
    <x-footer :footer="$footer" />
  </body>
</html>

