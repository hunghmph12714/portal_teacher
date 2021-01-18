    Kính gửi phụ huynh con {{$datas[0]['student']->fullname}},
    <br>
    {{$datas[0]['center']->name}} xin gửi tới quý phụ huynh thông tin tình hình học tập của con <strong>{{$datas[0]['student']->fullname}}</strong> tại lớp <strong>{{$datas[0]['class']}}</strong>
    @foreach($datas as $data)
        <h4 style="font-size: 15px; font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;">Buổi {{ date('d/m/Y', strtotime($data['session']->date)) }}, ca học của thầy/cô {{$data['teacher']}}:</h4>
        <h4 style="font-size: 15px;">1. Tình hình học trên lớp: </h4>
        <ul>
            <li style="font-size: 14px;">
                Điểm trên lớp (nếu có): <b>{{$data['student_session']->score}}</b>
            </li>
            <li style="font-size: 14px;">
                Nhận xét (nếu có): <b>{{$data['student_session']->comment}}</b>
            </li>
        </ul>
        <h4 style="font-size: 15px;">2. Bài tập về nhà kỳ trước: </h4>
        <ul>            
            <li style="font-size: 14px;">
                Điểm bài tập về nhà (Nếu có): <b>{{$data['student_session']->btvn_score}}/{{$data['student_session']->btvn_complete}}/{{$data['student_session']->btvn_max}}</b></li> (Số bài làm đúng / Số bài hoàn thành/ Tổng số bài)
            <li style="font-size: 14px;">
                Nhận xét bài tập về nhà (Nếu có): <b>{{$data['student_session']->btvn_comment}}</b>
            </li>

        </ul>
        <h4 style="font-size: 15px;">3. Thông tin của ca học : </h4>
        <ul>
            <li style="font-size: 14px;">
                Nội dung ca học: <b>{{$data['session']->content}}</b>
            </li>
                    
            <li style="font-size: 14px;">
                Tài liệu ca học (nếu có):
                @if($data['session']->document != '')
                    @foreach(explode(',', $data['session']->document) as $d)
                        <a href="{{'https://center.vietelite.edu.vn/'.$d}}" download style="margin-right: 5px;"> Tải về </a> 
                    @endforeach
                @endif
            </li>
            <li style="font-size: 14px;">
                Bài tập về nhà: <b>{{$data['session']->btvn_content}}</b>
            </li>
            <li style="font-size: 14px;">
                File bài tập về nhà (nếu có): 
                @if($data['session']->exercice != '')
                    @foreach(explode(',', $data['session']->exercice) as $d)
                        <a href="{{'https://center.vietelite.edu.vn/'.$d}}" download style="margin-right: 5px;"> Tải về </a> 
                    @endforeach
                @endif
            </li>
            @if($data['session']['note'] != "")
                <li style="font-size: 14px;">
                    Nhận xét chung: <b>{{$data['session']['note']}}</b>
                </li>
            @endif   
        </ul>
        
       
        
        

    @endforeach
    Mọi thắc mắc quý phụ huynh vui lòng liên hệ hotline cơ sở {{$datas[0]['center']->name}}: {{$datas[0]['center']->phone}}

