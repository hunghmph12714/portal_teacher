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
            body{
                background-color:white;
            }
            .center{
                display:flex;
                align-items: center;
                justify-content: center;
                height: 600px;
            }
            p, h3{
                text-align: center;
            }
            .center button{
                background: white;
                border: 2px solid green;
                align: center;
                width: 100%;
                border-radius: 7px;
                padding: 10px 15px;
            }
            .center button:hover{
                background: green;
                border: 2px solid white;
                color: white;
            }
            .center button:hover a{
                color: white;
            }
            .center button a{
                text-decoration: none;
                color: green;
            }
        </style>
        
        
    </head>
    <body>
        <div class="center">
        
        <div class="text">
            <img src="/public/images/logos/401.jpg" width="500">
            <h3>Oooops...</h3>
            <p> Bạn không có quyền truy cập, vui lòng liên hệ quản trị viên.</p>
            <a href="/"><button href="/">QUAY LẠI TRANG CHỦ</button> </a>
        </div>
        </div>
    </body>
</html>
