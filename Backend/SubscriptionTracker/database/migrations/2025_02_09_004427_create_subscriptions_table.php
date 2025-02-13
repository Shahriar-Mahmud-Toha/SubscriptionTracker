<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('auth_id')->index();
            $table->string('name',255);
            $table->string('seller_info',255)->nullable();
            $table->dateTime('reminder_time')->nullable();
            $table->dateTime('date_of_purchase')->nullable();
            $table->integer('duration')->nullable();
            $table->dateTime('date_of_expiration');
            $table->string('account_info',255)->nullable();
            $table->decimal('price', 16, 2)->nullable();
            $table->string('currency',3)->nullable(); //App level enum
            $table->string('comment',255)->nullable();
            $table->string('file_name',255)->nullable();
            $table->timestamps();

            $table->foreign('auth_id', 'fk_subscriptions_auth_id')->references('id')->on('authentications')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
