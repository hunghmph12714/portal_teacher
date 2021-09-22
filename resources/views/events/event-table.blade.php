<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

<style>
    .table .header{
        background:  #8bc34a;
    }
    .table .header td{
        text-transform: uppercase;
        color: white;
        font-weight: bold;
    }
    .table td{
        text-align: center;
        border: 1px solid green;
    }
</style>
<table class="table table-bordered">
  <tbody>
    @foreach($result as $date => $r)
        <tr class="header">
            <td scope="row" colspan="2">{{$date}}</td>
            <td>HÌNH THỨC THI</td>
        </tr>
        @foreach($r as $p)
            <tr>                
                <td>{{$p['time']}}</td>
                <td>{{$p['name']}}</td>
                <td>{{$p['note']}}</td>
            </tr>
        @endforeach
    @endforeach
    
  </tbody>
</table>