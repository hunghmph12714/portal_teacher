@extends('layout.main')
@section('content')

<h3>Các bài thi của học sinh: @if ( !empty($student->fullname) )
    {{ $student->fullname}}
    @endif</h3>
<table class="table table-striped table-inverse ">
    <thead class="thead-inverse">
        <tr>
            <th>STT</th>
            <th>Xem bài kiểm tra</th>
            <th>Điểm môn 1</th>
            <th>Điểm môn 2</th>
            <th>Điểm môn 3</th>


        </tr>
    </thead>
    <tbody>

        @foreach ($attempts as $item)
        <tr>
            <td scope="row">{{ $loop->iteration }}</td>

            <td><a target="_black" href="{{ route('student.attempt_detail', ['attempt_id'=>$item->id]) }}">{{
                    $item->title
                    }}</a></td>
            <td><a href="{{ route('student.attempt_detail', ['attempt_id'=>$item->id]) }}">{{ $item['score_domain_1']
                    }}</a></td>
            <td><a href="{{ route('student.attempt_detail', ['attempt_id'=>$item->id]) }}">{{ $item['score_domain_2']
                    }}</a></td>
            <td><a href="{{ route('student.attempt_detail', ['attempt_id'=>$item->id]) }}">{{ $item['score_domain_3']
                    }}</a></td>


            {{-- <td><img src="{{ isset( $item->fullname ) }}" alt="Lỗi ảnh rồi"></td> --}}

            {{-- <td>{{ $item->phone }}</td>/ --}}
        </tr>
        @endforeach

    </tbody>
</table>


@endsection