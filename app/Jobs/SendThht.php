<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Mail;

class SendThht implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public $datas = [];
    public $to_email = '';
    public $to_name = '';
    public $mail = '';
    public $password = '';
    public $to_email_2 = '';
    public function __construct($result, $to_email, $to_name, $mail, $password, $to_email_2)
    {
        
        $this->datas = $result;
        $this->to_email = $to_email;
        $this->to_name = $to_name;
        $this->mail = $mail;
        $this->password = $password;
        $this->$to_email_2 = $to_email_2;
        
    }


    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        //
        $datas = $this->datas;
        $d = ['datas'=> $datas];
        $to_name = $this->to_name;
        $to_email = $this->to_email;
        $mail = $this->mail; $password = $this->password;
        $to_email_2 = $this->to_email_2;
        $session_type = $datas['session_type'];
        $session_month = $datas['session_month'];

        $backup = Mail::getSwiftMailer();

            // Setup your outlook mailer
        $transport = new \Swift_SmtpTransport('smtp-mail.outlook.com', 587, 'tls');
        $transport->setUsername($mail);
        $transport->setPassword($password);
        // Any other mailer configuration stuff needed...
        
        $outlook = new \Swift_Mailer($transport);
        print_r($password);
        // Set the mailer as gmail
        Mail::setSwiftMailer($outlook);    
        // print_r($datas);
        if($session_type == "exam"){
            Mail::send('emails.ktdk', $d, function($message) use ($to_name, $to_email, $datas, $mail, $session_month, $to_email_2) {
                $message->to($to_email, $to_name)
                        ->to('webmaster@vietelite.edu.vn')
                        ->subject('[VIETELITE]Kết quả Kiểm tra định kỳ tháng '.$session_month ." của con " . $datas[0]['student']->fullname . ' lớp '. $datas[0]['class'])
                        ->replyTo($datas[0]['center']->email, '[KTDK] Phụ huynh hs '.$datas[0]['student']->fullname);
                $message->from($mail,'VIETELITE EDUCATION CENTER');
            });
        }
        else{
            Mail::send('emails.thht', $d, function($message) use ($to_name, $to_email, $datas, $mail, $to_email_2) {
                $message->to($to_email, $to_name)                            
                        ->to('webmaster@vietelite.edu.vn')
                        ->subject('[VIETELITE]Tình hình học tập buổi '. date('d/m', strtotime($datas[0]['session']->date)) .' lớp '. $datas[0]['class'])
                        ->replyTo($datas[0]['center']->email, 'Phụ huynh hs '.$datas[0]['student']->fullname);
                if($to_email_2){
                    $message->to($to_email_2, $to_name)                            
                        ->subject('[VIETELITE]Tình hình học tập buổi '. date('d/m', strtotime($datas[0]['session']->date)) .' lớp '. $datas[0]['class'])
                        ->replyTo($datas[0]['center']->email, 'Phụ huynh hs '.$datas[0]['student']->fullname);
                }
                $message->from($mail,'VIETELITE EDUCATION CENTER');
            });
        }
        Mail::setSwiftMailer($backup);
    }
}
