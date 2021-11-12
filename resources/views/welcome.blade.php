<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, minimal-ui, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"/>
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-title" content="VEE">
        <meta http-equiv='cache-control' content='no-cache'>
        <meta http-equiv='expires' content='0'>
        <meta http-equiv='pragma' content='no-cache'>
        <title>VieElite Education</title>
        <link
            href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.css"
            rel="stylesheet"
        />
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
    <script src="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js"></script>
    <script src="/public/js/ckeditor5-build-classic/build/ckeditor.js"></script>

    <script type="text/javascript" src="{{ asset('public/js/app.js') }}"></script>
    <script>
        
    </script>
    </body>
</html>
