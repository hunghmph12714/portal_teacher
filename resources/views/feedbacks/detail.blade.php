<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Phản hồi feedback</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <script src="//cdn.ckeditor.com/4.19.0/standard/ckeditor.js"></script>
</head>

<body>
    <div class="container" style="width: 100%;">
        <div class="row m-5 ">
            <div class=" col-3">
                <img src="https://vietelite.edu.vn/wp-content/uploads/elementor/thumbs/logo-1-pqlel3us4tqrbnci8wlk8gabsz4mmu67lqirmodips.png"
                    alt="">
            </div>
            <div class="col-3"><a name="" id="" class="btn btn-primary" href="{{ route('feedback.list') }}"
                    role="button">Danh
                    sách</a></div>
        </div>
        <div class="row">
            <div class="col">
                <h2>Người dùng gặp lỗi</h2>
                <div>
                    <div> <b>Người dùng: </b> <span>{{ $feedback->user->name }}</span></div>
                    <div> <b>Số điện thoại: </b> <span>{{ $feedback->phone }}</span></div>
                    <div> <b>Tên lỗi: </b> <span>{{ $feedback->title }}</span></div>
                    <div> <b>Mô tả : </b> <span>{!! $feedback->description !!}</span></div>
                    <div>
                        <div>
                            <h3>Hình ảnh</h3>
                        </div>
                        <div class="">
                            @foreach ($feedback->upload as $u)
                            <div class=" p-4">
                                <a href="/{{ $u }}" target="_blank"><img width="600px" src=" /{{ $u }}" alt=""></a>
                            </div>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div>
                    <h2>PHẢN HỒI CHO NGƯỜI DÙNG</h2>
                    <form action="" method="POST" id="result">
                        @csrf
                        <div class="form-group">
                            {{-- <label for=""></label> --}}
                            <textarea class="form-control" name="result" id="ckeditor" rows="3"></textarea>
                        </div>
                    </form>

                </div>
                <div><button form="result" type="submit" class="btn btn-primary">Phản hồi</button></div>
            </div>

        </div>
    </div>
    <script>
        CKEDITOR.replace('ckeditor');
    </script>
</body>

</html>