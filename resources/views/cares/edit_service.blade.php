<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <script src="//cdn.ckeditor.com/4.19.0/standard/ckeditor.js"></script>
</head>

<body style="background-color: hsl(182, 76%, 81%)">
    <div class="container bg-light">
        <div class="bg-success text-center p-4">
            <h2>TIÊU CHÍ ĐÁNH GIÁ HỌC SINH</h2>
        </div>
        <div>
            <h3>Thêm tiêu chí</h3>
            <form action="" method="POST">@csrf
                <div class="form-group">
                    {{-- <label for="">Tiêu chí</label> --}}
                    <textarea class="form-control" name="name" id="" rows="3">{{ $service->name }}</textarea>
                </div>
                <div class="form-check">
                    <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" name="active" id="" value="1" @if ($service->active==1)
                        checked
                        @endif>
                        Hiện tiêu chí
                    </label>
                </div>
                <div class="text-end"><button type="submit" name="" id="" class="btn btn-primary">Lưu tiêu chí</button>
                </div>
            </form>
        </div>
    </div>
</body>

</html>