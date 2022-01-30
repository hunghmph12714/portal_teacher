<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '566336567649816');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=566336567649816&ev=PageView&noscript=1"
/></noscript>
<!-- End Facebook Pixel Code -->
<noscript>
  <img height="1" width="1" style="display:none" 
       src="https://www.facebook.com/tr?id={your-pixel-id-goes-here}&ev=PageView&noscript=1"/>
</noscript>
<!-- End Facebook Pixel Code -->
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css">
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous">

    <style>
    .ui-autocomplete {
        overflow: auto;
        height: 300px;
    }
    label{
        font-weight: bold;
    }
    h1{
        font-size: 32px;
        color: #6ebe45;
        margin-bottom: 40px;
        font-weight: 500;
    }
    h2{
        background-color: #6EBE45;
        color: #fff;
        padding: 5px 10px 5px 10px !important;
        font-weight: 700;
        font-size: 1.25em;
    }
    h4{
        font-size: 1rem;
        font-weight: bold;
    }
    .domain{
        margin-right: 15px;
    }
    #course{
        padding: 15px;
    }
    h5{
        background: #6EBE45;
        padding: 5px;
        color: white;
    }
    .btn-vee{
        background: linear-gradient(90deg, rgba(117,186,100,1) 0%, rgba(25,165,124,1) 54%, rgba(0,158,139,1) 100%);
        font-size: 19px;
        padding: 10px 54px;
        font-weight: 500;
        font-weight: bold;
        text-transform: uppercase;
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
                    <input  class="form-control" id="inputEmail4" name="sname" required>
                </div>
                <div class="form-group col-md-4">
                    <label for="inputPassword4">Ngày sinh (*)</label>
                    
                    <div class="input-group mb-2">                        
                        <input type="text" class="form-control" id="datepicker" placeholder="Ngày sinh" name="dob" required>
                        <div class="input-group-prepend">
                            <div class="input-group-text"><i class="fas fa-calendar"></i></div>
                        </div>
                    </div>                   
                </div>
                

                <div class="form-group col-md-4">
                    <label for="inputPassword4">Trường học</label>
                    <input type="text" class="form-control" id="schools" autocomplete="on" name="school">
                </div>
            </div>
            <h2>Thông tin Phụ huynh</h2>
            <div class="form-row">
                <div class="form-group col-md-4">
                    <label for="inputEmail4">Họ tên phụ huynh(*)</label>
                    <input  class="form-control" id="inputEmail4" name="pname" required>
                </div>
                <div class="form-group col-md-4">
                    <label for="inputPassword4">Số điện thoại (*)</label>
                    <div class="input-group mb-2">                        
                        <input class="form-control" type="tel" id="phone"name="pphone" required>
                        <div class="input-group-prepend">
                            <div class="input-group-text"><i class="fas fa-phone"></i></div>
                        </div>
                    </div> 
                </div>
                <div class="form-group col-md-4">
                    <label for="inputPassword4">Email phụ huynh (*)</label>
                    <div class="input-group mb-2">                        
                        <input type="email" class="form-control" name="pemail" required>
                        <div class="input-group-prepend">
                            <div class="input-group-text">@</div>
                        </div>
                    </div> 
                </div>
            </div>
            <h2>Nguyện vọng đăng ký</h2>
            <div class="form-row">                
                <div class="form-group col-md-4">
                <label for="center">Cơ sở</label>
                    <Select className = "select-box" id="center" class="form-control" name="center" required>
                        <option value="" hidden selected>Chọn cơ sở đăng ký</option>
                        @foreach($centers as $key => $value)
                            <option value="{{ $value['id'] }}">{{ $value['name'] }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="form-group col-md-4">
                    <label for="grade">Chọn khối</label>
                    <select className = "select-box" id="grade" class="form-control" name="grade" required value={{$selected_grade}}>
                        <option value=""  hidden {{ $selected_grade === "" ? "selected" : "" }}>Chọn khối lớp</option>
                        <option value="3" {{ $selected_grade === "3" ? "selected" : "" }}>Khối 3</option>
                        <option value="4" {{ $selected_grade === "4" ? "selected" : "" }}>Khối 4</option>
                        <option value="5" {{ $selected_grade === "5" ? "selected" : "" }}>Khối 5</option>
                        <option value="6" {{ $selected_grade === "6" ? "selected" : "" }}>Khối 6</option>
                        <option value="7" {{ $selected_grade === "7" ? "selected" : "" }}>Khối 7</option>
                        <option value="8" {{ $selected_grade === "8" ? "selected" : "" }}>Khối 8</option>
                        <option value="9" {{ $selected_grade === "9" ? "selected" : "" }}>Khối 9</option>
                        <option value="10" {{ $selected_grade === "10" ? "selected" : "" }}>Khối 10</option>
                        <option value="11" {{ $selected_grade === "11" ? "selected" : "" }}>Khối 11</option>
                        <option value="12" {{ $selected_grade === "12" ? "selected" : "" }}>Khối 12</option>
                    </select>
                </div>
                <div class="form-group col-md-4" id = "note">
                    <label for="note">Ghi chú</label>
                    <textarea rows="2" class="form-control" name="note" placeholder="Quý phụ huynh có thêm thắc mắc cần tư vấn, vui lòng để lại lời nhắn"></textarea>
                </div>                
                <input type="hidden" name="url" id= "url"> 
            </div>
            
            <h4>Chọn khóa học</h4>
            <div class="form-group row" id = "course">
                
                
            </div>
            
            <button type="submit" class="btn btn-primary btn-vee">Đăng ký ngay</button>
        </form>
    </div>

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-1.9.1.js"></script>
    <script src="https://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.15/jquery.mask.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js" crossorigin="anonymous"></script>
    
    <script>
        function getCourses(id){
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
                    if(data.length == 0){
                        $("#course").append('<div> Hiện tại chưa có khóa học nào.</div>')
                    }
                    
                    // console.log(data)
                    for (const [key, value] of Object.entries(data)) {
                        k = key.replace(' ', '');
                        $('#course').append('<div class="domain" id="'+k+'"><h5 class="domain_h5"> '+key+'</h5></div>')
                        for (var i = 0; i < value.length; i++) {
                            $('#'+k).append('<div class="checkbox"> <label><input type="checkbox" value="'+value[i].id+'" name="course[]">  ' + value[i].name + '</label></div>')
                            
                        }
                    }
                }
            });
        }
        $( document ).ready(function() {
            $('#url').val(document.referrer)
            console.log(document.referrer)
            let grade = $('#grade').find(':selected')[0].value;
            if(grade !== ""){
                getCourses(grade)
            }
            var schools = {!! json_encode($schools, JSON_HEX_TAG) !!};
            $('#datepicker').datepicker({
                format: "dd/mm/yyyy"
            });
            $( "#schools" ).autocomplete({
                source: schools
            });
            $('#phone').mask('(000)-000-0000');
            $('#grade').change(function(){
                var id = $(this).find(':selected')[0].value;
                getCourses(id)
            });
        });
    </script>
  </body>
</html>
