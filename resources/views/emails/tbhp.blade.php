Kính gửi quý phụ huynh, 
{{$result['title']}} của bạn {{$result['student']}}
Tổng học phí : {{$result['sum_amount']}}
Thông tin chi tiết học phí của bạn phụ huynh vui lòng xem trong bảng kê dưới đây:

@foreach($result['data'] as $key =>  $fee)
THÁNG {{$key}}
<table class="table table-sm">
    <thead>
        <tr>
            <th>Lớp</th>
            <th>Nội dung</th>
            <th>Đơn giá</th>
            <th>Số lượng(ca)</th>
            <th>Thành tiền</th>
        </tr>
    </thead>
    <tbody>
        @foreach($fee as $f)
        <tr>
            <td>{{$f['cname']}}</td>
            <td>{{$f['content']}}</td>
            <td>{{$f['dg']}}</td>
            <td>{{$f['sl']}}</td>
            <td>{{$f['amount']}}</td>

        </tr>
        @endforeach
    </tbody>
</table>
@endforeach

Phụ huynh có thể nộp tiền mặt tại quầy lễ tân hoặc thanh toán chuyển khoản. 
THÔNG TIN THANH TOÁN: 
* NH: VIB CN Ba Đình 
Chủ TK: Phan Việt Anh
Số TK: 015704060030799 

* NH: ACB CN Huỳnh Thúc Kháng 
Chủ TK: Phan Việt Anh 
Số TK: 26856688 

*Nội dung chuyển khoản: {{$result['content']}}

ĐỂ ĐƯỢC XÁC NHẬN ĐÃ CHUYỂN KHOẢN THÀNH CÔNG: 

Quý phụ huynh vui lòng chụp lại màn hình biên lai/ sao kê ngân hàng và gửi vào Email: ketoancs1@vietelite.edu.vn  

Mọi thắc mắc vui lòng gọi đến số Hotline: 024.73065565/03667.65565 để được giải đáp kịp thời. 

Trân trọng! 
