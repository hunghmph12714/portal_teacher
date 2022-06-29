<div class="container">
    <div class="row">
        <div class="col-sm">
            <a href="{{ route('feedback.chi-tiet', ['id'=>$id]) }}"><button>Mở trên center</button></a>
            <h3><u>Chi tiết phản hồi</u></h3>
            <p> <b>Người phản hồi: </b> <span>{{ $name }}</span></p>
            <p> <b>Số điện thoại: </b> <span>{{ $phone }}</span></p>
            <p> <b>Tiêu đề: </b> <span>{{ $title }}</span></p>
            <p> <b>Chi tiết: </b> <span>{!! $description !!}</span></p>
            <p> <b>Type: </b> <span>@if ($type==1 )
                    Báo lỗi
                    @else
                    Góp ý nâng cấp
                    @endif</span></p>
   
        </div>

    </div>