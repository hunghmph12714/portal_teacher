<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
// use Illuminate\Support\Facades\Mail;
use Mail;

class NotifyEntrance extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:notify_entrance';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'notify entrances';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $data = [
            'name' => 'hà mạnh hùng',
        ];
        //    Mail::send()   
        Mail::send('emails.entrance.notify_entrance', $data, function ($message) {
            $message->from('info@vietelite.edu.vn', 'Vi etElite');
            // $message->sender('john@johndoe.com', 'VietElite');
            $message->to('manhhung1762001@gmail.com', 'VietElite');
            $message->subject('Xác nhận thông tin bài thi ');
        });
    }
}