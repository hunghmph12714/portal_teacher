<!doctype html>
<meta charset="utf-8">
<!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.css"> -->
<style>
    @page {
        size: auto !important;
    }

    body{
        font-family:  "Times New Roman", Times, serif !important;
    }
    .padding-5mm{
        padding-top: 12px;
    }
    .centered{
        text-align: center;
    }
    .header-right{
        font-size: 16px;
    }
    .header{
        margin-bottom: 12px;
    }
    .header-middle{
        font-size: 19px;
        text-transform: uppercase;
    }
    .phieu-chi{
        font-size: 26px;
    }
    .date{
        font-size: 19px;
    }
    .detail{
        padding-left: 25px;
        font-size: 18px;
    }
    .detail p {margin-bottom: 0.4rem !important;}
    .sign b{
        font-size: 18px;
    }
    .sign i{
        font-size: 16px;
    }
    .sign .sign-name{
        font-size: 16px;

    }
    .sign-name{
        position: relative;
        top: 73%;
    }
    .info{
        margin-bottom: 20px;
        font-size: 18px;
    }
    .lien-2{
        margin-top: 200px;
    }
</style>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>

<body class="A5">

    <!-- Each sheet element should have the class "sheet" -->
    <!-- "padding-**mm" is optional: you can set 10, 15, 20 or 25 -->
    <section class="sheet padding-5mm">
        <div class="container ">
            <div class="row header">
                <div class="col-sm centered">
                    <img src="/public/images/logos/logo-1.png" alt="logo" width="290px">
                </div>
                <div class="col-sm centered header-middle">
                    <b> Công ty cổ phần đầu tư và phát triển Việt Tinh Hoa </b>
                    
                </div>
                <div class="col-sm centered header-right">
                    <b>Mẫu số 01 - TT</b><br>
                    <i>(Ban hành theo thông tư 133/2016/TT-BTC Ngày 26/8/2016 của Bộ Tài Chính)</i>
                </div>
            </div>
            <div class="row">
                <div class="col-sm title centered">
                    @if ($paper['type'] == 'receipt')
                        <b class="phieu-chi">PHIẾU THU</b> <br>
                    @elseif ($paper['type'] == 'payment')
                        <b class="phieu-chi">PHIẾU CHI</b> <br>
                    @endif
                    
                    <b class="date"> <i> {{ $paper['time'] }}</i></b>
                </div>
            </div>
            <div class="row info">
                <div class="col-sm"></div>
                <div class="col-sm"></div>
                <div class="col-sm">
                    @if ($paper['type'] == 'receipt')
                        <b>Số :</b> PT-{{$paper['method'] ."-". $paper['receipt_number']}} <br>
                    @elseif ($paper['type'] == 'payment')
                        <b>Số :</b> PC{{$paper['payment_number']}} <br>
                    @endif
                    
                    <b>Cơ sở :</b> {{$paper['ctname']}}
                </div>
            </div>
            
            <div class="row detail">
                @if ($paper['type'] == 'receipt')
                        <p>Họ tên người nộp tiền : <b>{{$paper['name']}}</b></p>
                    @elseif ($paper['type'] == 'payment')
                        <p>Họ tên người nhận tiền : <b>{{$paper['name']}}</b></p>
                @endif    
            </div>
            <div class="row detail">
                <p>Địa chỉ:<b> {{$paper['address']}}</b></p>                
            </div>
            <div class="row detail">
                <p>Lý do chi: <b>{{$paper['description']}}</b></p>                
            </div>
            <div class="row detail">
                <p>Số tiền: <b>{{$paper['amount']}}đ</b></p>                
            </div>
            <div class="row detail">
                <p>Viết bằng chữ: <b>{{$paper['amount_str']}} đồng</b></p>                
            </div>
            <div class="row detail">
                <p>Kèm theo: ........... chứng từ gốc</p>                
            </div>
            <div class="row ">
                <div class="col-sm"></div>
                <div class="col-sm"></div>
                <div class="col-sm centered">
                    <i>{{ $paper['time'] }}</i> 
                </div>
            </div>
            <div class="row">
                <div class="col-sm sign centered">
                    <b>Giám đốc</b><br>
                    <i>(Ký, họ tên, đóng dấu)</i>
                </div>
                <div class="col-sm sign centered">
                    <b>Kế toán trưởng</b><br>
                    <i>(Ký, họ tên)</i>
                </div>
                <div class="col-sm sign centered">
                    @if ($paper['type'] == 'receipt')
                            <b>Người nộp tiền</b><br>
                        @elseif ($paper['type'] == 'payment')
                            <b>Thủ quỹ</b><br>
                    @endif                      
                    <i>(Ký, họ tên)</i>
                </div>
                <div class="col-sm sign centered">
                    <b>Người lập phiếu</b><br>
                    <i>(Ký, họ tên)</i> <br>
                    <span class="sign-name">{{$paper['uname']}}</span>
                </div>
                <div class="col-sm sign centered">
                    @if ($paper['type'] == 'receipt')
                            <b>Thủ quỹ</b><br>
                        @elseif ($paper['type'] == 'payment')
                            <b>Người nhận</b><br>
                    @endif  
                    <i>(Ký, họ tên)</i>
                </div>
            </div>
        </div>
    </section>
    <!-- <section class="sheet padding-5mm lien-2">
        <div class="container ">
            <div class="row header">
                <div class="col-sm centered">
                    <img src="/public/images/logos/logo-1.png" alt="logo" width="290px">
                </div>
                <div class="col-sm centered header-middle">
                    <b> Công ty cổ phần đầu tư và phát triển Việt Tinh Hoa </b>
                    
                </div>
                <div class="col-sm centered header-right">
                    <b>Mẫu số 01 - TT</b><br>
                    <i>(Ban hành theo thông tư 133/2016/TT-BTC Ngày 26/8/2016 của Bộ Tài Chính)</i>
                </div>
            </div>
            <div class="row">
                <div class="col-sm title centered">
                    @if ($paper['type'] == 'receipt')
                        <b class="phieu-chi">PHIẾU THU</b> <br>
                    @elseif ($paper['type'] == 'payment')
                        <b class="phieu-chi">PHIẾU CHI</b> <br>
                    @endif
                    
                    <b class="date"> <i> {{ $paper['time'] }}</i></b>
                </div>
            </div>
            <div class="row info">
                <div class="col-sm"></div>
                <div class="col-sm"></div>
                <div class="col-sm">
                    @if ($paper['type'] == 'receipt')
                        <b>Số :</b> PT{{$paper['receipt_number']}} <br>
                    @elseif ($paper['type'] == 'payment')
                        <b>Số :</b> PC{{$paper['payment_number']}} <br>
                    @endif
                    
                    <b>Cơ sở :</b> {{$paper['ctname']}}
                </div>
            </div>
            
            <div class="row detail">
                @if ($paper['type'] == 'receipt')
                        <p>Họ tên người nộp tiền : <b>{{$paper['name']}}</b></p>
                    @elseif ($paper['type'] == 'payment')
                        <p>Họ tên người nhận tiền : <b>{{$paper['name']}}</b></p>
                @endif    
            </div>
            <div class="row detail">
                <p>Địa chỉ:<b> {{$paper['address']}}</b></p>                
            </div>
            <div class="row detail">
                <p>Lý do chi: <b>{{$paper['description']}}</b></p>                
            </div>
            <div class="row detail">
                <p>Số tiền: <b>{{$paper['amount']}}đ</b></p>                
            </div>
            <div class="row detail">
                <p>Viết bằng chữ: <b>{{$paper['amount_str']}} đồng</b></p>                
            </div>
            <div class="row detail">
                <p>Kèm theo: ........... chứng từ gốc</p>                
            </div>
            <div class="row ">
                <div class="col-sm"></div>
                <div class="col-sm"></div>
                <div class="col-sm centered">
                    <i>{{ $paper['time'] }}</i> 
                </div>
            </div>
            <div class="row">
                <div class="col-sm sign centered">
                    <b>Giám đốc</b><br>
                    <i>(Ký, họ tên, đóng dấu)</i>
                </div>
                <div class="col-sm sign centered">
                    <b>Kế toán trưởng</b><br>
                    <i>(Ký, họ tên)</i>
                </div>
                <div class="col-sm sign centered">
                    @if ($paper['type'] == 'receipt')
                            <b>Người nộp tiền</b><br>
                        @elseif ($paper['type'] == 'payment')
                            <b>Thủ quỹ</b><br>
                    @endif                      
                    <i>(Ký, họ tên)</i>
                </div>
                <div class="col-sm sign centered">
                    <b>Người lập phiếu</b><br>
                    <i>(Ký, họ tên)</i> <br>
                    <span class="sign-name">{{$paper['uname']}}</span>
                </div>
                <div class="col-sm sign centered">
                    @if ($paper['type'] == 'receipt')
                            <b>Thủ quỹ</b><br>
                        @elseif ($paper['type'] == 'payment')
                            <b>Người nhận</b><br>
                    @endif  
                    <i>(Ký, họ tên)</i>
                </div>
            </div>
        </div>
    </section> -->
</body>