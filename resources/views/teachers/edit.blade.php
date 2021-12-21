	@extends('layouts.main')
        @section('content')
             <form action="" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="row-8">
                        <div class="col-4">
                            <div class="form-group">
                                <label for="">Tên giáo viên</label>
                                <input type="text" class="form-control" value="{{ $teacher->name}}" name="name" id="" >
                            </div>
                            
                            @error('name')
                                <p class="text-danger">{{ $message }}</p>
                            @enderror
                        </div>
                        <div class="col-4">
                            <div class="form-group">
                                <label for="">Email</label>
                                <input type="text" class="form-control" name="email" value="{{ $teacher->email }}" id="" >
                            </div>
                             @error('email')
                                <p class="text-danger">{{ $message }}</p>
                            @enderror
                        </div>
                        <div class="col-4">
                            <div class="form-group">
                                <label for="">phone</label>
                                <input type="text" class="form-control" name="phone" value="{{ $teacher->phone }}" id="" >
                            </div>
                             @error('email')
                                <p class="text-danger">{{ $message }}</p>
                            @enderror
                        </div>
                        <div class="col-4">
                            <div class="form-group">
                                <label for="">address</label>
                                <input type="text" class="form-control" name="address" value="{{ $teacher->address }}" id="" >
                            </div>
                             @error('address')
                                <p class="text-danger">{{ $message }}</p>
                            @enderror
                        </div>
                        <div class="col-4">
                            <div class="form-group">
                                <label for="">domain</label>
                                <input type="text" class="form-control" name="domain" value="{{ $teacher->domain }}" id="" >
                            </div>
                             @error('domain')
                                <p class="text-danger">{{ $message }}</p>
                            @enderror
                        </div>
                        {{-- <div class="col-4">
                            <div class="form-group">
                                <label for="">Ảnh đại diện</label>
                                <input type="file" class="form-control" name="avata" id="">
                                <img src="" alt="">
                            </div>                           
                              @error('avata')
                                <p class="text-danger">{{ $message }}</p>
                            @enderror
                        </div> --}}
                        
                        <div class="col-4">
                           
                        </div>
                       
                        <div class="col-6">
                            <a href="{{route('teacher.index')}}" class="btn btn-danger">Hủy</a>
                            <button type="submit" class="btn btn-primary">Lưu</button>

                        </div>
                    </div>
                </form>

        @endsection