<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Search</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous">
</script>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.js"></script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>
</head>

<body>
    <form action="" method="post">
@csrf
        <div class="form-group">
            <label for="">Chọn người dùng</label>
            <select class="form-control" name="user[]" id="select_user" multiple>
              @foreach ($users as $u)
              <option value="{{ $u->id }}">{{ $u->name }}</option>
              @endforeach

            </select>
        </div>

        <div class="form-group">
            <label for="">Bắt đầu</label>
            <input type="date" class="form-control" name="from" id="" aria-describedby="helpId" placeholder="">
            {{-- <small id="helpId" class="form-text text-muted">Help text</small> --}}
        </div>
        <div class="form-group">
            <label for="">Bắt đầu</label>
            <input type="date" class="form-control" name="to" id="" aria-describedby="helpId" placeholder="">
            {{-- <small id="helpId" class="form-text text-muted">Help text</small> --}}
        </div>
        <button type="submit" name="" id="" class="btn btn-primary btn-lg btn-block">Thống kê</button>
    </form>
    <script type="text/javascript">
        $('#select_user').select2(  );
    </script>
</body>

</html>