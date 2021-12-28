	@extends('layout.main')
        @section('content')
             <form action="" class="" method="POST">
                    @csrf
                    <div class="row-8">
                        <div class="col-4">
                            <div class="form-group">
                                <label for="">Nhập mật khẩu cũ</label>
                                <input type="text" class="form-control" name="password" id="" >
                            </div>
                              @if(Session::has('msg'))
                            <p class="text-danger">{{Session::get('msg')}}</p>      
                             @endif
                            @error('password')
                                <p class="text-danger">{{ $message }}</p>
                            @enderror
                        </div>
                        <div class="col-4">
                            <div class="form-group">
                                <label for="">Nhập mật khẩu mới</label>
                                <input type="text" class="form-control" name="newpass"  id="" >
                            </div>
                             @error('newpass')
                                <p class="text-danger">{{ $message }}</p>
                            @enderror
                        </div>
                          <div class="col-4">
                            <div class="form-group">
                                <label for="">Nhập lại mật khẩu mới</label>
                                <input type="text" class="form-control" name="test_newpass"  id="" >
                            </div>
                             @error('test_newpass')
                                <p class="text-danger">{{ $message }}</p>
                            @enderror
                        </div>

                        <div class="col-6">
                            <a href="{{route('teacher.index')}}" class="btn btn-danger">Hủy</a>
                            <button type="submit" class="btn btn-primary">Lưu</button>

                        </div>
                    </div>
                </form>

        @endsection