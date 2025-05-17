<?php

namespace Tests\Feature\App\Setting\Booking;

use App\Data\SeasonData;
use App\Models\Season;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SeasonCreateControllerTest extends TestCase
{
    /** @test */
    public function it_returns_inertia_modal_with_empty_season_data()
    {
        $response = $this->get(route('app.settings.booking.seasons.create'));

        $response->assertStatus(200);

        $response->assertInertia(function (Assert $assert) {
            $assert->component('App/Settings/Booking/Season/SeasonEdit')
                ->has('season', function (Assert $assert) {
                    $assert->where('id', null)
                        ->etc();
                });
        });
    }

    /** @test */
    public function it_sets_correct_base_route()
    {
        $response = $this->get(route('app.settings.booking.seasons.create'));

        $response->assertStatus(200);

        $response->assertInertia(function (Assert $assert) {
            $assert->where('baseRoute', 'app.settings.booking.seasons');
        });
    }

    /** @test */
    public function season_data_matches_empty_season_model()
    {
        $response = $this->get(route('app.settings.booking.seasons.create'));

        $response->assertStatus(200);

        $response->assertInertia(function (Assert $assert) {
            $assert->has('season', function (Assert $assert) {
                $emptySeasonData = SeasonData::from(new Season);
                foreach ($emptySeasonData->toArray() as $key => $value) {
                    $assert->where($key, $value);
                }
            });
        });
    }
}
