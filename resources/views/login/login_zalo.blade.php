{{--
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head> --}}
{{--

<body> --}}
  <!--
=========================================================
* Argon Dashboard - v1.2.0
=========================================================
* Product Page: https://www.creative-tim.com/product/argon-dashboard

* Copyright  Creative Tim (http://www.creative-tim.com)
* Coded by www.creative-tim.com
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
-->
  <!DOCTYPE html>
  <html>

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Start your development with a Dashboard for Bootstrap 4.">
    <meta name="author" content="Creative Tim">
    <title>Đăng nhập</title>
    @include('layout.style')
  </head>

  <body class="bg-default">
    <!-- Navbar -->
    <nav id="navbar-main" class="navbar navbar-horizontal navbar-transparent navbar-main navbar-expand-lg navbar-light">
      <div class="container">
        <a class="navbar-brand" href="dashboard.html">
          <img
            src="https://vietelite.edu.vn/wp-content/uploads/elementor/thumbs/logo-1-p7kfawkfsyjlo8t1heumzl3qiu0mhvx9tdy04iq5fk.png">
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-collapse"
          aria-controls="navbar-collapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-collapse navbar-custom-collapse collapse" id="navbar-collapse">
          <div class="navbar-collapse-header">
            <div class="row">
              <div class="col-6 collapse-brand">
                <a href="dashboard.html">
                  <img src="../assets/img/brand/blue.png">
                </a>
              </div>
              <div class="col-6 collapse-close">
                <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbar-collapse"
                  aria-controls="navbar-collapse" aria-expanded="false" aria-label="Toggle navigation">
                  <span></span>
                  <span></span>
                </button>
              </div>
            </div>
          </div>

          <hr class="d-lg-none" />
          <ul class="navbar-nav align-items-lg-center ml-lg-auto">
            <li class="nav-item">
              <a class="nav-link nav-link-icon" href="https://www.facebook.com/vietelite" target="_blank"
                data-toggle="tooltip" data-original-title="Đi đến Facebook của VietElite">
                <i class="fab fa-facebook-square"></i>
                <span class="nav-link-inner--text d-lg-none">Facebook</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link nav-link-icon" href="https://vietelite.edu.vn/" target="_blank" data-toggle="tooltip"
                data-original-title="Đi đến website cuả VietElite">
                <i class="fab fa-internet-explorer"></i>
                <span class="nav-link-inner--text d-lg-none">Website</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <!-- Main content -->
    <div class="main-content">
      <!-- Header -->
      <div class="header bg-gradient-primary py-7 py-lg-8 pt-lg-9">
        <div class="container">
          <div class="header-body text-center mb-7">
            <div class="row justify-content-center">
              <div class="col-xl-5 col-lg-6 col-md-8 px-5">
                <h1 class="text-white">Welcome!</h1>
                {{-- <p class="text-lead text-white">Use these awesome forms to login or create new account in your
                  project for free.</p> --}}
              </div>
            </div>
          </div>
        </div>
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
              <div class="card-header bg-transparent pb-5">
                <div class="text-muted text-center mt-2 mb-3"><b>Sign in with ZALO</b></div>

              </div>
              <div class="card-body px-lg-5 py-lg-5">
                <div class="text-center text-muted mb-4">
                </div>

                @if(Session::has('msg'))
                <p class="login-box-msg text-danger">{{Session::get('msg')}}</p>
                @endif

                <form action="" method="post">
                  @csrf
                  <div class="input-group mb-3">
                    <input type="number" class="form-control" name="phone" value="{{ old('phone') }}"
                      placeholder="Số điện thoại...">

                    <div class="input-group-append">
                      <div class="input-group-text">
                        <i class="fa fa-mobile" aria-hidden="true"></i>
                      </div>

                    </div>
                  </div>
                  <div>
                    @error('phone')
                    <p class="text-danger">{{ $message }}</p>
                    @enderror

                  </div>
                  <div>



                  </div>
                  {!! NoCaptcha :: renderJs () !!}
                  {!! NoCaptcha :: display () !!}
                  @error('g-recaptcha-response')
                  <p class="text-danger"> {{ $message }}</p>

                  @enderror
                  <div class="row">
                    <div class="col-12">
                      <button type="submit" class="btn btn-primary btn-block">Đăng nhập</button>
                    </div>
                    <!-- /.col -->
                  </div>
                </form>






              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <!-- Footer -->
    {{-- <footer class="py-5" id="footer-main">
      <div class="container">
        <div class="row align-items-center justify-content-xl-between">
          <div class="col-xl-6">
            <div class="copyright text-center text-xl-left text-muted">
              &copy; 2020 <a href="https://www.creative-tim.com" class="font-weight-bold ml-1" target="_blank">Creative
                Tim</a>
            </div>
          </div>
          <div class="col-xl-6">
            <ul class="nav nav-footer justify-content-center justify-content-xl-end">
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
                <a href="https://github.com/creativetimofficial/argon-dashboard/blob/master/LICENSE.md" class="nav-link"
                  target="_blank">MIT License</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer> --}}
    <!-- Argon Scripts -->
    @include('layout.script')
  </body>

  </html>
</body>

</html>