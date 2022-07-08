@extends('layouts.email')
@section('banner')

<div
    style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;background-image:url('https://center.vietelite.edu.vn/images/background.jpg');background-position:top center;background-repeat:no-repeat; background-size: cover;">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
    <!--[if (mso)|(IE)]><td align="center" width="640" style=";width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
    <div class="col num12"
        style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
        <div style="width:100% !important;">
            <!--[if (!mso)&(!IE)]><!-->
            <div
                style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                <!--<![endif]-->
                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 15px; padding-left: 15px; padding-top: 30px; padding-bottom: 30px; font-family: Arial, sans-serif"><![endif]-->
                <div
                    style="color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:1.2;padding-top:30px;padding-right:15px;padding-bottom:30px;padding-left:15px;">
                    <div
                        style="line-height: 1.2; font-size: 12px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; color: #555555; mso-line-height-alt: 14px;">
                        <p
                            style="font-size: 30px; line-height: 1.2; word-break: break-word; text-align: center; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 36px; margin: 0;">
                            <span style="color: #ffffff; font-size: 4vh;"><strong>CÁM ƠN BẠN ĐÃ PHẢN
                                    HỒI<br /></strong></span>
                        </p>
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
    Dear <b>{{$user['name']}}</b>,<br /><br />
    Cảm ơn đã phản hồi cho chúng tôi, chúng tôi đã khắc phục được hệ thống
<div class="container">
    <div class="row" style="display: grid;grid-template-columns: 1fr 1fr">
        <div class="col-sm">
            <h3 style="text-align: center"><b>Chi tiết phản hồi</b></h3>
            <p> <b>Số điện thoại: </b> <span>{{ $phone }}</span></p>
            <p> <b>Tiêu đề: </b> <span>{{ $title }}</span></p>
            <p> <b>Chi tiết: </b> <span>{!! $description !!}</span></p>
            {{-- <p> <b>Type: </b> <span>@if ($type == 1 )
                    Báo lỗi
                    @else
                    Góp ý nâng cấp
                    @endif</span></p> --}}
        
           
          
        </div><div class="col-sm">
            <h3 style="text-align: center"><b>PHẢN HỒI SỬA CHỮA</b></h3>
          <p><b>Chi tiết phản hồi: </b>{!! $result!!}</p>
        
        
        
        </div>

    </div>


    {{-- <p>Mọi thắc mắc Quý Phụ huynh vui lòng liên hệ tới Viet Elite để được hỗ trợ sớm nhất! Email:
        thithu@vietelite.edu.vn
        - Điện thoại: 024.730.65565 <br />
        Trân trọng,<br />
        Phòng Đào tạo & Khảo thí<br />
        HỆ THỐNG GIÁO DỤC VIET ELITE</p> --}}
</div>
@endsection