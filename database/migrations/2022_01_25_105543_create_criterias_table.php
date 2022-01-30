<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCriteriasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lms_criterias', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('attempt_id')->nullable();
            $table->enum('domain', ['Toán', 'Tiếng Việt', 'Tiếng Anh', 'Lý', 'Hóa'])->nullable();
            $table->longText('content')->nullable();
            $table->text('title')->nullable();
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
        Schema::dropIfExists('lms_criterias');
    }
}
