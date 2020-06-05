<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous">

    <style>
    .ui-autocomplete {
        overflow: auto;
        height: 300px;
    }
    label{
        font-weight: bold;
    }
    </style>
  </head>
  <body>
    
    <div class="container-fluid">
        <h1>Đăng ký ghi danh tuyển sinh</h1>
        <form action="{{ url('handle-form') }}" method="POST" role="form">  
            {{ csrf_field() }}
            <h2>Thông tin học sinh</h2>
            <div class="form-row">
                <div class="form-group col-md-4">
                    <label for="inputEmail4">Họ tên học sinh (*)</label>
                    <input  class="form-control" id="inputEmail4">
                </div>
                <div class="form-group col-md-4">
                    <label for="inputPassword4">Ngày sinh (*)</label>
                    
                    <div class="input-group mb-2">                        
                        <input type="text" class="form-control" id="datepicker" placeholder="Ngày sinh">
                        <div class="input-group-prepend">
                            <div class="input-group-text"><i class="fas fa-calendar"></i></div>
                        </div>
                    </div>                   
                </div>
                

                <div class="form-group col-md-4">
                    <label for="inputPassword4">Trường học</label>
                    <input type="text" class="form-control" id="schools" autocomplete="on">
                </div>
            </div>
            <h2>Thông tin Phụ huynh</h2>
            <div class="form-row">
                <div class="form-group col-md-4">
                    <label for="inputEmail4">Họ tên phụ huynh(*)</label>
                    <input  class="form-control" id="inputEmail4" name="pname">
                </div>
                <div class="form-group col-md-4">
                    <label for="inputPassword4">Số điện thoại (*)</label>
                    <div class="input-group mb-2">                        
                        <input class="form-control" type="tel" id="phone"name="pphone">
                        <div class="input-group-prepend">
                            <div class="input-group-text"><i class="fas fa-phone"></i></div>
                        </div>
                    </div> 
                </div>
                <div class="form-group col-md-4">
                    <label for="inputPassword4">Email phụ huynh (*)</label>
                    <div class="input-group mb-2">                        
                        <input type="email" class="form-control" name="pemail">
                        <div class="input-group-prepend">
                            <div class="input-group-text">@</div>
                        </div>
                    </div> 
                </div>
            </div>
            <h2>Nguyện vọng đăng ký</h2>
            <div class="form-row">                
                <div class="form-group col-md-3">
                <label for="center">Cơ sở</label>
                    <select id="center" class="form-control" name="center" required>
                        @foreach($centers as $key => $value)
                            <option value="{{ $key }}">{{ $value }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="form-group col-md-3">
                    <label for="grade">Chọn khối</label>
                    <select id="grade" class="form-control" name="center" required>
                        <option value="3">Khối 3</option>
                        <option value="4">Khối 4</option>
                        <option value="5">Khối 5</option>
                        <option value="6">Khối 6</option>
                        <option value="7">Khối 7</option>
                        <option value="8">Khối 8</option>
                        <option value="9">Khối 9</option>
                        <option value="10">Khối 10</option>
                        <option value="11">Khối 11</option>
                        <option value="12">Khối 12</option>
                    </select>
                </div>
                <div class="form-group col-md-3" id = "course">
                    <label for="course">Chọn khóa học</label>
                    
                </div>
                <div class="form-group col-md-3" id = "note">
                    <label for="note">Ghi chú</label>
                    <input type="text" class="form-control" name="note" placeholder="Quý phụ huynh có thêm thắc mắc">
                </div>
            </div>
            
            
            <button type="submit" class="btn btn-primary">Đăng ký</button>
        </form>
    </div>

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="http://code.jquery.com/jquery-1.9.1.js"></script>
    <script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.15/jquery.mask.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js" crossorigin="anonymous"></script>
    
    <script>
        $( document ).ready(function() {
            var schools = {!! json_encode($schools, JSON_HEX_TAG) !!};
            $('#datepicker').datepicker({
                format: "dd/mm/yyyy"
            });
            $( "#schools" ).autocomplete({
                source: schools
            });
            $('#phone').mask('(000)-000-0000');
            $('#grade').change(function () {
            var id = $(this).find(':selected')[0].value;
            console.log(id)
            //alert(id); 
            $.ajax({
                type: 'POST',
                url: '/get/courses',
                data: {
                    "_token": "{{ csrf_token() }}",
                    'grade': id
                },
                success: function (data) {
                    // the next thing you want to do 
                    var $course = $('#course');
                    $course.empty();
                    $("#course").append('<label for="course">Chọn khóa học</label>')
                    if(data.length == 0){
                        $("#course").append('<div> Hiện tại chưa có khóa học nào.</div>')
                    }
                    for (var i = 0; i < data.length; i++) {
                        $('#course').append('<div class="checkbox"> <label><input type="checkbox" value="'+data[i].id+'" name="course">  ' + data[i].name + '</label></div>')
                    }
                }
            });

        });
        });
    </script>
  </body>
</html>