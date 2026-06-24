<?php

namespace App\Providers;

use App\Models\NumberRangeDocumentNumber;
use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use DateTime;
use DateTimeImmutable;
use Spatie\LaravelTypeScriptTransformer\TypeScriptTransformerApplicationServiceProvider as BaseTypeScriptTransformerServiceProvider;
use Spatie\TypeScriptTransformer\Formatters\PrettierFormatter;
use Spatie\TypeScriptTransformer\Transformers\AttributedClassTransformer;
use Spatie\TypeScriptTransformer\Transformers\EnumTransformer;
use Spatie\TypeScriptTransformer\TypeScriptNodes\TypeScriptUnknown;
use Spatie\TypeScriptTransformer\TypeScriptTransformerConfigFactory;
use Spatie\TypeScriptTransformer\Writers\GlobalNamespaceWriter;

class TypeScriptTransformerServiceProvider extends BaseTypeScriptTransformerServiceProvider
{
    protected function configure(TypeScriptTransformerConfigFactory $config): void
    {
        $config
            ->transformer(AttributedClassTransformer::class)
            ->transformer(EnumTransformer::class)
            ->replaceType(DateTime::class, 'string')
            ->replaceType(DateTimeImmutable::class, 'string')
            ->replaceType(Carbon::class, 'string')
            ->replaceType(CarbonImmutable::class, 'string')
            ->replaceType(CarbonInterface::class, 'string')
            ->replaceType(NumberRangeDocumentNumber::class, new TypeScriptUnknown)
            ->transformDirectories(app_path())
            ->outputDirectory(resource_path())
            ->writer(new GlobalNamespaceWriter('js/Types/generated.d.ts'))
            ->formatter(PrettierFormatter::class);
    }
}
