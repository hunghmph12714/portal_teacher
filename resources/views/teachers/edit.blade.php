	@extends('layout.main')
        @section('content')



  <div class="main-content" id="panel">
    <!-- Topnav -->

    <!-- Header -->
    <!-- Header -->

    <!-- Page content -->
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-xl-4 order-xl-2">
          <div class="card card-profile">
            <img src="{{ asset('admin') }}/assets/img/theme/img-1-1000x600.jpg" alt="Image placeholder" class="card-img-top">
            <div class="row justify-content-center">
              <div class="col-lg-3 order-lg-2">
                <div class="card-profile-image">
                  <a href="#">
                    <img src="{{ asset('admin') }}/assets/img/theme/team-4.jpg" class="rounded-circle">
                  </a>
                </div>
              </div>
            </div>
            <div class="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
              <div class="d-flex justify-content-between">
                <a href="#" class="btn btn-sm btn-info  mr-4 ">Connect</a>
                <a href="#" class="btn btn-sm btn-default float-right">Message</a>
              </div>
            </div>
            <div class="card-body pt-0">
              <div class="row">
                <div class="col">
                  <div class="card-profile-stats d-flex justify-content-center">
                    <div>
                      <span class="heading">22</span>
                      <span class="description">Friends</span>
                    </div>
                    <div>
                      <span class="heading">10</span>
                      <span class="description">Photos</span>
                    </div>
                    <div>
                      <span class="heading">89</span>
                      <span class="description">Comments</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-center">
                <h5 class="h3">
              {{ $teacher->name }}    <span class="font-weight-light"></span>
                </h5>
                <div class="">
                  <i class="ni location_pin mr-2">Giáo viên {{ $teacher->domain }}</i>
                </div>
                <div class="h5 mt-4">
                  <i class="ni business_briefcase-24 mr-2"></i> {{ $teacher->address }}
                </div>
                {{-- <div>
                  <i class="ni education_hat mr-2"></i>Giáo viên {{ $teacher->domain }}
                </div> --}}
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-8 order-xl-1">
          <div class="card">
            <div class="card-header">
              <div class="row align-items-center">
                <div class="col-8">
                  <h3 class="mb-0">Edit profile </h3>
               <form action="" method="POST">
                    @csrf
                 </div>
                <div class="col-4 text-right">
                  {{-- <a href="#!" class="btn btn-sm btn-primary">Settings</a> --}}
                  <button  class="btn btn-sm btn-primary" type="submit">Thay đổi</button>
                </div>
              </div>
            </div>
            <div class="card-body">



              
                <h6 class="heading-small text-muted mb-4">User information</h6>
                <div class="pl-lg-4">
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label class="form-control-label" for="input-username">Họ và Tên</label>
                        <input type="text" id="input-username" name="name" class="form-control"  value="{{ $teacher->name}}" placeholder="Họ và tên..." >
                      </div> @error('name')
                                <p class="text-danger">{{ $message }}</p>
                            @enderror
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label class="form-control-label" for="input-email">Email address</label>
                        <input type="email" id="input-email" class="form-control" name="email"  value="{{ $teacher->email}}" placeholder="jesse@example.com">
                      </div>
                    </div>  @error('email')
                                <p class="text-danger">{{ $message }}</p>
                            @enderror
                  </div>
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label class="form-control-label" for="input-first-name">Số điện thoại</label>
                        <input type="text" id="input-first-name" class="form-control" placeholder="Số điện thoại" name="phone"  value="{{ $teacher->phone}}">
                      </div>  @error('phone')
                                <p class="text-danger">{{ $message }}</p>
                            @enderror
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label class="form-control-label" for="input-last-name">Môn giảng dạy</label>
                        <input type="text" id="input-last-name" class="form-control" placeholder="Môn giảng dạy" name="domain"  value="{{ $teacher->domain}}">
                      </div>
                    </div>  @error('domain')
                                <p class="text-danger">{{ $message }}</p>
                            @enderror
                  </div>
                </div>
                <hr class="my-4" />
                <!-- Address -->
                <h6 class="heading-small text-muted mb-4">Contact information</h6>
                <div class="pl-lg-4">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label class="form-control-label" for="input-address">Address</label>
                        <input id="input-address" name="address" class="form-control" placeholder="Home Address"  value="{{ $teacher->address}}" type="text">
                      </div>
                    </div>  @error('address')
                                <p class="text-danger">{{ $message }}</p>
                            @enderror
                  </div>
                  {{-- <div class="row">
                    <div class="col-lg-4">
                      <div class="form-group">
                        <label class="form-control-label" for="input-city">City</label>
                        <input type="text" id="input-city" class="form-control" placeholder="City" value="New York">
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <div class="form-group">
                        <label class="form-control-label" for="input-country">Country</label>
                        <input type="text" id="input-country" class="form-control" placeholder="Country" value="United States">
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <div class="form-group">
                        <label class="form-control-label" for="input-country">Postal code</label>
                        <input type="number" id="input-postal-code" class="form-control" placeholder="Postal code">
                      </div>
                    </div>
                  </div> --}}
                </div>
                {{-- <hr class="my-4" />
                <!-- Description -->
                <h6 class="heading-small text-muted mb-4">About me</h6>
                <div class="pl-lg-4">
                  <div class="form-group">
                    <label class="form-control-label">About Me</label>
                    <textarea rows="4" class="form-control" placeholder="A few words about you ...">A beautiful Dashboard for Bootstrap 4. It is Free and Open Source.</textarea>
                  </div>
                </div> --}}
              </form>








            </div>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <footer class="footer pt-0">
        <div class="row align-items-center justify-content-lg-between">
          <div class="col-lg-6">
            <div class="copyright text-center  text-lg-left  text-muted">
              &copy; 2020 <a href="https://www.creative-tim.com" class="font-weight-bold ml-1" target="_blank">Creative Tim</a>
            </div>
          </div>
          <div class="col-lg-6">
            <ul class="nav nav-footer justify-content-center justify-content-lg-end">
              <li class="nav-item">
                <a href="https://www.creative-tim.com" class="nav-link" target="_blank">Creative Tim</a>
              </li>
              <li class="nav-item">
                <a href="https://www.creative-tim.com/presentation" class="nav-link" target="_blank">About Us</a>
              </li>
              <li class="nav-item">
                <a href="http://blog.creative-tim.com" class="nav-link" target="_blank">Blog</a>
              </li>
              <li class="nav-item">
                <a href="https://github.com/creativetimofficial/argon-dashboard/blob/master/LICENSE.md" class="nav-link" target="_blank">MIT License</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  </div>





























             {{-- <form action="" method="POST" enctype="multipart/form-data">
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
                                <label for="">Số điện thoại</label>
                                <input type="text" class="form-control" name="phone" value="{{ $teacher->phone }}" id="" >
                            </div>
                             @error('phone')
                                <p class="text-danger">{{ $message }}</p>
                            @enderror
                        </div>
                        <div class="col-4">
                            <div class="form-group">
                                <label for="">Địa chỉ</label>
                                <input type="text" class="form-control" name="address" value="{{ $teacher->address }}" id="" >
                            </div>
                             @error('address')
                                <p class="text-danger">{{ $message }}</p>
                            @enderror
                        </div>
                        <div class="col-4">
                            <div class="form-group">
                                <label for="">Môn giảng dạy</label>
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
                        
                     {{--   <div class="col-4">
                           
                        </div>
                       
                        <div class="col-6">
                            <a href="{{route('teacher.index')}}" class="btn btn-danger">Hủy</a>
                            <button type="submit" class="btn btn-primary">Lưu</button>

                        </div>
                    </div>
                </form> --}}

        @endsection