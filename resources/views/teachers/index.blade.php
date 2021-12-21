@extends('layouts.main')
@section('content')
<table class="table table-stripped">
    <thead>
        <th>ID</th>
        <th>name</th>
        <th>Ảnh đại diện</th>
        <th>email</th>
                <th>SDT</th>
        <th>address</th>

        <th>Môn dạy</th>
        <th>System teacher</th>

        <!-- <th>
            @if (Auth::user()->roll_id==1)
            <a href="{{route('user.add')}}" class="btn btn-success">Add new</a>

            @endif
        </th> -->
    </thead>
    <tbody>
        @foreach ($teachers as $item)
        <tr>
            <td>{{$item->id}}</td>
            <td>{{$item->name}}</td>
            <td>
                <img src="{{ asset($item->avata) }}" width="50px;" alt="">
            </td>

            <td>{{$item->email}}</td>
             <td>{{$item->phone}}</td>
            <td>{{$item->address}}</td>

            <td>{{$item->domain}}</td>

            <td>
                <form action="/teacher" method="post" class="d-flex ">
                    @csrf
                    <select class="custom-select col-6" name="system_teacher" @if ($item->id==Auth::user()->id)
                        disabled
                        @endif id="">
                        <option @if($item->system_teacher==0)
                            selected
                            @endif
                            value="false">Không</option>
                        <option @if($item->system_teacher==1)
                            selected
                            @endif value="1">Có</option>

                    </select>
                    <input type="hidden" name="id" value="{{ $item->id }}">
                    <button class="btn btn-info col-3" @if ($item->id==Auth::user()->id)
                        disabled
                        @endif
                        type="submit">Đổi</button>
                </form>
            </td>

            <td>
                {{-- <a href="{{route('user.updatePassword', ['id' => $item->id])}}" class="btn btn-warning">DMK</a> --}}
                < </td>
        </tr>
        @endforeach
    </tbody>
</table>

@endsection