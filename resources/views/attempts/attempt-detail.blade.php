<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous">
    </script>
    {{-- @include('layout') --}}

</head>


<body class="position-relative">
    <style>
        .quiz-content img {
            max-width: 600px !important;
        }
    </style>
    <script src="//cdn.ckeditor.com/4.17.2/standard/ckeditor.js"></script>
    <form action="" method="POST">
        @csrf
        <div class="container">
            <table class="table border">

                <tbody class="">
                    <tr class="row-8">
                        <td scope="row" class="col-5">

                            <div class="row ">
                                <div class="col border border border-warning border-3">
                                    {{-- <h5>Họ Tên</h5> --}}
                                    <h5>
                                        @if (!empty( $result['student'] ))
                                        {{ $result['student'] }}
                                        @endif

                                    </h5>

                                </div>
                                <div class=" col">

                                    <p>Thời gian bắt đầu: {{ $result['quiz']['start_time'] }}</p>
                                    <p>Thời gian kết thúc: {{ $result['quiz']['finish_time'] }}</p>

                                </div>
                            </div>

                        </td>
                        <td class="col-3">Môn thi


                            <form action="" method="get" class="d-flex">
                                @foreach ($result['domain'] as $d)
                                {{-- <input name="domain" id="" class="btn btn-primary" type="submit" value="{{ $d }}">
                                --}}
                                <div class="m-1" style="">
                                    <button type="submit" name="domain" value="{{ $d['domain'] }}"
                                        class="btn btn-primary">{{
                                        $d['domain'] ." - ".$d['question_number']." câu" }}</button><br>
                                    <div>
                                        <p class="border border-success rounded m-2 p-2">Điểm: <b>{{ $d['score'] }}</b>
                                        </p>
                                    </div>
                                </div>
                                @endforeach
                            </form>
                        </td>
                    </tr>

                    @foreach ($result['questions'] as $item)
                    <tr>
                        <td><b>@if (!empty($item['main_statement']))
                                {{ $item['main_statement'] }}
                                @endif</b>
                            @if (!empty($item['main_content']))
                            {!! $item['main_content'] !!}
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <td class="px-3" scope="row">


                            Câu {{ $loop->iteration }} :

                            {{-- @foreach ($item['a_fib'] as $key=>$f)
                            {!! str_replace('{'. $key+1 .'}','<input type="text" value="'.$f.'" disabled'. '>'
                                ,$item['content']) !!} @endforeach <br> --}}

                            {!! $item['content'] !!}

                            {{-- @for ($i = 1; $i < $result['int'] ; $i++) @if ($item['a_fib'][$i]!=null) {!!
                                str_replace('{'. $i .'}','<input type="text" value="'.$item['a_fib'][$i].'"
                                disabled'. '>' ,$item['content']) !!} <br>
                                @else
                                {!!
                                str_replace('{'. $i .'}','<input type="text" value="" disabled'. '>' ,$item['content'])
                                    !!} <br>
                                @endif

                                @endfor --}}


                                @if (!empty($item['options']))
                                <div>
                                    @foreach ($item['options'] as $o)
                                    {{-- <input type="radio" disabled id=""> {!! $o['content'] !!} --}}
                                    <div class="form-check">
                                        <label class="form-check-label">
                                            <input type="radio" class="form-check-input" disabled name="{{ $o['id'] }}"
                                                id="" value="checkedValue" @if ($o['id']==$item['a_option']) checked
                                                @endif>
                                            {!! $o['content'] !!}
                                        </label>
                                    </div>
                                    @endforeach
                                </div>
                                @endif

                                @if ($item['a_essay']!='')

                                {{-- <textarea disabled name="" id="" cols="80" rows="5"> </textarea> --}}
                                <div class="form-control bg-secondary border border-success quiz-content "
                                    style="--bs-bg-opacity: .1">
                                    {!! $item['a_essay'] !!}
                                </div>
                                @endif

                        </td>
                        <td class="bg-success p-2" style="--bs-bg-opacity: .3;">

                            <div class="row m-0">
                                <div class="col-3 bg-warning " style="max-height: 100px; --bs-bg-opacity: .5;">
                                    <h5 style="text-align: center" class=" p-1">Điểm</h5>

                                    <div class="form-group">
                                        {{-- <label for="">Điểm</label> --}}
                                        <input value="{{ $item['score'] }}" step="0.25" type="number" min="0"
                                            name="score[{{ $item['attempt_detail_id'] }}]" class="form-control" name=""
                                            id="" aria-describedby="helpId" placeholder="">
                                        {{-- <small id="helpId" class="form-text text-muted">Help text</small> --}}
                                    </div>
                                    {{-- <p style="text-align: center; font-size: 20px;">{{ $item['score'] }}</p> --}}


                                </div>
                                <div class="col">
                                    <h5 style="text-align: center" class=" p-1">Nhận xét</h5>
                                    {{-- {!! $item['comment'] !!} --}}
                                    <textarea id="{{ $item['id'] }}" name="comment[{{ $item['attempt_detail_id'] }}]"
                                        cols="30" rows="10">{!! $item['comment'] !!}</textarea>
                                    <script>
                                        CKEDITOR.replace('{{ $item['id'] }}')
                                    </script>
                                </div>
                            </div>


                        </td>
                    </tr>
                    @endforeach



                    <tr>
                        <td>

                            <h5>TIêu chí đánh giá</h5>

                            <button type="button" onclick="add()">Thêm đánh giá</button>

                            <div id="danh-gia">
                                @foreach ($result['criterias'] as $c)
                                <div style="border-radius: 8px;
                                        margin-bottom: 10px;
                                        padding: 15px;
                                        border: 1px solid green;">
                                    <div style="" class="mb-3">
                                        <input type="text" value="{{ $c['title'] }}"
                                            name="criteria_title[{{ $c['id'] }}]"
                                            style="padding-top: 10.5px; border-radius: 8px;   padding-bottom: 10.5px;border: 1px solid green;">
                                    </div>
                                    {{-- <input type="text" value="{{ $c['content'] }}"> --}}
                                    <textarea
                                        style="padding-top: 10.5px; border-radius: 8px;width: 100%;  padding-bottom: 10.5px;border: 1px solid green;"
                                        name="criteria_content[{{ $c['id'] }}]" id="" cols="30"
                                        rows="3">{{ $c['content'] }}</textarea>
                                </div>
                                @endforeach


                            </div>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>
        <div class="d-flex right-0  " width="100px">
            <button class="btn btn-success form-control kn plg " width="100px" type="submit">Lưu Đánh Giá</button>
        </div>

    </form>
    <div id="add-danh-gia"
        style="border-radius: 8px; margin-bottom: 10px; padding: 15px; border: 1px solid green; display: none">
        <div style="" class="mb-3">
            <input type="text" value="" disabled name="criteria_title[]"
                style="padding-top: 10.5px; border-radius: 8px;   padding-bottom: 10.5px;border: 1px solid green;">
        </div>
        {{-- <input type="text" value="{{ $c['content'] }}"> --}}
        <textarea disabled
            style="padding-top: 10.5px; border-radius: 8px;width: 100%;  padding-bottom: 10.5px;border: 1px solid green;"
            name="criteria_content[]" id="" cols="30" rows="3"></textarea>
    </div>
    <script>
        function add(){
        danhgia=document.getElementById('danh-gia');
        adddanhgia=document.getElementById('add-danh-gia');
        adddanhgia.style='display:block'
        danhgia.innerHTML+=adddanhgia.innerHTML
        adddanhgia.style='display:none'
   }

    </script>


    <script src="//cdn.ckeditor.com/4.17.2/standard/ckeditor.js"></script>
    {{-- <script type="text/javascript">
        CKEDITOR.replace('nx');
  CKEDITOR.replace('.nhanxet');

    </script> --}}
</body>

</html>