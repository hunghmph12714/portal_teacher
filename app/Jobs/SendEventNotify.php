<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Mail;
use App\Mail\EventNotify;
class SendEventNotify implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public $result = [];
    public $to_email = '';
    public $to_name = '';
    public function __construct($result, $to_email, $to_name)
    {
        //
        $this->result = $result;
        $this->to_email = $to_email;
        $this->to_name = $to_name;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $d = ['result' => $this->result];
        $result = $this->result;
        $to_name = $this->to_name;
        $to_email = $this->to_email;
        
        $email = new EventNotify();
        $mail = "thithu@vietelite.edu.vn";
        $password = "Boc24038";
        $backup = Mail::getSwiftMailer();
        // Setup your outlook mailer
        $transport = new \Swift_SmtpTransport('smtp-mail.outlook.com', 587, 'tls');
        $transport->setUsername($mail);
        $transport->setPassword($password);
        // Any other mailer configuration stuff needed...
        
        $outlook = new \Swift_Mailer($transport);

        // Set the mailer as gmail
        Mail::setSwiftMailer($outlook);

        Mail::send('emails.events.confirm-form',$d, function($message) use ($to_name, $to_email, $result, $mail) {
            $message->to($to_email, $to_name)
                    ->to('webmaster@vietelite.edu.vn')
                    ->subject($result['student']['name']. " - Xác nhận đăng ký " .$result['event']['name'] )
                    ->replyTo($mail, 'Phụ huynh hs '.$result['student']['name']);
            $message->from($mail,'VIETELITE EDUCATION CENTER');
        });

        // Restore your original mailer
        Mail::setSwiftMailer($backup);
    }
}
