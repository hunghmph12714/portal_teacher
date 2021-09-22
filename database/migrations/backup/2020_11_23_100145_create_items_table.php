<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('event_items', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('events');
            $table->string('major'); // Toán chuyên
            $table->smallInteger('grade');// 5, 9
            $table->datetime('time');// 12/01/2021
            $table->smallInteger('duration'); //180m
            $table->string('note'); // ??
            $table->integer('fee');// 200000
            $table->integer('center_id'); //1,2,3,4,5
            $table->text('location'); //23 lo 14 a ... (default = center location)
            $table->string('documents'); // upload
            $table->json('stats');
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
        Schema::dropIfExists('event_items');
    }
}
