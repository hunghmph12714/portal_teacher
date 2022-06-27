<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <!-- CSS only -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous">
</head>

<body>
    <div>
        <form action="" class="row" method="POST">

            @csrf

            <div class="form-group col-3">
                <label for="">Số điện thoại</label>
                <input type="text" class="form-control " name="phone" id="" aria-describedby="helpId" placeholder="">
                {{-- <small id="helpId" class="form-text text-muted">Help text</small> --}}
            </div>




            <div><button type="submit" name="" id="" class="btn btn-primary ">Check</button></div>
        </form>

        {{-- {{ $data }} --}}


        <h3>Danh sách học sinh</h3>
        {{-- @if($data['students']==null){ --}}
        @if (sizeOf($data['students'])<=0){ Không có ghi danh } @endif @foreach ($data['students'] as $k=>$s)


            <div>
                <h5>Học sinh {{ $k+1 }}</h5>
            </div>
            <div>Họ tên: {{ $s->student_name }}</div>
            <div>Cơ sở: {{ $s->center_name }}</div>



            @endforeach

            {{-- } --}}


    </div>
</body>

</html>