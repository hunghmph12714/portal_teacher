@extends('layouts.email')
@section('banner')

<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;background-image:url('https://center.vietelite.edu.vn/images/background.jpg');background-position:top center;background-repeat:no-repeat; background-size: cover;">
	<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
	<!--[if (mso)|(IE)]><td align="center" width="640" style=";width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
	<div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
		<div style="width:100% !important;">
		<!--[if (!mso)&(!IE)]><!-->
			<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
			<!--<![endif]-->
			<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 15px; padding-left: 15px; padding-top: 30px; padding-bottom: 30px; font-family: Arial, sans-serif"><![endif]-->
				<div style="color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:1.2;padding-top:30px;padding-right:15px;padding-bottom:30px;padding-left:15px;">
					<div style="line-height: 1.2; font-size: 12px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; color: #555555; mso-line-height-alt: 14px;">
						<p style="font-size: 30px; line-height: 1.2; word-break: break-word; text-align: center; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 36px; margin: 0;"><span style="color: #ffffff; font-size: 4vh;"><strong>THÔNG BÁO HỌC PHÍ<br/></strong></span></p>
					</div>
				</div>
			<!--[if mso]></td></tr></table><![endif]-->
			<!--[if (!mso)&(!IE)]><!-->
			</div>
		<!--<![endif]-->
		</div>
	</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
@endsection
@section('content')
<p>Kính gửi phụ huynh,
<br>
{{$result['title']}} của con <strong>{{$result['student']}}</strong><br>
Thông tin chi tiết học phí của con, phụ huynh vui lòng xem trong bảng kê dưới đây:<br>
@foreach($result['data'] as $key =>  $fee)
    @if($fee[0]['amount'] == 0)
        @continue
    @endif
    @if(!$key)
    <h3>KHÁC</h3>    
    @else
    <h3>THÁNG {{$key}}</h3>    
    @endif
    
    <table class="tg" style="" width="100%">
    <thead>
    <tr>
        <th class="tg-1wig">Lớp </th>
        <th class="tg-1wig">Nội dung</th>
        <th class="tg-l2oz">Đơn giá * Số ca/buổi</th>
        <th class="tg-l2oz">Thành tiền</th>
    </tr>
    </thead>
    <tbody>
        <?php $count = 0?>
        @foreach($fee as $f)
        <?php $count+= $f['amount']?>
        <tr>
            <td class="tg-sjuo">{{$f['cname']}}</td>
            <td class="tg-sjuo">{{$f['content']}}</td>
            <td class="tg-cgaz">{{$f['session_fee']}}</td>
            <td class="tg-cgaz">{{number_format ($f['amount'])}}</td>
        </tr>        
        @endforeach
        <tr>
            <td class="tg-sjuo"></td>
            <td class="tg-sjuo"></td>
            <td class="tg-sjuo">Tổng</td>
            <td class="tg-cgaz">{{number_format ($count)}}</td>
        </tr>
        
    </tbody>
    </table>
    @endforeach

<br>
<p>
@if($result['sum_amount'] > 0)
<h3>Tổng học phí cần đóng: <strong>{{number_format ($result['sum_amount'])}}đ</strong><br></h3>
@else
<h3>Học phí còn thừa: <strong>{{number_format (abs($result['sum_amount']))}}đ</strong><br></h3>
@endif
<span><i>Ghi chú: {{$result['note']}}</i></span>
<i><h4>Chú ý: </h4></i>
<ul>

    <li><i>Học phí bắt buộc phải hoàn thành trước ngày: {{$result['max_date']}}</i> <strong>
    </strong> </li>
    <li><i>Trong trường hợp nếu con chưa hoàn thành học phí trung tâm không thể cho con vào lớp. </i></li>
    <li><i>Đối với học sinh học <b>3 môn trở lên </b>, có <b>anh/chị/em ruột học tại trung tâm</b> 
    hoặc <b>có thẻ AMSER PASS </b> sẽ được giảm 5% học phí.(Yêu cầu: bản sao Sổ Hộ Khẩu). 
    </i></li>
    <li><b>Lưu ý: </b><i>Các ưu đãi trên không áp dụng đồng thời VÀ không áp dụng trong thời gian học ONLINE</i</li>
</ul>
<strong>THÔNG TIN THANH TOÁN:</strong> <br/>

    *NH: <strong>VIB chi nhánh Ba Đình</strong> <br/>
    Chủ TK: Phan Việt Anh<br/>
    Số TK: <a href="#"><strong>385666888</strong> </a> <br/>
    *Nội dung chuyển khoản: <a href="#"><strong id="content-banking">{{$result['content']}}</strong> </a> 
    
