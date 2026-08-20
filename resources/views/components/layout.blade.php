<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8">
      <title>{{ $config['title'] }}</title>
      <meta name="generator" content="{{ $config['generator'] }}">
      <style>
        @font-face {
          font-family: "Facit";
          src: local("Facit"), local("Facit Regular"), url("file://{{ base_path('resources/fonts/facit/facit-regular-webfont.ttf') }}");
          font-weight: 400;
          font-style: normal;
        }
        @font-face {
          font-family: "Facit";
          src: local("Facit"), local("Facit Semibold"), url("file://{{ base_path('resources/fonts/facit/facit-semibold-webfont.ttf') }}");
          font-weight: 600;
          font-style: normal;
        }
        {{ $styles['default_css'] }}
        {{ $styles['letterhead_css'] }}
        {{ $styles['layout_css'] }}
      </style>
  </head>
  <body>
    <x-footer :footer="$footer" />
    {{ $slot }}
  </body>
</html>

