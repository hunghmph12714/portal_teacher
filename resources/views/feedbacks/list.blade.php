<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Feedback</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>

<body>
    <div class="container">

        <div class="m-4">
            <div>
                <h2>Danh sách Feedback<span class="badge badge-primary">New</span></h2>
            </div>
            <div>
                {{-- <form action="" method="POST" id="dxl">
                    @csrf
                    <button type="submit" name="" class="btn btn-primary btn-lg btn-block"> Đã xử lý</button>
                </form> --}}

                <table class="table table-striped table-inverse table-responsive" style="width: 70%">
                    <thead class="thead-inverse">
                        <tr>
                            <th><input type="checkbox" onclick="checkboxFeedback()" name="" id=""></th>
                            <th>STT</th>
                            <th>Tiêu đề</th>
                            <th>Mô tả</th>
                            <th>Ngày</th>
                            <th>Người dùng</th>
                            <th>Loại</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($feedbacks as $key=>$f)

                        <tr>
                            <td><input type="checkbox" form="dxl" name="feedbacks_id[]" value="{{ $f->id }}" id=""></td>
                            <td scope="row">{{($feedbacks->currentPage() - 1)*$feedbacks->perPage() + $loop->iteration}}</td>
                            <td><a href="{{ route('feedback.chi-tiet', ['id'=>$f]) }}">{{ $f->title }}</a></td>
                            <td>{!! $f->description !!}</td>
                            <td>{{ $f->created_at }}</td>
                            <td>{{ $f->user->name }}</td>
                            <td>@if ($f->status==1)
                                Đang xử lý
                                @elseif($f->status==2)
                                Đã xử lý
                                @endif</td>
                            <td>@if ($f->status==1)
                                Báo lỗi
                                @elseif($f->status==2)
                                Góp ý nâng cấp
                                @endif</td>
                        </tr>
                        @endforeach


                    </tbody>
                </table>
                {{ $feedbacks->links() }}
            </div>
        </div>
        <script>
            // function checkboxFeedback(){
            //     var feedbacks_id=document.querySelectorAll(['feedbacks_id']);
            //     console.log(feedbacks_id);
            // }
        </script>
</body>

</html>