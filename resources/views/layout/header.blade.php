<!-- Topnav -->
<nav class="navbar navbar-top navbar-expand navbar-dark bg-primary border-bottom">
  <div class="container-fluid">
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <!-- Search form -->
      <form class="navbar-search navbar-search-light form-inline mr-sm-3" id="navbar-search-main">
        <div class="form-group mb-0">
          <div class="input-group input-group-alternative input-group-merge">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="fas fa-search"></i></span>
            </div>
            <input class="form-control" placeholder="Search" type="text">
          </div>
        </div>
        <button type="button" class="close" data-action="search-close" data-target="#navbar-search-main"
          aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
      </form>
      <!-- Navbar links -->
      <ul class="navbar-nav align-items-center  ml-md-auto ">
        {{-- <li class="nav-item d-xl-none">
          <!-- Sidenav toggler -->
          <div class="pr-3 sidenav-toggler sidenav-toggler-dark" data-action="sidenav-pin" data-target="#sidenav-main">
            <div class="sidenav-toggler-inner">
              <i class="sidenav-toggler-line"></i>
              <i class="sidenav-toggler-line"></i>
              <i class="sidenav-toggler-line"></i>
            </div>
          </div>
        </li>
        <li class="nav-item d-sm-none">
          <a class="nav-link" href="#" data-action="search-show" data-target="#navbar-search-main">
            <i class="ni ni-zoom-split-in"></i>
          </a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="ni ni-bell-55"></i>
          </a>
          <div class="dropdown-menu dropdown-menu-xl  dropdown-menu-right  py-0 overflow-hidden">
            <!-- Dropdown header -->
            <div class="px-3 py-3">
              <h6 class="text-sm text-muted m-0">You have <strong class="text-primary">13</strong> notifications.</h6>
            </div>
            <!-- List group -->
            <div class="list-group list-group-flush">

            </div>
            <!-- View all -->
            <a href="#!" class="dropdown-item text-center text-primary font-weight-bold py-3">View all</a>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="ni ni-ungroup"></i>
          </a>
          <div class="dropdown-menu dropdown-menu-lg dropdown-menu-dark bg-default  dropdown-menu-right ">
            <div class="row shortcuts px-4">
              <a href="#!" class="col-4 shortcut-item">
                <span class="shortcut-media avatar rounded-circle bg-gradient-red">
                  <i class="ni ni-calendar-grid-58"></i>
                </span>
                <small>Calendar</small>
              </a>
              <a href="#!" class="col-4 shortcut-item">
                <span class="shortcut-media avatar rounded-circle bg-gradient-orange">
                  <i class="ni ni-email-83"></i>
                </span>
                <small>Email</small>
              </a>
              <a href="#!" class="col-4 shortcut-item">
                <span class="shortcut-media avatar rounded-circle bg-gradient-info">
                  <i class="ni ni-credit-card"></i>
                </span>
                <small>Payments</small>
              </a>
              <a href="#!" class="col-4 shortcut-item">
                <span class="shortcut-media avatar rounded-circle bg-gradient-green">
                  <i class="ni ni-books"></i>
                </span>
                <small>Reports</small>
              </a>
              <a href="#!" class="col-4 shortcut-item">
                <span class="shortcut-media avatar rounded-circle bg-gradient-purple">
                  <i class="ni ni-pin-3"></i>
                </span>
                <small>Maps</small>
              </a>
              <a href="#!" class="col-4 shortcut-item">
                <span class="shortcut-media avatar rounded-circle bg-gradient-yellow">
                  <i class="ni ni-basket"></i>
                </span>
                <small>Shop</small>
              </a>
            </div>
          </div>
        </li> --}}
      </ul>
      <ul class="navbar-nav align-items-center  ml-auto ml-md-0 ">
        <li class="nav-item dropdown">
          @if (Auth::user())
          <a class="nav-link pr-0" href="#" role="button" data-toggle="dropdown" aria-haspopup="true"
            aria-expanded="false">
            <div class="media align-items-center">
              <span class="avatar avatar-sm rounded-circle">
                <img alt="Image placeholder" src="{{ asset('admin') }}/assets/img/theme/team-4.jpg">
              </span>
              <div class="media-body  ml-2  d-none d-lg-block">
                <span class="mb-0 text-sm  font-weight-bold">{{ Auth::user()->name }}</span>
              </div>
            </div>
          </a>
          
          <div class="dropdown-menu  dropdown-menu-right ">
            <div class="dropdown-header noti-title">
              <h6 class="text-overflow m-0">Welcome!</h6>
            </div>
            <a href="{{ route('teacher.edit', ['id'=>Auth::user()->id]) }}" class="dropdown-item">
              <i class="ni ni-single-02"></i>
              <span>Cập nhật thông tin</span>
            </a>
            <a href="{{ route('teacher.updatePassword', ['id'=>Auth::user()->id]) }}" class="dropdown-item">
              <i class="ni ni-settings-gear-65"></i>
              <span>Đổi mật khẩu</span>
            </a>
            {{-- <a href="#!" class="dropdown-item">
              <i class="ni ni-calendar-grid-58"></i>
              <span>Activity</span>
            </a>
            <a href="#!" class="dropdown-item">
              <i class="ni ni-support-16"></i>
              <span>Support</span>
            </a> --}}
            <div class="dropdown-divider"></div>
            <a href="{{ route('user.logout') }}" class="dropdown-item">
              <i class="ni ni-user-run"></i>
              <span>Đăng xuất</span>
            </a>
          </div>
      @endif  </li>
      </ul>
    </div>
  </div>
</nav>
<!-- Header -->
<!-- Header -->
<div class="header bg-primary pb-6">
  <div class="container-fluid">
    <div class="header-body">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0 text-uppercase"> @yield('title') </h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            {{-- <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
              <li class="breadcrumb-item"><a href="#"><i class="fas fa-home"></i></a></li>
              <li class="breadcrumb-item"><a href="#">Dashboards</a></li>
              <li class="breadcrumb-item active" aria-current="page">Default</li>
            </ol> --}}
          </nav>
        </div>
        <div class="col-lg-6 col-5 text-right">
          {{-- <a href="#" class="btn btn-sm btn-neutral">New</a>
          <a href="#" class="btn btn-sm btn-neutral">Filters</a> --}}
        </div>
      </div>
      <!-- Card stats -->

    </div>
  </div>
</div>