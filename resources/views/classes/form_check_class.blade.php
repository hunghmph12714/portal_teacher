<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    @include('layout.style')

</head>
<body>
    <div class="main-content">
        <!-- Header -->
        <div class="header bg-gradient-primary py-7 py-lg-8 pt-lg-9">
          {{-- <div class="container">
            <div class="header-body text-center mb-7">
              <div class="row justify-content-center">
                <div class="col-xl-5 col-lg-6 col-md-8 px-5">
             <img src="{{ asset('') }}image_system/vee.png" alt="">
                  <p class="text-lead text-white">Use these awesome forms to login or create new account in your project
                    for free.</p> 
                </div>
              </div>
            </div>
          </div> --}}
          <div class="separator separator-bottom separator-skew zindex-100">
            <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1"
              xmlns="http://www.w3.org/2000/svg">
              <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
            </svg>
          </div>
        </div>
        <!-- Page content -->
        <div class="container mt--8 pb-5">
          <div class="row justify-content-center">
            <div class="col-lg-5 col-md-7">
              <div class="card bg-secondary border-0 mb-0">
             
                <div class="card-body px-lg-5 py-lg-5">
                  <div class="text-center text-muted mb-4">
                    <small>Nhập số điện thoại để kiểm tra ca học</small>
                  </div>
                  <form role="form" method="POST">
                    @csrf
  
                    {{-- @if(Session::has('message'))
                    <p class="login-box-msg text-danger">{{Session::get('message')}}</p>
                    @endif --}}
                    <div class="form-group mb-3">
                      <div class="input-group input-group-merge input-group-alternative">
                        <div class="input-group-prepend">
                          <span class="input-group-text"><i class="fa fa-mobile" aria-hidden="true"></i>
                          </span>
                        </div>
                        <input class="form-control" placeholder="Số điện thoại..." name="phone">
                      </div>
                    </div>
                    @error('phone')
                    <p class="text-danger"> {{ $message }}</p>
                    @enderror
                    {{-- <div class="form-group">
                      <div class="input-group input-group-merge input-group-alternative">
                        <div class="input-group-prepend">
                          <span class="input-group-text"><i class="ni ni-lock-circle-open"></i></span>
                        </div>
                        <input class="form-control" placeholder="Password" name="password" type="password">
                      </div>
                    </div>
                    @error('password')
                    <p class="text-danger"> {{ $message }}</p>
                    @enderror
               
   --}}
                    <div class="text-center">
                      <button type="submit" class="btn btn-primary my-4">Kiểm tra</button>
                    </div>
                  </form>
                </div>
              </div>
             
            </div>
          </div>
        </div>
      </div>
</body>
</html>