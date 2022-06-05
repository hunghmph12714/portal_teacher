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
						<p style="font-size: 30px; line-height: 1.2; word-break: break-word; text-align: center; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 36px; margin: 0;"><span style="color: #ffffff; font-size: 4vh;"><strong>THÔNG TIN TÀI KHOẢN TEAMS<br/></strong></span></p>
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
Kính gửi Phụ huynh Học sinh <b>{{$result['student_name']}}</b>,<br/><br/>

<div class="container">
  <div class="row">
    <div class="col-sm">
        <h3><u>THÔNG TIN ĐĂNG NHẬP MICROSOFT TEAMS</u></h3>
        <ul>
          <li>
            <b> Đường link đăng nhập: </b> <a href="https://login.microsoftonline.com/common/oauth2/v2.0/authorize?response_type=id_token&scope=openid%20profile&client_id=5e3ce6c0-2b1f-4285-8d4b-75ee78787346&redirect_uri=https%3A%2F%2Fteams.microsoft.com%2Fgo&state=eyJpZCI6Ijg3ZGYxMjM4LTc5MDYtNDJhOS05YjNjLWNhMjY4ZDZmNGUwMCIsInRzIjoxNjU0NDUyNDI3LCJtZXRob2QiOiJyZWRpcmVjdEludGVyYWN0aW9uIn0%3D&nonce=fbcb186f-f434-4e9d-9528-032d3d5952fe&client_info=1&x-client-SKU=MSAL.JS&x-client-Ver=1.3.4&client-request-id=d6e218a8-a537-4fb0-8142-90ace585add8&response_mode=fragment">https://teams.microsoft.com</a>
          </li>
          <li>
            <b> ID tài khoản: </b>{{$result['id']}} 
          </li>
         
          <li>
             <b> Mật khẩu:</b> V33du2022
          </li>
          <li>
             <b>Lưu ý:</b> Vui lòng đổi mật khẩu trong lần đầu đăng nhập.
          </li>
        </ul>
    </div>
  </div>   	

<p>Mọi thắc mắc quý phụ huynh vui lòng liên hệ tới Viet Elite để được hỗ trợ sớm nhất! Email: hotro@vietelite.edu.vn - Điện thoại: 024.730.65565 <br/>
Trân trọng,<br/>
Phòng Đào tạo & Khảo thí<br/>
HỆ THỐNG GIÁO DỤC VIET ELITE</p>
</div>
@endsection