<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Chăm sóc chủ động</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <script src="//cdn.ckeditor.com/4.19.0/standard/ckeditor.js"></script>
</head>

<body style="background-color: hsl(182, 76%, 81%)">

    <div class="container bg-light">
        <div class="bg-success text-center p-4">
            <h2>CHĂM SÓC CHỦ ĐỘNG</h2>
        </div>
        {{-- {{ dd($get) }} --}}<form action="" method="POST">
            @csrf
        <div class="p-4 ">
            <div>
                <span><b>Học sinh: </b> {{ $student->fullname }}</span><br>
                <span><b>Lớp: </b> {{ $class->code.'-'.$class->name }}</span>

            </div>

            <div class="p-4 ">

                <h3>1. Phương thức chăm sóc</h3>
                <div onclick="cscd()">
                    <div class="form-check">
                        <label class="form-check-label">
                            <input type="radio" class="form-check-input" name="method" id="" value=" Điện thoại">
                            Điện thoại
                        </label>
                    </div>
                    <div class="form-check">
                        <label class="form-check-label">
                            <input type="radio" class="form-check-input" name="method" id="" value="Email">
                            Email
                        </label>
                    </div>
                    <div class="form-check">
                        <label class="form-check-label">
                            <input type="radio" class="form-check-input" name="method" id="" value="Tin nhắn SMS">
                            Tin nhắn SMS
                        </label>
                    </div>
                    <div class="form-check">
                        <label class="form-check-label">
                            <input type="radio" class="form-check-input" name="method" id="" value="Zalo">
                            Zalo
                        </label>
                    </div>
                    <div class="form-check">
                        <label class="form-check-label">
                            <input type="radio" class="form-check-input" name="method" id="" value="Trực tiếp">
                            Trực tiếp
                        </label>
                    </div>
                    <div class="form-check">
                        <label class="form-check-label">
                            <input type="radio" class="form-check-input" name="method" id="khac">
                            Khác
                        </label>
                    </div>
                    <div class="form-group " style="display: none" id="form_khac">
                        {{-- <label for=""></label> --}}
                        <input type="text" class="form-control" name="method1" id="input_khac" aria-describedby="helpId"
                            placeholder="Nhập phương thức">
                        {{-- <small id="helpId" class="form-text text-muted">Help text</small> --}}
                    </div>
                </div>
            </div>

            @foreach ($services as $k=>$s)
            <div class="p-4">
                <h3>{{ $k+2 .". ".$s->name }}</h3>
                <div class="form-group">
                    {{-- <label for=""></label> --}}
                    <textarea class="form-control" placeholder="Nhập câu trả lời của bạn..." name="cares[{{ $s->id }}]" id=""
                        rows="5"></textarea>
                </div>
            </div>
            @endforeach

            <div><button type="submit" name="" id="" class="btn btn-primary btn-lg btn-block">Lưu thông tin</button></div>

        </div></form>

    </div>
    <script>
        function cscd(){
      var  khac=document.getElementById('khac');    
        var form_khac=document.getElementById('form_khac');

// console.log(khac);
      if(khac.checked == true){
       form_khac.style='display: block'
      }
      else{
       form_khac.style='display: none';
       var form_khac=document.getElementById('input_khac').value='';


      }
    }
    </script>
</body>

</html>