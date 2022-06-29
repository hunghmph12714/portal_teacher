<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <title>Laravel - Dynamic autocomplete search using select2 JS Ajax-nicesnippets.com</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous">
    </script>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>
</head>

<body>
    <div class="container">
<div class="mx-auto align-center m-4">
    <img src="https://vietelite.edu.vn/wp-content/uploads/elementor/thumbs/logo-1-pqlel3us4tqrbnci8wlk8gabsz4mmu67lqirmodips.png"
        alt="">
</div>        <div>
    <h2 class="m-3 text-center">PHÂN QUYỀN QUẢN LÝ LỚP HỌC</h2>
            <form action="" method="POST">
                @csrf
                <div class="form-group m-3 ">
                    <label for=""><b>Chọn lớp</b></label>
                    <select class="form-control select_users col-4"  name="class_id" id="" 
                        onchange="javascript:handleSelect(this)">
                        {{-- <option hidden >Chọn lớp</option> --}}
                        @foreach ($classes as $class)
                        <option @if (!empty($_GET['class_id']))
                            @if ($class->id==$_GET['class_id'])
                                selected
                            @endif
                        @endif value="{{ $class->id }}">{{ $class->code.'-'.$class->name }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="form-group m-3">
                    <label for=""><b>Chọn quản lý</b></label>
                    <select class="form-control select_users" name="quan_ly[]" multiple id="">
                        @foreach ($users as $u)
                        <option class="" @if (!empty($_GET['class_id'])) @if ( in_array($_GET['class_id'], array_column(
                            $u->user_class->where('role',2)->toArray(),'class_id'))==true) selected @endif
                            @endif value="{{ $u->id }}">
                            {{ $u->name
                            }}
                        </option>

                        @endforeach
                    </select>
                </div>
                <div class="form-group m-3">
                    <label for=""><b>Chọn Trợ giảng</b></label>
                    <select class="form-control select_users" name="tro_giang[]" multiple id="">
                        @foreach ($users as $u)
                        <option @if (!empty($_GET['class_id'])) @if ( in_array($_GET['class_id'], array_column(
                            $u->user_class->where('role',1)->toArray(),'class_id'))==true) selected @endif
                            @endif value="{{ $u->id }}">{{ $u->name }}</option>

                        @endforeach
                    </select>
                </div>
                <div class="form-group m-3">
                    <label for=""><b>Chọn người xem</b></label>
                    <select class="form-control select_users" name="nguoi_xem[]" multiple id="">
                        @foreach ($users as $u)
                        <option @if (!empty($_GET['class_id'])) @if ( in_array($_GET['class_id'], array_column(
                            $u->user_class->where('role',0)->toArray(),'class_id'))==true) selected @endif
                            @endif value="{{ $u->id }}">{{ $u->name }}</option>

                        @endforeach
                    </select>
                </div>
                <div class=" text-center m-4"><button type="submit" class="btn btn-primary " >Lưu thay đổi</button></div>
            </form>
        </div>
    </div>
    <script type="text/javascript">
        $('.select_users').select2(  );
    </script>
    <script type="text/javascript">
        function handleSelect(elm) {
                    window.location = 'phan-quyen-lop-hoc?class_id='+elm.value ;
                }
    </script>
</body>

</html>