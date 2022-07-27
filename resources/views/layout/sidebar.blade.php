<nav class="sidenav navbar navbar-vertical  fixed-left  navbar-expand-xs navbar-light bg-white" id="sidenav-main">
  <div class="scrollbar-inner">
    <!-- Brand -->
    <div class="sidenav-header  align-items-center">
      <a class="navbar-brand" href="javascript:void(0)">
        <img
          src="https://vietelite.edu.vn/wp-content/uploads/elementor/thumbs/logo-1-p7kfawkfsyjlo8t1heumzl3qiu0mhvx9tdy04iq5fk.png"
          class="navbar-brand-img" alt="...">
      </a>
    </div>
    @if (Auth::user())
    <div class="navbar-inner">
      <!-- Collapse -->
      <div class="collapse navbar-collapse" id="sidenav-collapse-main">
        <!-- Nav items -->
        <ul class="navbar-nav">

          <li class="nav-item">
            <a class="nav-link" href="{{ route('teacher.edit', ['id'=>Auth::user()->id]) }}">
              <i class="ni ni-circle-08 text-pink"></i>
              <span class="nav-link-text">Cập nhật</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="{{ route('teacher.updatePassword', ['id'=>Auth::user()->id]) }}">
              <i class="ni ni-send text-dark"></i>
              <span class="nav-link-text">Đổi mật khẩu</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/logout">
              {{-- <i class="ni ni-send text-dark"></i> --}}
              <span class="nav-link-text">Đăng xuất</span>
            </a>
          </li>
        </ul>
        <!-- Divider -->
        <hr class="my-3">
        <!-- Heading -->
        <h6 class="navbar-heading p-0 text-muted">
          <span class="docs-normal">Nội dung</span>
        </h6>
        <!-- Navigation -->
        <ul class="navbar-nav mb-md-3">
          <li class="nav-item">
            <a class="nav-link" href="{{ route('teacher.class', ['id'=>Auth::user()->id]) }}">
              <i class="ni ni-spaceship"></i>
              <span class="nav-link-text">Lớp giảng dạy</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="https://demos.creative-tim.com/argon-dashboard/docs/foundation/colors.html"
              target="_blank">
              <i class="ni ni-palette"></i>
              <span class="nav-link-text">Kỳ thi</span>
            </a>
          </li>

        </ul>
      </div>
    </div>

    @endif
  </div>
</nav>