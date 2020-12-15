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
						<p style="font-size: 30px; line-height: 1.2; word-break: break-word; text-align: center; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 36px; margin: 0;"><span style="color: #ffffff; font-size: 4vh;"><strong>GHI DANH THI THỬ HOÀN TẤT<br/></strong></span></p>
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
<p>
Kính gửi phụ huynh con <b>{{$result['student_name']}}</b>,<br/><br/>
Cảm ơn quý phụ huynh đã tin tưởng và lựa chọn chúng tôi trong kỳ thi thử cho con. VietElite xác nhận quý phụ huynh đã thanh toán thành công lệ phí thi thử năm học 2021 cho con.<br/><br/>
VietElite xin gửi tới quý phụ huynh một số thông tin quan trọng để giúp quý phụ huynh dễ dàng theo dõi các thông tin trước kỳ thi và cách thức tra cứu điểm cho con sau kỳ thi.
<div class="container">
  <div class="row">
    <div class="col-sm">
        <h3><u>Thông tin xác nhận lệ phí</u></h3>
        <ul>
          <li>
            <b> Lệ phí đã đóng: </b> {{number_format($result['total_fee'])}}đ
          </li>
          <li>
            <b> Phiếu thu: </b> {{$result['receipt_number']}} 
          </li>
        </ul>
    </div>
    <div class="col-sm">
        <h3><u>Thông tin Số báo danh</u></h3>
        <ul>
          <li>
            <b> Số báo danh: </b> {{$result['sbd']}} 
          </li>
          <li>
            <b> Mã cá nhân: </b> {{$result['pass']}} 
          </li>
          <li>
             Tra cứu thông tin và kết quả thi: <a href="https://thithu.info/tra-cuu">https://thithu.info/tra-cuu</a>
          </li>
        </ul>
    </div>    
  </div>   	

<p>Mọi thắc mắc quý phụ huynh vui lòng liên hệ tới Viet Elite để được hỗ trợ sớm nhất! Email: thithu@vietelite.edu.vn - Điện thoại: 024.730.65565 <br/>
Trân trọng,<br/>
Phòng Đào tạo & Khảo thí<br/>
HỆ THỐNG GIÁO DỤC VIET ELITE</p>
</div>
@endsection

