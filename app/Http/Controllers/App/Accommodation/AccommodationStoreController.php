<?php

namespace App\Http\Controllers\App\Accommodation;

use App\Http\Controllers\Controller;
use App\Http\Requests\AccommodationStoreRequest;
use App\Models\Accommodation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use MatanYadaev\EloquentSpatial\Objects\Point;

class AccommodationStoreController extends Controller
{
    public function __invoke(AccommodationStoreRequest $request): RedirectResponse
    {
        $collection = collect($request->validated());

        $latitude = $collection->get('latitude');
        $longitude = $collection->get('longitude');

        $data = $collection->forget(
            ['latitude', 'longitude']
        )->toArray();

        $data['coordinates'] = new Point($latitude, $longitude);

        Accommodation::create($data);
        return Redirect::route('app.dashboard');
    }
}
