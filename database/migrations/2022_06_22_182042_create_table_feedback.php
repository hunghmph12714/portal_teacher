<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableFeedback extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->text('title')->nullable();
            $table->longText('description')->nullable();
            $table->string('upload')->nullable();
            $table->integer('user_id')->nullable();
            $table->longText('result')->nullable();
            $table->smallInteger('status')->comment('1: đang xử lý; 2: đã xử lý; 3: trùng')->nullable();
            $table->integer('feedack_id')->nullable();
            $table->string('phone')->nullable();
            $table->smallInteger('type')->comment('1: báo lỗi; 2: góp ý')->nullable();
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
        Schema::dropIfExists('feedbacks');
    }
}