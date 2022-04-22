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
						<p style="font-size: 30px; line-height: 1.2; word-break: break-word; text-align: center; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 36px; margin: 0;"><span style="color: #ffffff; font-size: 4vh;"><strong>XÁC NHẬN ĐĂNG KÝ<br/></strong></span></p>
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
Kính gửi phụ huynh con <b>{{$result['student']['name']}}</b>,<br/>
Cảm ơn quý phụ huynh đã tin tưởng và lựa chọn Viet Elite Education trong kỳ thi thử cho con sắp tới. Chúng tôi đã nhận được thông tin đăng ký của Quý phụ huynh. <br/>
Để hoàn thành thủ tục đăng ký, Quý phụ huynh vui lòng thanh toán Lệ phí thi trước thời gian quy định.<br/>
</p>
<div class="container">
  <div class="row">
    <div class="col-sm">
      <h3> <u>Môn thi </u></h3>     
      <table class="tg" style="" width="100%">
        <thead>
        <tr>
            <th class="tg-1wig">Môn thi</th>
            <th class="tg-1wig">Ngày thi</th>
            <th class="tg-1wig">Hình thức thi</th>
        </tr>
        </thead>
        <tbody>
          
            @foreach($result['product'] as $product)
            <tr>
              <td>{{$product['content']}}  </td>
              <td>
                  {{$product['time_formated']}} 
              <!--9/4 -15/4-->
              </td>
              <td>{{$product['note']}}  </td>
            </tr>
            @endforeach
          
        </tbody>
      </table>
    </div>
    <div class="col-sm">
        <h3><u> Lệ phí thi </u></h3>
        <b>Số tiền: </b> {{number_format($result['total_fee'])}} đ<br/>
        <b>Địa điểm thi: </b>
        <!--{{$result['location']}}-->   83 Xuân Quỳnh, Trung Hoà, Cầu Giấy, Hà Nội
        <br/>
    </div>    
  </div>
  <div class="row">
    <div class="col-sm">
      <h3> <u>Thanh toán Chuyển khoản </u></h3>
      
      <b> Ngân hàng:</b> Sài Gòn Hà Nội SHB, CN Kinh Đô, PGD Kim Giang <br/>
      <b> Số tài khoản:</b> 8818698888 <br/>
      <b> Chủ tài khoản:</b> Phan Việt Anh <br/>
      <b> Nội dung CK:</b> {{$result['ck_content']}} <br/>
    </div>
    
    
    
<!--    THÔNG TIN THANH TOÁN:-->
<!--NH: Sài Gòn Hà Nội SHB, CN Kinh Đô, PGD Kim Giang-->
<!--Chủ TK: Phan Việt Anh-->
<!--Số TK: 8818698888-->
<!--Nội dung chuyển khoản: KS6_Họ và tên_số điện thoại-->
    <div class="col-sm">
        <h3> <u>Thanh toán Tiền mặt </u></h3>
        <b> Tại các địa điểm </b>
        <ul>
          <li>
      83 Xuân Quỳnh, Trung Hoà, Cầu Giấy, Hà Nội
          </li>
          <li>
            Nhà 33, ngõ 91 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội
          </li>
          <li>
            Nhà 5, ngõ 3 Phạm Tuấn Tài, Dịch Vọng Hậu, Cầu Giấy, Hà Nội 
          </li>
          <li>
            Nhà 17, ngõ 26 Đỗ Quang, Trung Hòa, Cầu Giấy, Hà Nội   
          </li>
          
        </ul>
    </div>    
  </div>
  <p>Đồng thời, Quý phụ huynh vui lòng kiểm tra lại thông tin đăng ký. Trong trường hợp thông tin chưa chính xác, Quý phụ huynh vui lòng email đến địa chỉ thithu@vietelite.edu.vn để cập nhật, chỉnh sửa.</p>
  <table class="tg" style="" width="100%">
    <thead>
    <tr>
        <th class="tg-1wig">Họ và tên</th>
        <th class="tg-1wig">Ngày sinh</th>
        <th class="tg-1wig">Trường</th>
        <th class="tg-1wig">Email</th>
        <th class="tg-1wig">Số điện thoại</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>{{$result['student']['name']}}  </td>
          <td>{{$result['student']['dob']}}  </td>
          <td>{{$result['student']['school']}}  </td>
          <td>{{$result['parent']['email']}}  </td>
          <td>{{$result['parent']['phone']}}  </td>
        </tr>
    </tbody>
  </table>
    	

<p>Mọi thắc mắc quý phụ huynh vui lòng liên hệ tới Viet Elite để được hỗ trợ sớm nhất! Email: thithu@vietelite.edu.vn - Điện thoại: 024.730.65565 <br/>
Trân trọng,<br/>
Phòng Đào tạo & Khảo thí<br/>
HỆ THỐNG GIÁO DỤC VIET ELITE</p>
</div>
@endsection

