<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentClassTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
    
        Schema::create('student_class', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('student_id');
            $table->integer('class_id');
            $table->date('entrance_date');
            $table->enum('status',['active','droped','retain']);
            $table->timestamps();
        });
    }

    /**
     * int main acint ;dij
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('student_class', function (Blueprint $table) {
            //
        });
    }
}