<br/><br>
<!-- @if($result['center_id'] == 5)
   
    <strong>ĐỂ ĐƯỢC XÁC NHẬN ĐÃ CHUYỂN KHOẢN THÀNH CÔNG: </strong><br/>
    Quý phụ huynh vui lòng chụp lại màn hình biên lai/ sao kê ngân hàng và gửi vào Email: ketoantrungyen@vietelite.edu.vn  <br/>
    Mọi thắc mắc vui lòng gọi đến số Hotline: 024.73065565 nhánh 4 hoặc <a href='tel: 0962136604'>0366.765.565</a>để được giải đáp kịp thời. <br/>

@else
<h3></b>Hiện tại hệ thống tài khoản ngân hàng của trung tâm đang gặp sự cố, quý Phụ Huynh vui lòng nộp tiền mặt tại quầy lễ tân.</b></h3><br/>
Mọi thắc mắc vui lòng gọi đến số Hotline: 024.73065565 nhánh 4 hoặc <a href='tel: 0366765565'>0366.765.565</a>để được giải đáp kịp thời. <br/>
@endif -->

<!-- <strong>THÔNG TIN THANH TOÁN:</strong> <br/> -->

@switch($result['center_id'])
    @case(5)
        <!-- *NH: <strong>VIB chi nhánh Ba Đình</strong> <br/>
        Chủ TK: Phan Việt Anh<br/>
        Số TK: <a href="#"><strong>385666888</strong> </a> <br/>
        *Nội dung chuyển khoản: <a href="#"><strong id="content-banking">{{$result['content']}}_HP{{$result['months']}}</strong> </a> 
        <br/><br>
-->
        <strong>ĐỂ ĐƯỢC XÁC NHẬN ĐÃ CHUYỂN KHOẢN THÀNH CÔNG: </strong><br/>
            Quý phụ huynh vui lòng chụp lại màn hình biên lai/ sao kê ngân hàng và gửi vào Email: ketoantrungyen@vietelite.edu.vn  <br/>
            Mọi thắc mắc vui lòng gọi đến số Hotline: 024.73065565 nhánh 4 hoặc <a href='tel: 0962136604'>0366.765.565</a>để được giải đáp kịp thời. <br/>

        @break 
    @case(2)
    @case(4)
        <!-- *NH: <strong>VIB chi nhánh Ba Đình</strong> <br/>
        Chủ TK: Phan Việt Anh<br/>
        Số TK: <a href="#"><strong>385666888</strong> </a> <br/>
        *Nội dung chuyển khoản: <a href="#"><strong id="content-banking">{{$result['content']}}_HP{{$result['months']}}</strong> </a> 
        <br/><br>-->

        <strong>ĐỂ ĐƯỢC XÁC NHẬN ĐÃ CHUYỂN KHOẢN THÀNH CÔNG: </strong><br/>
        Quý phụ huynh vui lòng chụp lại màn hình biên lai/ sao kê ngân hàng và gửi vào Email: ketoancs1@vietelite.edu.vn  <br/>
        Mọi thắc mắc vui lòng gọi đến số Hotline: 024.73065565 nhánh 1 hoặc <a href='tel: 0962136604'>096.213.6604</a>để được giải đáp kịp thời. <br/>
        @break 
    @case(3)
        <!-- * NH: <strong>TCB CN THĂNG LONG</strong> <br/>
        Chủ TK: Bùi Huyền Nga<br/>
        Số TK: <a href="#"><strong>19031311633868 </strong> </a> <br/>
        *Nội dung chuyển khoản: <a href="#"><strong id="content-banking">{{$result['content']}}_HP{{$result['months']}}</strong> </a> 
        <br/>
        <br>-->

        <strong>ĐỂ ĐƯỢC XÁC NHẬN ĐÃ CHUYỂN KHOẢN THÀNH CÔNG: </strong><br/>
        Quý phụ huynh vui lòng chụp lại màn hình biên lai/ sao kê ngân hàng và gửi vào Email: cs.phamtuantai@vietelite.edu.vn  <br/>
        Mọi thắc mắc vui lòng gọi đến số Hotline: 024.73065565 nhánh 2 hoặc <a href='tel: 0949845665'>0949.845.665</a>  để được giải đáp kịp thời. <br/> 
        @break
    @default
    
@endswitch


Trân trọng! 

</p>
</p>
@endsection

