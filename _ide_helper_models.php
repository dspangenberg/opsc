<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * 
 *
 * @method static Builder<static>|Accommodation newModelQuery()
 * @method static Builder<static>|Accommodation newQuery()
 * @method static Builder<static>|Accommodation onlyTrashed()
 * @method static Builder<static>|Accommodation query()
 * @method static Builder<static>|Accommodation withTrashed()
 * @method static Builder<static>|Accommodation withoutTrashed()
 * @mixin Eloquent
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperAccommodation {}
}

namespace App\Models{
/**
 * 
 *
 * @method static Builder|AccommodationType newModelQuery()
 * @method static Builder|AccommodationType newQuery()
 * @method static Builder|AccommodationType query()
 * @mixin Eloquent
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperAccommodationType {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string $iso_code
 * @property string $vehicle_code
 * @property string $country_code
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Country newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Country newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Country query()
 * @method static \Illuminate\Database\Eloquent\Builder|Country whereCountryCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Country whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Country whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Country whereIsoCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Country whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Country whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Country whereVehicleCode($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperCountry {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string $iso_code
 * @property string $vehicle_code
 * @property string $country_code
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method static Builder|Country newModelQuery()
 * @method static Builder|Country newQuery()
 * @method static Builder|Country query()
 * @method static Builder|Country whereCountryCode($value)
 * @method static Builder|Country whereCreatedAt($value)
 * @method static Builder|Country whereId($value)
 * @method static Builder|Country whereIsoCode($value)
 * @method static Builder|Country whereName($value)
 * @method static Builder|Country whereUpdatedAt($value)
 * @method static Builder|Country whereVehicleCode($value)
 * @mixin Eloquent
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperRegion {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string $gender
 * @property int $is_hidden
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Salutation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Salutation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Salutation query()
 * @method static \Illuminate\Database\Eloquent\Builder|Salutation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Salutation whereGender($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Salutation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Salutation whereIsHidden($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Salutation whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Salutation whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperSalutation {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $parent_type
 * @property string $parent_id
 * @property array $data
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string $hid
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TempData newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TempData newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TempData query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TempData whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TempData whereData($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TempData whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TempData whereParentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TempData whereParentType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TempData whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperTempData {}
}

namespace App\Models{
/**
 * 
 *
 * @property string $id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property array|null $data
 * @property string $last_name
 * @property string $first_name
 * @property string $company_house_name
 * @property string|null $address
 * @property string $zip
 * @property string $city
 * @property int|null $country_id
 * @property int|null $salutation_id
 * @property int|null $title_id
 * @property string|null $website
 * @property string|null $subdomain
 * @property string|null $email
 * @property int|null $otp
 * @property string|null $email_verified_at
 * @property string|null $setuped
 * @property int $is_suspended
 * @property string|null $note
 * @property-read Collection<int, Domain> $domains
 * @property-read int|null $domains_count
 * @property-read string $full_name
 * @property-read string $initials
 * @property-read string $reverse_full_name
 * @method static TenantCollection<int, static> all($columns = ['*'])
 * @method static Builder<static>|Tenant findSimilarSlugs(string $attribute, array $config, string $slug)
 * @method static TenantCollection<int, static> get($columns = ['*'])
 * @method static Builder<static>|Tenant newModelQuery()
 * @method static Builder<static>|Tenant newQuery()
 * @method static Builder<static>|Tenant query()
 * @method static Builder<static>|Tenant whereAddress($value)
 * @method static Builder<static>|Tenant whereCity($value)
 * @method static Builder<static>|Tenant whereCompanyHouseName($value)
 * @method static Builder<static>|Tenant whereCountryId($value)
 * @method static Builder<static>|Tenant whereCreatedAt($value)
 * @method static Builder<static>|Tenant whereData($value)
 * @method static Builder<static>|Tenant whereEmail($value)
 * @method static Builder<static>|Tenant whereEmailVerifiedAt($value)
 * @method static Builder<static>|Tenant whereFirstName($value)
 * @method static Builder<static>|Tenant whereId($value)
 * @method static Builder<static>|Tenant whereIsSuspended($value)
 * @method static Builder<static>|Tenant whereLastName($value)
 * @method static Builder<static>|Tenant whereNote($value)
 * @method static Builder<static>|Tenant whereOtp($value)
 * @method static Builder<static>|Tenant whereSalutationId($value)
 * @method static Builder<static>|Tenant whereSetuped($value)
 * @method static Builder<static>|Tenant whereSubdomain($value)
 * @method static Builder<static>|Tenant whereTitleId($value)
 * @method static Builder<static>|Tenant whereUpdatedAt($value)
 * @method static Builder<static>|Tenant whereWebsite($value)
 * @method static Builder<static>|Tenant whereZip($value)
 * @method static Builder<static>|Tenant withUniqueSlugConstraints(Model $model, string $attribute, array $config, string $slug)
 * @mixin Eloquent
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperTenant {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string $correspondence_salutation_male
 * @property string $correspondence_salutation_female
 * @property string $correspondence_salutation_other
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Title newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Title newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Title query()
 * @method static \Illuminate\Database\Eloquent\Builder|Title whereCorrespondenceSalutationFemale($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Title whereCorrespondenceSalutationMale($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Title whereCorrespondenceSalutationOther($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Title whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Title whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Title whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Title whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperTitle {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property int|null $current_team_id
 * @property string|null $profile_photo_path
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read DatabaseNotificationCollection<int, DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @method static UserFactory factory($count = null, $state = [])
 * @method static Builder<static>|User newModelQuery()
 * @method static Builder<static>|User newQuery()
 * @method static Builder<static>|User query()
 * @method static Builder<static>|User whereCreatedAt($value)
 * @method static Builder<static>|User whereCurrentTeamId($value)
 * @method static Builder<static>|User whereEmail($value)
 * @method static Builder<static>|User whereEmailVerifiedAt($value)
 * @method static Builder<static>|User whereId($value)
 * @method static Builder<static>|User whereName($value)
 * @method static Builder<static>|User wherePassword($value)
 * @method static Builder<static>|User whereProfilePhotoPath($value)
 * @method static Builder<static>|User whereRememberToken($value)
 * @method static Builder<static>|User whereUpdatedAt($value)
 * @property-read string $full_name
 * @property-read string $initials
 * @property-read string $reverse_full_name
 * @mixin Eloquent
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperUser {}
}

