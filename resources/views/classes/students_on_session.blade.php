<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    @include('layout.style')

</head>

<body>
    <div class="container">
        <div>
            <img width="20px" onclick="history.back()" src="{{ asset('image_system/back.png') }}" alt="">

        </div>
        <div>
            <h3>Danh sách học sinh</h3>
            <h4>Lớp: <b>{{ $session->classes()->first()->code }}</b></h4>
        </div>
        <table class="table table-striped table-inverse ">
            <thead class="thead-inverse">
                <tr>
                    <th style="width: 20px">STT</th>
                    <th>Avata</th>
                    <th>Name</th>
                    <th>Nguyện vọng</th>
                    <th>Ngày nhập học</th>
                    <th>Điểm,Nhận xét</th>

                </tr>
            </thead>
            <tbody>


                @foreach ($students as $item)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td width="75px">
                        @if ($item->avatar)
                        <div>
                            <img style="border-radius: 100%" class=" rounded-5" width="50px" height="50px"
                                src="https://center.vietelite.edu.vn/{{ $item->avatar  }}" alt="Lỗi ảnh rồi">
                        </div>
                        @else
                        <div>
                            <img style="border-radius: 100%" class=" rounded-5" width="50px" height="50px"
                                src="{{ asset('image_system/user.jpg') }}" alt="Lỗi ảnh rồi">
                        </div>
                        @endif

                    </td>
                    <td class="justify-item-center">{{ $item->fullname }}</td>

                    <td>@if (KQEntrance($item->id,$session->class_id ))
                        {{ KQEntrance($item->id,$session->class_id )->note}}
                        @endif</td>
                    <td>{{
                        $item->join('student_class','students.id','student_class.student_id')->where('class_id',$session->class_id)->first()->entrance_date
                        }}
                    </td>
                    <td>@if (KQEntrance($item->id,$session->class_id ))
                        {{ KQEntrance($item->id,$session->class_id )->test_score .' - '.
                        KQEntrance($item->id,$session->class_id )->test_note}}
                        @endif
                    </td>
                </tr>
                @endforeach

            </tbody>
        </table>
    </div>
</body>

</html>