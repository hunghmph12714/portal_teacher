@extends('layout.main')
@section('content')

<h3>Học sinh của lớp @isset (  $class->name )
     {{ $class->name }}
@endisset</h3>
<table class="table table-striped table-inverse ">
    <thead class="thead-inverse">
        <tr>
            <th>STT</th>
            <th>Name</th>
            <th>Avata</th>
            <th>Sdt</th>
        </tr>
        </thead>
        <tbody>
            
            @foreach ($students as $item)
            <tr>
                <td scope="row">{{ $loop->iteration }}</td>
                <td>{{ $item->fullname }}</td>
                   <td><img src="{{ isset( $item->fullname ) }}" alt="Lỗi ảnh rồi"></td>

                <td>{{ $item->phone }}</td>
            </tr>
            @endforeach
            
        </tbody>
</table>


@endsection