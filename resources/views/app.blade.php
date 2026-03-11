<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="GeDocs">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    <link rel="preload" href="/resources/fonts/work-sans/WorkSans-VariableFont_wght.ttf" as="font" type="font/ttf"
        crossorigin>
    @inertiaHead
</head>

<body>
    @inertia
</body>

</html>