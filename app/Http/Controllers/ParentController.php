<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Parents;
use Mautic\MauticApi;
use Mautic\Auth\ApiAuth;

class ParentController extends Controller
{
    //
    protected function findParent($key)
    {
        $s = Parents::where('parents.phone', 'LIKE', '%' . $key . '%')->select(
            'parents.id as pid',
            'parents.fullname',
            'parents.phone',
            'parents.email',
            'parents.note',
            'parents.alt_fullname',
            'parents.alt_email',
            'parents.alt_phone',
            'relationships.id as rid',
            'relationships.name as r_name',
            'relationships.color'
        )
            ->leftJoin('relationships', 'parents.relationship_id', 'relationships.id')->limit(10)->get()->toArray();
        return response()->json($s);
    }
    protected function testMautic()
    {
        $settings = array(
            'baseUrl'      => 'https://mautic.vietelite.edu.vn',
            'version'      => 'OAuth2',
            'clientKey'    => '1_68dufgi6rnk0wkgog8w8gck0ok8sockwkcs0gokc8wwcog0o8o',
            'clientSecret' => '5sokei5g72g40ook8wksck4swggccw8w8kswso0okocw4so0o4',
        );
        $initAuth   = new ApiAuth();
        $auth       = $initAuth->newAuth($settings);
        $apiUrl     = "https://mautic.vietelite.edu.vn";
        $api        = new MauticApi();
        $contactApi = $api->newApi("contacts", $auth, $apiUrl);

        $data = array(
            'firstname' => 'Jim',
            'lastname'  => 'Contact',
            'email'     => 'jim@his-site.com',
            'ipAddress' => $_SERVER['REMOTE_ADDR'],
            'overwriteWithBlank' => true,
        );

        $contact = $contactApi->create($data);

        dd($contact);
    }
    public function loginByAdminCenter($id)
    {
        $parent = Parents::find($id);
        if (!$parent) {
            return back();
        }
        // $phone = $parent->phone;

        if ($parent->master_password == null) {
            $rand = random_int(1000, 9999);
            $parent->master_password = $rand;
            $parent->save();
            $master_password = $parent->master_password;
        } else {
            $master_password = $parent->master_password;
        }
        // dd($master_password);
        $master_password = $parent->master_password;

        return  redirect(url('https://portal.vietelite.edu.vn/login-admin/' . $id . '/' . $master_password));
    }
}