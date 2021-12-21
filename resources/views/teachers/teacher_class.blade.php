@extends('layouts.main')
@section('content')
Danh sách lớp dạy trong tuần của giáo viên: 
<table class="table table-stripped">
    <thead>
        <th>ID</th>
        <th>tên lớp</th>
        <th>Số học sinh</th>
        <th>Năm học</th>
       

       
    </thead>
    <tbody>
        @foreach ($classes as $item)
        <tr>
            <td>{{$item->id}}</td>
            <td>{{$item->name}}</td>
            <td>{{$item->student_number}}</td>
             <td>{{$item->year}}</td>    

            <td>
                
            </td>
        </tr>
        @endforeach
    </tbody>
</table>

@endsection