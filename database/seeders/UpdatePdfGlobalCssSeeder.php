<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Settings\GeneralSettings;
use Illuminate\Database\Seeder;

class UpdatePdfGlobalCssSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultCss = <<<'CSS'
body {
  line-height:1.4;
  font-size: 10pt;
  font-family: facit, serif;
  hyphens: auto;
}

.page-break {
  page-break-before: always;
}

#pagenumbers {
  content: counter(page) " / " counter(pages);
}

.page-number::before {
  content: counter(page);
}

.total-pages::before {
  content: counter(pages);
}

#footer-left {
  position: running(footer-left);
  bottom: 0;
}

#footer-center {
  position: running(footer-center);
  bottom: 0;
}

#footer-right {
  position: running(footer-right);
  bottom: 0;
}

h1 {
  font-size: 14pt;
  margin-top: 8mm;
  margin-bottom: 4mm;
}

h2 {
  font-size: 13pt;
  margin-top: 6mm;
  margin-bottom: 3mm;
}

h3 {
  font-size: 12pt;
  margin-top: 4mm;
  margin-bottom: 2mm;
}

h4, h5, h6 {
  margin-top: 3mm;
  margin-bottom: 2mm;
  font-weight: 600;
}

h4 {
  font-size: 11pt;
}

h5 {
  font-size: 10pt;
}

p {
  text-align: justify;
}

p, table tr td p {
  margin: 0;
  padding:0;
  text-align: justify;
  line-height: 1.5;
  font-size: 10pt;
  hyphens: auto;
  margin-bottom: 3mm;
}

ul {
  list-style-type: disc;
  list-style-position: outside;
  padding-left: 3mm;
  margin: 0 0 3mm 0;
}

ul li {
  line-height: 1.5;
  margin-left: 0;
  padding-left: 0;
  text-align: left;
}

ul li ul {
  padding-left: 5mm;
  margin-left: 0;
}

a {
  color: #0b5ed7;
}

table {
  font-size: 10pt;
  width: 100%;
  padding: 0;
  margin: 0 0 5mm;
  page-break-inside: initial;
  margin-bottom: 5mm;
  border-collapse: collapse;
}

table tr th {
  border-bottom: 1px solid #aaa;
  border-collapse: collapse;
}

table tr td {
  line-height: 1.4;
  vertical-align: baseline;
}

table tr td.center {
  text-align: center !important;
}

table tr td.mdx-cell p {
  padding: 0;
  margin: 0;
}

table tr.border_top td {
  border-top: 1px solid #444;
  border-collapse: collapse;
}

table tr.border_bottom td {
  border-bottom: 1px solid #444;
  border-collapse: collapse;
  padding-bottom: 0;
}

table tr td.right, table tr th.right {
  text-align: right;
  padding-right: 0;
}

table tr td.left, table tr th.left {
  text-align: left;
}

th.center, td.center {
  text-align: center;
}

td.mdx-cell p {
  padding: 0;
  margin: 0;
  text-align: justify;
}

td.mdx-cell ul {
  padding-left: 3mm;
  margin: 0 0 3mm 0;
}

td.mdx-cell ul li {
  text-align: left;
}

td.mdx-cell ul li ul {
  padding-left: 5mm;
  margin-left: 0;
}

table.info-table {
  width: 100%;
}

table.info-table tr td {
  hyphens: none;
  white-space: nowrap;
}
CSS;

        Tenant::chunkById(100, function ($tenants) use ($defaultCss) {
            foreach ($tenants as $tenant) {
                $tenant->run(function () use ($tenant, $defaultCss) {
                    $settings = app(GeneralSettings::class);
                    $settings->pdf_global_css = $defaultCss;
                    $settings->save();

                    $this->command->info("Updated PDF CSS for tenant: {$tenant->organisation}");
                });
            }
        });
    }
}
