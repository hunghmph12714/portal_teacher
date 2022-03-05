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

<body>
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

                                {{-- <p>Thời gian bắt đầu: {{ $result['quiz']['start_time'] }}</p>
                                <p>Thời gian kết thúc: {{ $result['quiz']['finish_time'] }}</p> --}}

                            </div>
                        </div>

                    </td>
                    <td class="col-3">Môn thi


                        <form action="" method="get">
                            @foreach ($result['domain'] as $d)
                            <input name="domain" id="" class="btn btn-primary" type="submit" value="{{ $d }}">
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
                        @endif</td>
                </tr>
                <tr>
                    <td class="px-3" scope="row">


                        Câu {{ $loop->iteration }} : {!! str_replace('!@#','<input type="text" value="hùng"
                            disabled'. '>' ,$item['content']) !!} {{-- $item['a_fib'] --}} <br>
                        @if (!empty($item['options']))
                        <div>
                            @foreach ($item['options'] as $o)
                            {{-- <input type="radio" disabled id=""> {!! $o['content'] !!} --}}
                            <div class="form-check">
                                <label class="form-check-label">
                                    <input type="radio" class="form-check-input" disabled name="{{ $o['id'] }}" id=""
                                        value="checkedValue" @if ($o['id']==$item['a_option']) checked @endif>
                                    {!! $o['content'] !!}
                                </label>
                            </div>
                            @endforeach
                        </div>
                        @endif

                        @if ($item['a_essay']!='')

                        <textarea disabled name="" id="" cols="80" rows="5"> {{ $item['a_essay'] }}</textarea>

                        @endif

                    </td>
                    <td class="bg-success p-2" style="--bs-bg-opacity: .3;">

                        <div class="row m-0">
                            <div class="col-2 bg-warning " style="height: 100px; --bs-bg-opacity: .5;">
                                <h5 style="text-align: center" class=" p-1">Điểm</h5>


                                <p style="text-align: center; font-size: 20px;">{{ $item['score'] }}</p>


                            </div>
                            <div class="col">
                                <h5 style="text-align: center" class=" p-1">Nhận xét</h5>
                                {!! $item['comment'] !!}
                            </div>
                        </div>


                    </td>
                </tr>
                @endforeach

            </tbody>
        </table>
    </div>
</body>

</html>