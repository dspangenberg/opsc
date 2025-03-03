<?php

namespace App\Http\Controllers\App\Accommodation;

use App\Http\Controllers\Controller;
use App\Models\Accommodation;
use App\Models\AccommodationType;
use App\Models\Country;
use App\Models\Region;
use Inertia\Inertia;

class AccommodationCreateController extends Controller
{
    public function __invoke()
    {

        $accommodation = new Accommodation();
        $accommodation->name = tenant('company_house_name');
        $accommodation->website = tenant('website');
        $accommodation->email = tenant('email');

        return Inertia::render('App/Accommodation/CreateAccommodation', [
            'accommodation' => $accommodation,
            'countries' => Country::all(),
            'regions' => Region::all(),
            'types' => AccommodationType::all(),
        ]);

    }
}
