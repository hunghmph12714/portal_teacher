@extends('layout.main')
@section('content')

   <table id="example2" class="table table-bordered table-hover">
        <thead>
                  <tr>
                       <th>ID</th>
                        <th>name</th>
                        {{-- <th>Ảnh đại diện</th> --}}
                        <th>email</th>
                        <th>SDT</th>
                        <th>address</th>

                        <th>Môn</th>
                        <th>System Teacher</th>
                        {{-- <th>Sửa</th>
                        <th>Lớp giảng dạy</th> --}}
                  </tr>
        </thead>
        <tbody>
                    @foreach ($teachers as $item)
                    <tr>
                        <td>{{$item->id}}</td>
                        <td>{{$item->name}}</td>
                        <td>{{$item->email}}</td>
                        <td>{{$item->phone}}</td>
                        <td>{{$item->address}}</td>

                        <td>{{$item->domain}}</td>

                        <td>
                            <form action="/teacher" method="post" class="d-flex ">
                                @csrf
                                <select class="custom-select col-6" name="system_teacher" @if (empty($teachers)&&$item->id==Auth::user()->id)
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
                                <button class="btn btn-info col-3 " @if (empty($teachers)&&$item->id==Auth::user()->id)
                                    disabled
                                    @endif
                                    type="submit">Đổi</button>
                            </form>
                        </td>

                        {{-- <td>
                            <a href="{{route('teacher.edit', ['id' => $item->id])}}" class="btn btn-warning">Edit</a>
                        </td>
                        <td>
                                <a href="{{route('teacher.class', ['id' => $item->id])}}" class="btn btn-info">Lớp dạy</a>
                        </td> --}}
                        <td>
                             <div class="dropdown">
                            <a class="btn btn-sm btn-icon-only text-light" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i class="fas fa-ellipsis-v"></i>
                           </a>
                        <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                            <a href="{{route('teacher.edit', ['id' => $item->id])}}" class="dropdown-item" >Edit</a>
                                <a href="{{route('teacher.class', ['id' => $item->id])}}" class="dropdown-item" class="dropdown-item">Lớp dạy</a>
                          {{-- <a class="dropdown-item" href="#">Something else here</a> --}}
                        </div>
                      </div>
                        </td>
                    </tr>
                   @endforeach
                
                 
                  </tbody>
                 
                </table>
@endsection