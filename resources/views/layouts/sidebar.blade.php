<aside style="color: lightcyan" class="main-sidebar  elevation-4 bg-success">
    <!-- Brand Logo -->
    <a href="index3.html" class="brand-link">
        <img width="170px" src="https://vietelite.1office.vn/pfiles/vietelite/settings/images/VietElite-Logo-done-dark-small-11.27.16-03.10.2021.thumb.png" alt="AdminLTE Logo" class="" style="opacity: .8">
        {{-- <span class="brand-text font-weight-light">AdminLTE 3</span> --}}
    </a>

    <!-- Sidebar -->
    <div class="sidebar bg-warning ">
        <div>
            @if (Auth::user())
            {{-- <p>{{ Auth::user()->name }}</p> --}}
    
        <div class="user-panel mt-3 pb-3 mb-3 ">
       <div class="d-flex ">  
              {{-- <div class="image">
                <img src="{{ Auth::user()->avata }}" class="img-circle elevation-2" alt="User Image">
            </div> --}}
            <div class="info">
                <a href="#" class="d-block">Hi!... <b>{{ Auth::user()->name }}</b></a>
            </div>
         </div>
             <div class="info b">
                <a href="{{ route('teacher.edit', ['id'=> Auth::user()->id]) }}" class="d-block">Cập nhật</a>
            </div>
             <div class="info">
                <a href="{{ route('teacher.updatePassword', ['id'=> Auth::user()->id]) }}" class="d-block">Đổi mật khẩu</a>
            </div>
        </div>  
          @endif 
        </div>
        <!-- Sidebar user panel (optional) -->
       

        <!-- SidebarSearch Form -->
        {{-- <div class="form-inline">
            <div class="input-group" data-widget="sidebar-search">
                <input class="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search">
                <div class="input-group-append">
                    <button class="btn btn-sidebar">
                        <i class="fas fa-search fa-fw"></i>
                    </button>
                </div>
            </div>
        </div> --}}

        <!-- Sidebar Menu -->
    @if (Auth::user())
            <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
                <li class="nav-item menu-open">
                  
                    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="{{ route('teacher.class',['id'=>Auth::user()->id]) }}" class="nav-link ">
                                <i class="fa fa-graduation-cap"></i>
                                <p>Danh sánh lớp học</p>
                            </a>
                        </li>
                         <li class="nav-item">
                            <a href="{{ route('teacher.index') }}" class="nav-link ">
                                <i class="fa fa-camera-retro"></i>
                                <p>Kỳ thi</p>
                            </a>
                        </li> 
                        {{-- <li class="nav-item">
                            <a href="{{ route('teacher.index') }}" class="nav-link ">
                                <i class="far fa-circle nav-icon"></i>
                                <p>Giáo viên</p>
                            </a>
                        </li> --}}
                       
                        <li class="nav-item">
                            <a href="/logout" class="nav-link">
                                {{-- <i class="far fa-circle nav-icon"></i> --}}
                               <i><u>Đăng xuất</u></i>
                            </a>
                        </li>
                    </ul>
                </li>

            </ul>
        </nav>
    @endif
        <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
</aside>
