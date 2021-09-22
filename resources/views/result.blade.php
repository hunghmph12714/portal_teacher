<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '566336567649816');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=566336567649816&ev=PageView&noscript=1"
/></noscript>
<!-- End Facebook Pixel Code -->
<noscript>
  <img height="1" width="1" style="display:none" 
       src="https://www.facebook.com/tr?id={your-pixel-id-goes-here}&ev=PageView&noscript=1"/>
</noscript>
<!-- End Facebook Pixel Code -->
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css">
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous">

    <style>
    .ui-autocomplete {
        overflow: auto;
        height: 300px;
    }
    label{
        font-weight: bold;
    }
    h1{
        font-size: 32px;
        color: #6ebe45;
        margin-bottom: 40px;
        font-weight: 500;
    }
    h2{
        background-color: #6EBE45;
        color: #fff;
        padding: 5px 10px 5px 10px !important;
        font-weight: 700;
        font-size: 1.25em;
    }
    h4{
        font-size: 1rem;
        font-weight: bold;
    }
    .domain{
        margin-right: 15px;
    }
    #course{
        padding: 15px;
    }
    h5{
        background: #6EBE45;
        padding: 5px;
        color: white;
    }
    .btn-vee{
        background: linear-gradient(90deg, rgba(117,186,100,1) 0%, rgba(25,165,124,1) 54%, rgba(0,158,139,1) 100%);
        font-size: 19px;
        padding: 10px 54px;
        font-weight: 500;
        font-weight: bold;
        text-transform: uppercase;
    }
    </style>
  </head>
  <body>
    
    <div class="container-fluid">
        <h1>Tra cứu điểm thi Vào 10 Thành phố Hà Nội </h1>
        <table class="table">
        <thead>
            <tr>
            <th scope="col">Tên HS</th>
            <th scope="col">Ngày sinh</th>
            <th scope="col">Lớp</th>
            <th scope="col">SBD</th>
            <th scope="col">Kết quả</th>
            </tr>
        </thead>
        <tbody>
            @foreach($result as $r)
                <tr>
                    <td>{{$r[0]}}</td>
                    <td>{{$r[1]}}</td>
                    <td>{{$r[2]}}</td>
                    <td>{{$r[3]}}</td>
                    <td>{{$r[4]}}</td>
                </tr>
            @endforeach
        </tbody>
        </table>
    </div>

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-1.9.1.js"></script>
    <script src="https://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.15/jquery.mask.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js" crossorigin="anonymous"></script>
    
  </body>
</html>
