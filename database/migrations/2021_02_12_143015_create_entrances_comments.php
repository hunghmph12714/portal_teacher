<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEntrancesComments extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('entrance_comments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('entrance_id');
            $table->text('content');
            $table->smallInteger('user_id');
            $table->enum('method', ['sms','phone','email','inbox','direct','other']);
            $table->smallInteger('step_id');
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
        Schema::dropIfExists('entrance_comments');
    }
}
