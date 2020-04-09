<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, minimal-ui, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"/>
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-title" content="VEE">
        <title>VieElite Education</title>

        <!-- Fonts -->
        <link rel="stylesheet" type="text/css" href="{{ asset('public/css/app.css') }}">
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

        <style>
            /* width */
            ::-webkit-scrollbar {
            width: 0.25rem;
            }

            /* Track */
            ::-webkit-scrollbar-track {
                border-radius: 2px;
                background: ;
            }
            
            /* Handle */
            ::-webkit-scrollbar-thumb {
                background: #6649b8; 
                border-radius: 2px;
            }

            
        </style>
        <script type="text/javascript">
            window.Laravel = {!! json_encode([
                'baseUrl' => url('/'),
                'csrfToken' => csrf_token(),
            ]) !!};
        </script>
    </head>
    <body>
        <div id="root"></div>
    <script type="text/javascript" src="{{ asset('public/js/app.js') }}"></script>
    </body>
</html>
