@extends('layout.main')
@section('content')
<h3 style="text-align: center">DANH SÁCH LỚP DẠY CỦA GIÁO VIÊN:</h3>
<h3> @isset($teacher->name)
    {{ $teacher->name }}
    @endisset
</h3>

<table class="table table-stripped table-border">
    <thead>
        <th>STT</th>
        <th>tên lớp</th>
        <th>Nội dung buổi học</th>
        <th>Năm học</th>

    </thead>
    <tbody>
        @foreach ($sessions as $item)
        <tr>
            <td>{{ $loop->iteration }}</td>
            <td><a href="{{ route('teacher.classStudent', ['class_id'=>$item['class_id']]) }}">{{$item['name']}}</a>
            </td>
            <td>{{$item['content']}}</td>
            <td>{{$item['year']}}</td>
            <td>
            </td>

            <td>

            </td>
        </tr>
        @endforeach
    </tbody>
</table>
@if (empty($sessions[0]))
<p>Ui!!! May quá, tuần này bạn không phải dạy rồi!</p>

@endif


@endsection