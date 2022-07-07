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
            <h3>Danh sách </h3>
            <div><a name="" id="" class="btn btn-primary" href="{{ route('service.add') }}" role="button">Thêm tiêu chí</a></div>
            <form action="" method="POST">
                @csrf
                <table class="table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên tiêu chí</th>
                            <th><button type="submit" name="" id="" class="btn btn-primary btn-sm"  >Active</button></th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($services as $s)
                        <tr>
                            <td scope="row">{{($services->currentPage() - 1)*$services->perPage() + $loop->iteration}}
                            </td>
                            <td><a href="{{ route('service.edit', ['id'=>$s->id]) }}">{{ $s->name }}</a></td>
                            <td>
                                <input type="checkbox" class="form-check-input" name="active[]" id=""
                                    value="{{ $s->id }}" @if ($s->active==1)
                                checked
                                @endif>
                            </td>
                        </tr>
                        @endforeach


                    </tbody>
                </table> {{ $services->links() }}

            </form>
        </div>
    </div>
</body>

</html>