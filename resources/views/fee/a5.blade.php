<!doctype html>
<meta charset="utf-8">
<!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.css"> -->
<style>
@media print 
{
   /* @page
   {
    size: 8.5in 5.5in;
    size: landscape;
  } */
}
    @page {
        size: auto !important;
    }
    .title{
        text-transform: uppercase;        
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 30px;
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
    .footer{
        font-size: 12px;
        position:absolute;
        bottom:0;
    }
    .detail p {margin-bottom: 0.4rem !important;}
    .info{
        margin-bottom: 5px;
        font-size: 18px;
    }
    .lien-2{
        margin-top: 200px;
    }
    h3, h4{
        font-size: 20px;

    }
    .tg  {border-collapse:collapse;border-color:black;border-spacing:0;}
    .tg td{background-color:white;border-color:black;border-style:solid;border-width:1px;color:black;
    font-family:Arial, sans-serif;font-size:13px;overflow:hidden;padding:1px 5px;word-break:normal;}
    .tg th{background-color:white;border-color:black;border-style:solid;border-width:1px;color:#493F3F;
    font-family:Arial, sans-serif;font-size:13px;font-weight:normal;overflow:hidden;padding:2px 5px;word-break:normal; font-size: 13px;}
    .tg .tg-1wig{font-weight:bold;text-align:left;vertical-align:top}
    .tg .tg-l2oz{font-weight:bold;text-align:right;vertical-align:top}
    .tg .tg-sjuo{background-color:white;text-align:left;vertical-align:top}
    .tg .tg-cgaz{background-color:#white;text-align:right;vertical-align:top}

    * {
        line-height: inherit;
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
                <div class="col-sm header-left">
                    <img src="/public/images/logos/logo-1.png" alt="logo" width="190px">

                </div>
                <div class="col-sm header-right text-right">
                    <b> HỆ THỐNG GIÁO DỤC VIETELITE </b><br>
                    {{$result['center_address']}}<br>
                    Hotline: {{$result['center_phone']}}
                </div>
                
            </div>
            <div class="row">
                <div class="col-sm centered">
                    <h3 class="title">{{str_replace('[VIETELITE]', '', $result['title'])}}<h3>
                </div>
            </div>
            <div class="row info">
                <div class="col-sm"><b>Học sinh: {{$result['student']}}</b></div>
                <div class="col-sm"></div>
                <div class="col-sm">

                    <b>Lớp :</b> {{$result['classes']}}
                </div>
            </div>
            Thông tin chi tiết học phí của con, phụ huynh vui lòng xem trong bảng kê dưới đây:<br>
            <div class="row">
                <div class="col-8">
                    <table class="tg" style="" width="100%">
                        <thead>
                        <tr>
                            <th class="tg-1wig" style="text-align: center; vertical-align: middle;">Lớp </th>
                            <th class="tg-1wig">Nội dung</th>
                            <th class="tg-l2oz">Đơn giá</th>
                            <th class="tg-1wig">Số ca/buổi</th>
                            <th class="tg-l2oz">Thành tiền</th>
                        </tr>
                        </thead>
                        <tbody>
                            <?php $count = 0?>
                            @foreach($result['data'] as $key =>  $fee) 
                            <tr>
                                <td class="tg-sjuo" style="text-align: center; vertical-align: middle;" rowspan={{sizeof($fee)+1}}>{{$key}}</td>
                                <td class="tg-sjuo">{{$fee[0]['content']}}</td>
                                <td class="tg-cgaz">{{number_format ($fee[0]['dg'])}}</td>
                                <td class="tg-sjuo">{{$fee[0]['sl']}}</td>
                                <td class="tg-cgaz">{{number_format ($fee[0]['amount'])}}</td>
                            </tr>  
                            
                                @foreach($fee as $n => $f)
                                <tr>
                                    @if($n == 0)
                                    @else 
                                        <td class="tg-sjuo">{{$f['content']}}</td>
                                        <td class="tg-cgaz">{{number_format ($f['dg'])}}</td>
                                        <td class="tg-sjuo">{{$f['sl']}}</td>
                                        <td class="tg-cgaz">{{number_format ($f['amount'])}}</td>
                                    @endif
                                </tr>  
                                @endforeach
                                                
                            @endforeach                    
                            <tr>
                                <td class="tg-sjuo"></td>
                                <td class="tg-sjuo"></td>
                                <td class="tg-cgaz"></td>
                                <td class="tg-sjuo" style="font-weight: bold;">Tổng</td>
                                <td class="tg-cgaz" style="font-weight: bold;">{{number_format ($result['sum_amount'])}}đ</td>
                            </tr>
                            
                        </tbody>
                    </table>   
                    <span class="sum">Tổng học phí cần đóng: <strong>{{number_format ($result['sum_amount'])}}đ</strong></span>
                </div>
                <div class="col-4">
                    <i><b>Chú ý: </b></i>
                    <ul>
                        <li><i>Học phí bắt buộc phải hoàn thành trước ngày</i> <strong>
                        @if($result['center_id'] == 3)
                            21/10/2020
                        @else
                            21/10/2020
                        @endif
                        </strong> </li>
                        <li><i>Trong trường hợp nếu con chưa hoàn thành học phí trung tâm không thể cho con vào lớp. </i></li>
                        <li><i>Đối với học sinh học <b>3 môn trở lên </b>, có <b>anh/chị/em ruột học tại trung tâm</b> hoặc <b>có thẻ AMSER PASS </b> sẽ được giảm 5% học phí.(Yêu cầu: bản sao Sổ Hộ Khẩu)</i></li>
                    </ul>
                </div>
            </div>
            <div class="row footer">
            <div class="col-sm">   
            Phụ huynh có thể nộp tiền mặt tại quầy lễ tân hoặc thanh toán chuyển khoản. <br/>
            <strong>THÔNG TIN THANH TOÁN:</strong> <br/>

            @switch($result['center_id'])
                @case(5)
                                         
                            * NH:<strong> ACB CN Huỳnh Thúc Kháng </strong><br/>
                            Chủ TK: Phan Việt Anh <br/>
                            Số TK:<a href="#"><strong>26856688</strong> </a>  <br/>
                            *Nội dung chuyển khoản: <a href="#"><strong id="content-banking">{{$result['content']}}_HP10,11</strong> </a> 
                        </div>
                        <div class="col-sm">
                            <strong>ĐỂ ĐƯỢC XÁC NHẬN ĐÃ CHUYỂN KHOẢN THÀNH CÔNG: </strong><br/>
                            Quý phụ huynh vui lòng chụp lại màn hình biên lai/ sao kê ngân hàng và gửi vào Email: ketoantrungyen@vietelite.edu.vn  <br/>
                            Mọi thắc mắc vui lòng gọi đến số Hotline: 024.73065565 nhánh 4 hoặc <a href='tel: 0366765565'>03667.65565</a>  để được giải đáp kịp thời. <br/>
                        </div>
                        
                    </div>
                    @break

                @case(2)
                @case(4)
                    <div class="row header">
                        <div class="col-sm">                        
                            Ngân hàng: <strong>VIB CN Ba Đình </strong> <br/>
                            Chủ TK: Phan Việt Anh<br/>
                            Số TK: <a href="#"><strong>015704060030799</strong> </a> <br/>
                            *Nội dung chuyển khoản: <a href="#"><strong id="content-banking">{{$result['content']}}_HP10,11</strong> </a> 
                        </div>
                        <div class="col-sm">
                            <strong>ĐỂ ĐƯỢC XÁC NHẬN ĐÃ CHUYỂN KHOẢN THÀNH CÔNG: </strong><br/>
                            Quý phụ huynh vui lòng chụp lại màn hình biên lai/ sao kê ngân hàng và gửi vào Email: ketoancs1@vietelite.edu.vn  <br/>
                            Mọi thắc mắc vui lòng gọi đến số Hotline: 024.73065565 nhánh 1 hoặc <a href='tel: 0962136604'>096.213.6604</a>để được giải đáp kịp thời. <br/>                    
                        </div>
                    </div>
                    @break
                @case(3)
                    Ngân hàng: <strong>TCB CN THĂNG LONG</strong> <br/>
                    Chủ TK: Bùi Huyền Nga<br/>
                    Số TK: <a href="#"><strong>19031311633868 </strong> </a> <br/>
                    Nội dung chuyển khoản: <a href="#"><strong id="content-banking">{{$result['content']}}_HP10,11</strong> </a> 
                    <br/>
                    <br>

                    <strong>ĐỂ ĐƯỢC XÁC NHẬN ĐÃ CHUYỂN KHOẢN THÀNH CÔNG: </strong><br/>
                    Quý phụ huynh vui lòng chụp lại màn hình biên lai/ sao kê ngân hàng và gửi vào Email: cs.phamtuantai@vietelite.edu.vn  <br/>
                    Mọi thắc mắc vui lòng gọi đến số Hotline: 024.73065565 nhánh 2 hoặc <a href='tel: 0949845665'>0949.845.665 </a> để được giải đáp kịp thời. <br/>
                    @break
                @default
                    * NH:<strong> ACB CN Huỳnh Thúc Kháng </strong><br/>
                    Chủ TK: Phan Việt Anh <br/>
                    Số TK:<a href="#"><strong>26856688</strong> </a>  <br/>
                    *Nội dung chuyển khoản: <a href="#"><strong id="content-banking">{{$result['content']}}_HP10,11</strong> </a> 
                    <br/><br>

                    <strong>ĐỂ ĐƯỢC XÁC NHẬN ĐÃ CHUYỂN KHOẢN THÀNH CÔNG: </strong><br/>
                    Quý phụ huynh vui lòng chụp lại màn hình biên lai/ sao kê ngân hàng và gửi vào Email: ketoantrungyen@vietelite.edu.vn  <br/>
                    Mọi thắc mắc vui lòng gọi đến số Hotline: 024.73065565 nhánh 4 hoặc <a href='tel: 0366765565'>03667.65565</a>  để được giải đáp kịp thời. <br/>
                    @break
            @endswitch
    
        </div>
    </section>
</body>