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
<div>
<div>
        <h3 class="mx-auto text-center">Danh sách ca dạy trong ngày </h3>
<h4>Giáo viên: <span>{{ $teacher->name }}</span></h4>
</div>

    <table class="table table-hover table-inverse table-responsive">
        <thead class="thead-inverse">
            <tr>
                <th>STT</th>
                <th>Lớp</th>
                <th>Bắt đầu</th>
                <th>Kết thúc</th>
                <th>Cơ sở</th>
                <th>Số hs</th>
                {{-- <th>Thời gian</th> --}}

            </tr>
            </thead>
            <tbody>
                @foreach ($sessions as $item)
                   <tr>
                    <td scope="row">{{ $loop->iteration }}</td>
                    <td><a href="{{ route('student.onSession', ['session_id'=>$item->id]) }}">{{ $item->class_code }}</a></td>
                    <td>{{ date('H:i:s', strtotime($item->from)) }}</td>
                    <td>{{ date('H:i:s', strtotime($item->to)) }}</td>

                    <td>{{ $item->center_name }}</td>
                    <td>{{ $item->ss_number }}</td>
                </tr>  
                @endforeach
               
                {{-- <tr>
                    <td scope="row"></td>
                    <td></td>
                    <td></td>
                </tr> --}}
            </tbody>
    </table>
</div>
</body>
</html>