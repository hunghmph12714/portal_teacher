@extends('layouts.email')
@section('banner')
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;background-image:url('https://vietelite.edu.vn/wp-content/uploads/2018/05/Fotolia_83255773_Subscription_Monthly.jpg');background-position:top center;background-repeat:no-repeat">
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
						<p style="font-size: 30px; line-height: 1.2; word-break: break-word; text-align: center; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 36px; margin: 0;"><span style="color: #ffffff; font-size: 2vw;"><strong>THÔNG TIN ĐĂNG NHẬP CENTER<br/></strong></span></p>
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
    Kính gửi {{$datas['name']}},
    <br>
    Phòng nhân sự xin thông báo thông tin đăng nhập hệ thống quản lý Center:
    <ul> 
        <li>
            Đường dẫn đăng nhập: <b>{{$datas['url']}}</b>
        </li>
        <li>
            Tên đăng nhập: <b>{{$datas['email']}}</b>
        </li>
        <li>
            Mật khẩu: <b>{{$datas['password']}}</b>
        </li>
    </ul>
    Vui lòng thay đổi mật khẩu trong lần đăng nhập đầu tiên <a href="https://center.vietelite.edu.vn/account">tại đây</a>. <br/>
    Mọi thắc mắc vui lòng liên hệ bộ phận kỹ thuật qua email: <a href="mailto:thanhttb@vietelite.edu.vn"> Kỹ thuật </a> Hoặc bộ phận <a href="mailto:quynhnn@vietelite.edu.vn"> Hành chính nhân sự </a> .

@endsection
@section('footer')

    <div class="col num4" style="max-width: 320px; min-width: 213px; display: table-cell; vertical-align: top; width: 213px;">
        <div style="width:100% !important;">
        <!--[if (!mso)&(!IE)]><!-->
            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
            <!--<![endif]-->
            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                <div style="color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                    <div style="line-height: 1.2; font-size: 12px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; color: #555555; mso-line-height-alt: 14px;">
                        <p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"><strong><span style="font-size: 13px; mso-ansi-font-size: 14px;">VIETELITE TRẦN DUY HƯNG</span></strong><br/> <br/>Địa chỉ:  33 ngõ 91 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội. </p>
                        <p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">Hotline: 096 213 6604 • 024 73065565 </p>
                        <p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">Email: cs.tranduyhung@vietelite.edu.vn</p>
                        <p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">Hotline Quản lý: <br/>024 73065565</p>
                    </div>                    
                </div>
                <div style="color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                    <div style="line-height: 1.2; font-size: 12px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; color: #555555; mso-line-height-alt: 14px;">
                        <p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"><span style="font-size: 13px; mso-ansi-font-size: 14px;"><strong>VIETELITE TRUNG YÊN</strong></span><br/> <br/>Địa chỉ: Số 23 Lô 14A Trung Yên 11, Trung Hòa, Cầu Giấy, Hà Nội.</p>
                        <p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">Hotline: <br/>036 676 5565 • 024 73065565  </p>
                        <p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">Email: <br/>cs.trungyen@vietelite.edu.vn</p>
                        <p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">Hotline Quản lý: <br/>024 73065565 (máy lẻ 108)</p>
                    </div>
                </div>
            <!--[if mso]></td></tr></table><![endif]-->
            <!--[if (!mso)&(!IE)]><!-->
            </div>
        <!--<![endif]-->
        </div>
    </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    <!--[if (mso)|(IE)]></td><td align="center" width="213" style=";width:213px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
    <div class="col num4" style="max-width: 320px; min-width: 213px; display: table-cell; vertical-align: top; width: 213px;">
        <div style="width:100% !important;">
        <!--[if (!mso)&(!IE)]><!-->
            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
            <!--<![endif]-->
            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                <div style="color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                    <div style="line-height: 1.2; font-size: 12px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; color: #555555; mso-line-height-alt: 14px;">
                        <p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"><strong><span style="font-size: 13px; mso-ansi-font-size: 14px;">VIETELITE PHẠM TUẤN TÀI</span></strong><br/> <br/>Địa chỉ:  5 ngõ 3 Phạm Tuấn Tài, Dịch Vọng Hậu, Cầu Giấy, Hà Nội.</p>
                        <p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">Hotline: <br/>094 984 5665 | 024 73065565</p>
                        <p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">Email: <br/>cs.phamtuantai@vietelite.edu.vn</p>
                        <p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">Hotline Quản lý: <br/>024 73065565 (máy lẻ 208)</p>
                    </div>
                </div>
                <div style="color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                    <div style="line-height: 1.2; font-size: 12px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; color: #555555; mso-line-height-alt: 14px;">
                        <p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"><span style="font-size: 13px; mso-ansi-font-size: 14px;"><strong>VIETELITE ĐỖ QUANG</strong></span><br/> <br/>Địa chỉ:  Số 2 ngõ 44 Đỗ Quang, Trung Hòa, Cầu Giấy, Hà Nội.</p>
                        <p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">Hotline: <br/>096 213 6604 • 024 73065565 </p>
                        <p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">Email: <br/>cs.doquang@vietelite.edu.vn</p>
                        <p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">Hotline Quản lý: <br/>024 73065565 (máy lẻ 108)</p>
                    </div>
                </div>
            <!--[if mso]></td></tr></table><![endif]-->
            <!--[if (!mso)&(!IE)]><!-->
            </div>
        <!--<![endif]-->
        </div>
    </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    <!--[if (mso)|(IE)]></td><td align="center" width="213" style=";width:213px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
    <div class="col num4" style="max-width: 320px; min-width: 213px; display: table-cell; vertical-align: top; width: 213px;">
        <div style="width:100% !important;">
        <!--[if (!mso)&(!IE)]><!-->
            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
            <!--<![endif]-->
            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
            <div style="color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                    <div style="line-height: 1.2; font-size: 12px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; color: #555555; mso-line-height-alt: 14px;">
                        <p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"><span style="font-size: 13px; mso-ansi-font-size: 14px;"><strong>BỘ PHẬN PHẢN ÁNH CHẤT LƯỢNG</strong></span><br/> <br/></p>
                        <p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">Hotline: <br/>096 213 6604 • 024 73065565 </p>
                        <p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">Email: <br/>@vietelite.edu.vn</p>
                        <p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">Hotline Quản lý: <br/>024 73065565 (máy lẻ 108)</p>
                    </div>
                </div>   
            <!--[if mso]></td></tr></table><![endif]-->
            <!--[if (!mso)&(!IE)]><!-->
            </div>
        <!--<![endif]-->
        </div>
    </div>
@endsection
