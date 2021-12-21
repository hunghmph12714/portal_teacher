	@extends('layouts.main')
        @section('content')
             <form action="" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="row-8">
                        <div class="col-4">
                            <div class="form-group">
                                <label for="">Tên thành viên</label>
                                <input type="text" class="form-control" value="{{ old('name') }}" name="name" id="" >
                            </div>
                            
                            @error('name')
                                <p class="text-danger">{{ $message }}</p>
                            @enderror
                        </div>
                        <div class="col-4">
                            <div class="form-group">
                                <label for="">Email</label>
                                <input type="text" class="form-control" name="email" value="{{ old('email') }}" id="" >
                            </div>
                             @error('email')
                                <p class="text-danger">{{ $message }}</p>
                            @enderror
                        </div>
                         <div class="col-4">
                            <div class="form-group">
                                <label for="">Password</label>
                                <input type="password" class="form-control" value="{{ old('password') }}" name="password" id="" >
                            </div>
                             @error('password')
                                <p class="text-danger">{{ $message }}</p>
                            @enderror
                        </div>
                        <div class="col-4">
                            <div class="form-group">
                                <label for="">Ảnh đại diện</label>
                                <input type="file" class="form-control" name="avata" id="">
                            </div>                           
                              @error('avata')
                                <p class="text-danger">{{ $message }}</p>
                            @enderror
                        </div>
                         
                        <div class="col-4">
                            <div class="form-group">
                                <label for="">Loại tài khoản</label>
                                {{-- <input type="text" class="form-control" name="car_id" id="" > --}}
                                <select  class="form-control" name="roll_id" id="">
                                    @foreach ($rolls as $item)
                                        <option value="{{ $item->id }}">{{ $item->name }}  </option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                       
                        <div class="col-6">
                            <a href="{{route('car.index')}}" class="btn btn-danger">Hủy</a>
                            <button type="submit" class="btn btn-primary">Lưu</button>

                        </div>
                    </div>
                </form>

        @endsection