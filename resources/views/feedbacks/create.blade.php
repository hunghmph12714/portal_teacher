<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Feedback</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <script src="//cdn.ckeditor.com/4.19.0/standard/ckeditor.js"></script>
</head>

<body class="s">
    <div class="row ">
        <div class="col m-4">
            <div class="mx-auto align-center">
                <img src="https://vietelite.edu.vn/wp-content/uploads/elementor/thumbs/logo-1-pqlel3us4tqrbnci8wlk8gabsz4mmu67lqirmodips.png"
                    alt="">
            </div>
            <div class="">
                <form action="" method="post" class="p-4 mx-auto border border-dark p-4" style="width: 80%"
                    enctype="multipart/form-data">
                    @csrf
                    <div class="form-group">
                        <h2 class="mx-auto align-center form-group">Nhập thông tin</h2>
                    </div>
                    <div class="form-group m-3">
                        <label class="fw-bold" for="">Số điện thoại</label>
                        <input type="text" class="form-control" value="{{ old('phone') }}" name="phone" id=""
                            aria-describedby="helpId" placeholder="Nhập số điện thoại...">
                        @error('phone')
                        <small id="helpId" class="form-text  text-danger">{{ $message }}</small>

                        @enderror
                    </div>
                    <div class="form-group m-3">
                        <label class="fw-bold" for="">Tiêu đề</label>
                        <input type="text" class="form-control" value="{{ old('title') }}" name="title" id=""
                            aria-describedby="helpId" placeholder="Nhập thông tin...">
                        @error('title')
                        <small id="helpId" class="form-text  text-danger">{{ $message }}</small>

                        @enderror
                    </div>
                    <div class="form-group m-3">
                        <label class="fw-bold" for="">Mô tả lỗi</label>
                        <textarea class="form-control" name="description" id="ckeditor"
                            rows="3">{{ old('description') }}</textarea>@error('description')
                        <small id="helpId" class="form-text  text-danger">{{ $message }}</small>

                        @enderror
                    </div>
                    <div class="form-group m-3">
                        <label class="fw-bold" for="">Upload ảnh lỗi</label>
                        <input type="file" class="form-control" name="upload[]" id="" aria-describedby="helpId"
                            placeholder="Nhập thông tin..." multiple>
                        @error('upload[]')
                        <small id="helpId" class="form-text  text-danger">{{ $message }}</small>

                        @enderror
                    </div>
                    <div class="form-check form-check-inline">
                        <label class="form-check-label fw-bold">
                            <input class="form-check-input" type="radio" name="type" @if (old('type')==1) checked @endif
                                id="" value="1"> Báo lỗi
                        </label>
                    </div>
                    <div class="form-check form-check-inline fw-bold">
                        <label class="form-check-label">
                            <input class="form-check-input" type="radio" name="type" id="" @if (old('type')==2) checked
                                @endif value="2"> Góp ý, nâng cấp
                        </label>
                    </div><br>@error('type')
                    <small id="helpId" class="form-text  text-danger">{{ $message }}</small>

                    @enderror
                    <div class="m-4 mx-auto align-center">
                        <button type="submit" class="btn btn-primary mx-auto align-center right">Gửi Feeback</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="col">
            <div class="m-4">
                <div>
                    <h2>Danh sách Feedback<span class="badge badge-primary">New</span></h2>
                </div>
            </div>
            <table class="table table-striped table-inverse table-responsive" style="width: 80%">
                <thead class="thead-inverse">
                    <tr>
                        <th>STT</th>
                        <th>Tiêu đề</th>
                        <th>Mô tả</th>
                        <th>Ngày</th>
                        <th>Người dùng</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($feedbacks as $f)
                    <tr>
                        <td scope="row">{{($feedbacks->currentPage() - 1)*$feedbacks->perPage() + $loop->iteration}}
                        </td>
                        <td>{{ $f->title }}</td>
                        <td>{!! $f->description !!}</td>
                        <td>{{ $f->created_at }}</td>
                        <td>{{ $f->user->name }}</td>
                        <td>@if ($f->status==1)
                            Đang xử lý
                            @elseif($f->status==2)
                            Đã xử lý
                            @endif</td>
                    </tr>
                    @endforeach


                </tbody>
            </table>
            {{ $feedbacks->links() }}
        </div>
    </div>
    </div>
    <script>
        CKEDITOR.replace('ckeditor');
    </script>
</body>

</html>