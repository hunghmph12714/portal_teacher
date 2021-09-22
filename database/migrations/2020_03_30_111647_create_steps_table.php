<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStepsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('steps', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->smallInteger('order');
            $table->string('name');
            $table->smallInteger('duration')->default(1);
            $table->enum('type',['Quy trình đầu vào','Quy trình kiểm tra/thi thử',
                'Quy trình tuyển dụng','Quy trình hoàn trả học phí','Quy trình học bù/ phụ đạo']);
            $table->string('document')->nullable();
            $table->integer('user_created');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('steps');
    }
}
