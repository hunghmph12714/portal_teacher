@extends('layout.main')
@section('content')

<h3>Học sinh của lớp @isset ( $class->name )
    {{ $class->name }}
    @endisset</h3>
<table class="table table-striped table-inverse ">
    <thead class="thead-inverse">
        <tr>
            <th>STT</th>
            <th>Xem bài kiểm tra</th>
            <th>Name</th>
            <th>Avata</th>
            <th>Sdt</th>
        </tr>
    </thead>
    <tbody>

        @foreach ($students as $item)
        <tr>
            <td scope="row">{{ $loop->iteration }}</td>

            <td>

                <a class="nav-link nav-link-icon" href="{{ route('student.attempt', ['student_id'=>$item->id]) }}"
                    data-toggle="tooltip" data-original-title="Xem bài kiểm tra của học sinh " width='10px'>
                    <i class="ni ni-collection"></i>
                </a>

            </td>
            <td>{{ $item->fullname }}</td>
            <td><img src="{{ isset( $item->fullname ) }}" alt="Lỗi ảnh rồi"></td>

            <td>{{ $item->phone }}</td>
        </tr>
        @endforeach

    </tbody>
</table>


@endsection