{{-- <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>

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
    <title>Argon Dashboard - Free Dashboard for Bootstrap 4</title>
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
              </div>m
            </div>
          </div>

          <hr class="d-lg-none" />
          <ul class="navbar-nav align-items-lg-center ml-lg-auto">
            <li class="nav-item">
              <a class="nav-link nav-link-icon" href="https://www.facebook.com/vietelite" target="_blank"
                data-toggle="tooltip" data-original-title="??i ?????n Facebook c???a VietElite">
                <i class="fab fa-facebook-square"></i>
                <span class="nav-link-inner--text d-lg-none">Facebook</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link nav-link-icon" href="https://vietelite.edu.vn/" target="_blank" data-toggle="tooltip"
                data-original-title="??i ?????n ebsite cu??? VietElite">
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
                <p class="text-lead text-white">Use these awesome forms to login or create new account in your project
                  for free.</p>
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
                <div class="text-muted text-center mt-2 mb-3"><small>Sign in with</small></div>
                <div class="btn-wrapper text-center">
                  <a href="{{ route('login.formZalo') }}" class="btn btn-neutral btn-icon">
                    <span class="btn-inner--icon"><img
                        src="https://page.widget.zalo.me/static/images/2.0/Logo.svg"></span>
                    <span class="btn-inner--text">????ng nh???p b???ng Zalo</span>
                  </a>
                  {{-- <a href="#" class="btn btn-neutral btn-icon">
                    <span class="btn-inner--icon"><img src="../assets/img/icons/common/google.svg"></span>
                    <span class="btn-inner--text">Google</span>
                  </a> --}}
                </div>
              </div>
              <div class="card-body px-lg-5 py-lg-5">
                <div class="text-center text-muted mb-4">
                  <small>Or sign in with credentials</small>
                </div>
                <form role="form" method="POST">
                  @csrf

                  @if(Session::has('message'))
                  <p class="login-box-msg text-danger">{{Session::get('message')}}</p>
                  @endif
                  <div class="form-group mb-3">
                    <div class="input-group input-group-merge input-group-alternative">
                      <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fa fa-mobile" aria-hidden="true"></i>
                        </span>
                      </div>
                      <input class="form-control" placeholder="S??? ??i???n tho???i..." name="phone">
                    </div>
                  </div>
                  @error('phone')
                  <p class="text-danger"> {{ $message }}</p>
                  @enderror
                  <div class="form-group">
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
                  <div class="custom-control custom-control-alternative custom-checkbox">
                    <input class="custom-control-input" id=" customCheckLogin" type="checkbox">
                    <label class="custom-control-label" for=" customCheckLogin">
                      <span class="text-muted">Remember me</span>
                    </label>
                  </div>

                  <div class="text-center">
                    <button type="submit" class="btn btn-primary my-4">Sign in</button>
                  </div>
                </form>
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-6">
                <a href="{{ route('login.forgotPassword') }}" class="text-light"><small>Forgot password?</small></a>
              </div>
              {{-- <div class="col-6 text-right">
                <a href="#" class="text-light"><small>Create new account</small></a>
              </div> --}}
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
    {{-- <script>
      function onSubmit(token) {
     document.getElementById("demo-form").submit();
   }
    </script> --}}
  </body>

  </html>
</body>

</html>