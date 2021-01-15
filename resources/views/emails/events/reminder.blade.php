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
						<p style="font-size: 30px; line-height: 1.2; word-break: break-word; text-align: center; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 36px; margin: 0;"><span style="color: #ffffff; font-size: 4vh;"><strong>THÔNG TIN ĐỊA ĐIỂM<br/></strong></span></p>
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
Cảm ơn Quý Phụ huynh đã tin tưởng và lựa chọn chúng tôi trong kỳ thi thử cho con. Vietelite xin thông báo địa điểm và phòng thi chính thức của Sự kiện  {{$result['event_name']}}
<div class="container">
  <div class="row">
    <div class="col-sm">
        <h3><u>Địa điểm các môn thi</u></h3>
        <table class="tg" style="" width="100%">
        <thead>
        <tr>
            <th class="tg-1wig">Môn thi</th>
            <th class="tg-1wig">Ngày thi</th>
            <th class="tg-1wig">Thời gian</th>
            <th class="tg-1wig">Địa điểm</th>
            <th class="tg-1wig">Phòng thi</th>
        </tr>
        </thead>
        <tbody>
          
            @foreach($result['product'] as $product)
            <tr>
              <td>{{$product['content']}}  </td>
              <td>{{$product['date']}}  </td>
              <td>{{$product['time']}}  </td>
              <td>{{$product['address']}}  <a href="{{'https://www.google.com/maps?q='.$product['address']}}">BẢN ĐỒ</a></td>
              <td>{{$product['room']}}  </td>
            </tr>
            @endforeach
          
        </tbody>
      </table>
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

  <div class="">
      <h3><u>LỊCH CHỮA BÀI</u></h3>
      <b>Thí sinh có nhu cầu chữa bài thi, vui lòng liên hệ trước với trung tâm qua hotline: 02473065565 để trung tâm có thể sắp xếp thí sinh tham dự vào một trong các buổi sau:</b>
      <table class="tg" style="" width="100%">
        <thead>
        <tr>
            <th class="tg-1wig">Môn chữa</th>
            <th class="tg-1wig">Địa điểm</th>
            <th class="tg-1wig">Ngày chữa</th>
            <th class="tg-1wig">Thời gian</th>              
        </tr>
        </thead>
        <tbody>
            <tr>
              <td>Toán 5 Cambridge</td>
              <td>23 Lô 14a Trung Yên 11, Trung Hoà</td>
              <td>Thứ 6, ngày 22/01/2021</td>
              <td>18h00- 19h00</td>                
            </tr>
            <tr>
              <td>Anh 5 Cambridge</td>
              <td>23 Lô 14a Trung Yên 11, Trung Hoà</td>
              <td>Thứ 7, ngày 23/01/2021</td>
              <td>10h00- 11h00</td>                
            </tr>
            <tr>
              <td rowspan="5">Toán Điều kiện 9</td>
              <td rowspan="2">5 ngõ 3 Phạm Tuấn Tài, Dịch Vọng Hậu</td>
              <td>Thứ 6, ngày 22/01/2021</td>
              <td>18h00- 19h00</td>
            </tr>
            <tr>
              <td>Thứ 5, ngày 28/01/2021</td>
              <td>18h00-19h00</td>
            </tr>
            <tr>
              <td rowspan="3">33 ngõ 91 Trần Duy Hưng, Trung Hòa</td>
              <td>Thứ 2, ngày 18/01/2021</td>
              <td>18h00 - 19h00</td>
            </tr>
            <tr>
              <td>Thứ 3, ngày 19/01/2021</td>
              <td>18h00- 19h00</td>
            </tr>
            <tr>
              <td>Thứ 5, ngày 21/01/2021</td>
              <td>18h00-19h00</td>
            </tr>
            <tr>
              <td rowspan="3">Văn Điều kiện 9</td>
              <td>5 ngõ 3 Phạm Tuấn Tài, Dịch Vọng Hậu</td>
              <td>Thứ 4, ngày 27/01/2021</td>
              <td>18h00- 19h00</td>
            </tr>
            <tr>
              <td rowspan="2">33 ngõ 91 Trần Duy Hưng, Trung Hòa</td>
              <td>Thứ 4, ngày 20/01/2021</td>
              <td>18h00- 19h00</td>
            </tr>
            <tr>
              <td>Thứ 6, ngày 22/01/2021</td>
              <td>18h00- 19h00</td>
            </tr>
        </tbody>
      </table>
  </div>
  <div class="">
      <h3><u>Quý Phụ huynh lưu ý một số thông tin quan trọng:</u></h3>
      <ul>
        <li>
          <b> Ghi nhớ thời gian:  </b> 
          <ul>
              <li>Thí sinh phải có mặt ở địa điểm thi của VEE ít nhất 30 phút trước khi bắt đầu tính giờ làm bài. </li>
              <li>Thí sinh đến muộn sau 15 phút, kể từ lúc phát đề, sẽ không được vào phòng thi, không được tham gia môn thi và được tính là bỏ thi.</li>
          </ul>            
        </li>
        <li>
          <b> Đừng quên số báo danh: </b> Thí sinh hãy ghi nhớ thật chính xác số báo danh của mình trước khi vào phòng thi. 
        </li>
        <li>
          <b> Các vật dụng được mang vào phòng thi: </b> Thí sinh được mang vào phòng thi bút viết, bút chì, compa, tẩy, thước kẻ, thước tính. 
        </li>
        <li>
          <b> Hệ thống kiến thức: </b> Các em học sinh nên đọc lại những kiến thức đã được giới hạn, những lưu ý của thầy cô hay ghi chú quan trọng, tuyệt đối không nạp quá nhiều nội dung mới dẫn đến quá tải không có được kiến thức trọng tâm. 
        </li>
        <li>
          <b> Dành thời gian thư giãn để giữ gìn sức khỏe: </b> Các em học sinh hãy nhớ cân đối giữ việc học tập và vui chơi để não bộ có thời gian thư giãn, từ đó giúp việc ghi nhớ kiến thức đạt hiệu quả tốt nhất. 
          Việc bổ sung các chất dinh dưỡng và chế độ nghỉ hợp lý sẽ giúp các em có sức khỏe tốt nhất trong thời gian ôn tập và ngày thi.
        </li>
        
      </ul>
  </div>
<p>Mọi thắc mắc Quý Phụ huynh vui lòng liên hệ tới Viet Elite để được hỗ trợ sớm nhất! Email: thithu@vietelite.edu.vn - Điện thoại: 024.730.65565 <br/>
Trân trọng,<br/>
Phòng Đào tạo & Khảo thí<br/>
HỆ THỐNG GIÁO DỤC VIET ELITE</p>
</div>
@endsection

