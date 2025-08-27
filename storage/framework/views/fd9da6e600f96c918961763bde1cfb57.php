<?php if (isset($component)) { $__componentOriginal23a33f287873b564aaf305a1526eada4 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal23a33f287873b564aaf305a1526eada4 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.layout','data' => ['styles' => $styles,'footer' => $pdf_footer]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('layout'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['styles' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($styles),'footer' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($pdf_footer)]); ?>
<style>
    table tr th
    {border-bottom: 1px solid #aaa;border-collapse: collapse;}
    table tr td
    {
        line-height:1.4;
    }
    table tr.border_top td
    {border-top: 1px solid #444;border-collapse: collapse;}
    table tr.border_bottom td
    {border-bottom: 1px solid #444;border-collapse: collapse;padding-bottom:0mm;}

    table tr td.right,  table tr th.right {
        text-align: right;
        padding-right: 0px;
    }

    table tr td.center {
        text-align: center;
    }
</style>

    <htmlpageheader name="first_header">
        <div id="recipient">
            <?php echo nl2br($invoice->address); ?>

        </div>

        <div id="infobox-first-page">
        <table>
            <tr>
                <td>
                    Rechnungsdatum:
                </td>
            <td class="right">
                <?php echo e($invoice->issued_on->format('d.m.Y')); ?>

            </td>
            </tr>
            <tr>
                <td>
                    Rechnungsnummer:&nbsp;&nbsp;
                </td>
                <td class="right">
                    <?php echo e($invoice->formated_invoice_number); ?>

                </td>
            </tr>
            <tr>
                <td>
                    Kundennummer:&nbsp;&nbsp;
                </td>
                <td class="right">
                    <?php echo e(number_format($invoice->contact->debtor_number, 0, ',', '.')); ?>

                </td>
            </tr>
            <tr>
                <td>
                    Seite:&nbsp;&nbsp;
                </td>
                <td class="right">
                    {PAGENO}/{nbpg}
                </td>
            </tr>
            <?php if(($invoice->type_id !== 2 && $invoice->type_id !== 4) && $invoice->service_period_begin && $invoice->service_period_end): ?>
            <tr>
                <td colspan="2">
                    <br>Leistungszeitraum:&nbsp;&nbsp;
                </td>

            </tr>
            <tr>
                <td colspan="2">
                    <?php echo e($invoice->service_period_begin->format('d.m.Y')); ?> - <?php echo e($invoice->service_period_end->format('d.m.Y')); ?>

                </td>

            </tr>
            <?php endif; ?>



        </table>
    </div>
    </htmlpageheader>
    <htmlpageheader name="header">
        <div id="infobox">
            <table>
                <tr>
                    <td>
                        Rechnungsdatum:
                    </td>
                    <td class="right">
                        <?php echo e($invoice->issued_on->format('d.m.Y')); ?>

                    </td>
                </tr>
                <tr>
                    <td>
                        Rechnungsnummer:&nbsp;&nbsp;
                    </td>
                    <td class="right">
                        <?php echo e($invoice->formated_invoice_number); ?>

                    </td>
                </tr>

                <tr>
                    <td>
                        Seite:&nbsp;&nbsp;
                    </td>
                    <td class="right">
                        {PAGENO}/{nbpg}
                    </td>
                </tr>
            </table>
        </div>
    </htmlpageheader>

        <?php if($invoice->type): ?>
            <h2><?php echo e($invoice->type->print_name); ?></h2>
        <?php else: ?>
                <h2>Rechnung</h2>
        <?php endif; ?>



        <?php if($invoice->project_id): ?>
        <table border-spacing="0" cellspacing="0">


            <tr>
                <td style="width:30mm;">Projekt: </td>
                <td><strong><?php echo e($invoice->project->name); ?></strong></td>
            </tr>
            <?php if($invoice->project->manager_contact_id): ?>
            <tr>
                <td style="width:30mm;">Ansprechperson: </td>
                <td><strong><?php echo e($invoice->project->manager->full_name); ?></strong></td>
            </tr>
             <?php endif; ?>

        </table>
       <?php endif; ?>

        <table style="vertical-align:top;" border-spacing="0" cellspacing="0">

            <thead>
            <tr>
                <th class="right">Pos.</th>
                <th class="right">Menge</th>
                <th style="text-align:center;"></th>
                <th colspan="2" style="text-align:left;">
                    Dienstleistung/Artikel</th>
                <th class="right">Einzelpreis</th>
                <th class="right">Gesamt</th>
                <th class="center">USt.</th>
            </tr>
            </thead>

        <?php
            $counter = 0;
        ?>
        <?php $__currentLoopData = $invoice->lines; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $line): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <?php if($line->type_id === 0 || $line->type_id === 1 || $line->type_id === 3): ?>
                <?php
                    $counter++;
                ?>
            <?php endif; ?>

            <tr>
                <td colspan="9" style="padding-top:2mm"></td>
            </tr>

            <tr>
                <td class="right">
                    <?php if($line->type_id !== 2): ?>
                        <?php echo e($counter); ?>

                    <?php endif; ?>
                </td>
                <td class="right">
                        <?php if($line->type_id !== 2): ?>
                            <?php echo e(number_format($line->quantity, 2, ',', '.')); ?>

                        <?php endif; ?>
                </td>
                <td style="text-align:center;">
                    <?php if($line->type_id !== 2): ?>
                        <?php echo e($line->unit); ?>

                    <?php endif; ?>
                </td>
                <td colspan="2" style="text-align:left;">
                    <?php echo md(nl2br($line->text)); ?>

                    <?php if($line->service_period_begin): ?>
                        <br/>
                        (<?php echo e($line->service_period_begin->format('d.m.Y')); ?> - <?php echo e($line->service_period_end->format('d.m.Y')); ?>)
                    <?php endif; ?>
               </td>
               <td class="right">
                   <?php if($line->type_id === 3): ?>
                   (<?php echo e(number_format($line->price, 2, ',', '.')); ?>)
                   <?php else: ?>
                       <?php if($line->type_id !== 2): ?>
                       <?php echo e(number_format($line->price, 2, ',', '.')); ?>

                       <?php endif; ?>
                   <?php endif; ?>
               </td>
               <td class="right">
                   <?php if($line->type_id !== 2): ?>
                    <?php echo e(number_format($line->amount, 2, ',', '.')); ?>

                   <?php endif; ?>
               </td>
               <td class="center">
                   <?php if($line->type_id !== 2): ?>
                    (<?php echo e($line->tax_rate_id); ?>)
                   <?php endif; ?>
               </td>
           </tr>
       <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            <tr>
                <td colspan="9" style="padding-top:2mm"></td>
            </tr>
            <?php if($invoice->linked_invoices->count() > 0): ?>
                <tr class="">
                    <td colspan="3" style=""></td>
                    <td colspan="3" style="border-top: 1px solid #aaa;border-bottom: 1px solid #aaa;">
                        Zwischensumme
                    </td>
                    <td style="border-top: 1px solid #aaa;text-align: right;border-bottom: 1px solid #aaa;">

                        <?php echo e(number_format($invoice->lines->sum('amount'), 2, ',', '.')); ?>


                    </td>
                    <td style="text-align:right;border-top: 1px solid #aaa;text-align: center;border-bottom: 1px solid #aaa;">
                        EUR
                    </td>
                </tr>
                <tr>
                    <td colspan="9" style="padding-top:2mm"></td>
                </tr>
                <tr>
                    <td colspan="3">&nbsp;</td>
                    <td colspan="2" style="border-bottom: 1px solid #aaa;">
                        <strong>abzüglich geleisteter Akontozahlungen:</strong>
                    </td>
                    <td colspan="1" class="right" style="border-bottom: 1px solid #aaa;">
                        <strong>USt.</strong>
                    </td>
                    <td colspan="1" class="right" style="border-bottom: 1px solid #aaa;">
                        <strong>Netto</strong>
                    </td >
                    <td style="border-bottom: 1px solid #aaa;" />
                </tr>


                <?php $__currentLoopData = $invoice->linked_invoices; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $line): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <tr>
                        <td colspan="3">&nbsp;</td>
                        <td colspan="2">
                            Rechnung Nr. <?php echo e($line->linked_invoice->formated_invoice_number); ?> vom <?php echo e($line->linked_invoice->issued_on->format('d.m.Y')); ?><br/>
                        </td>
                        <td class="right">
                            (<?php echo e(number_format($line->tax * -1, 2, ',', '.')); ?>)
                        </td>
                        <td class="right">
                            <?php echo e(number_format($line->amount, 2, ',', '.')); ?>

                        </td>
                        <td class="center">EUR</td>
                    </tr>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

            <?php endif; ?>

            <tr style="color: #fff;">


                <td width="8mm">&nbsp;</td>
                <td width="15mm">&nbsp;</td>
                <td width="8mm">&nbsp;</td>
                <td width="35mm">&nbsp;</td>
                <td width="35mm">&nbsp;</td>
                <td width="18mm">&nbsp;</td>
                <td width="21mm">&nbsp;</td>
                <td width="12mm">&nbsp;</td>

            </tr>


            <tr class="">
                <td colspan="4"></td>
                <td colspan="2" style="border-top: 1px solid #aaa;">
                    Nettobetrag
                </td>
                <td style="border-top: 1px solid #aaa;text-align: right;">

                    <?php echo e(number_format($invoice->amount_net, 2, ',', '.')); ?>


                </td>
                <td style="text-align:right;border-top: 1px solid #aaa;text-align: center;">
                    EUR
                </td>
            </tr>

                <?php $__currentLoopData = $taxes; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $tax): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <tr class="">
                        <td colspan="4"></td>

                        <td colspan="2">


                            <?php echo e(number_format($tax['tax_rate']['rate'], 0, ',', '.')); ?>%
                            Umsatzsteuer
                            (<?php echo e($tax['tax_rate']['id']); ?>)
                        </td>

                        <td style="text-align: right;">

                            <?php echo e(number_format($tax['sum'], 2, ',', '.')); ?>


                        </td>

                        <td style="text-align: center;">
                            EUR
                        </td>
                    </tr>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>



            <tr>
                <td colspan="4"></td>
                <td colspan="2" style="border-top: 1px solid #aaa;font-weight: bold;">
                    Rechnungsbetrag (brutto)
                </td>
                <td style="border-top: 1px solid #aaa;text-align: right;font-weight: bold;">

                    <?php echo e(number_format($invoice->amount_gross, 2, ',', '.')); ?>


                </td>
                <td style="text-align:right;border-top: 1px solid #aaa;text-align: center;font-weight: bold;">
                    EUR
                </td>
            </tr>

            <tr class="">
                <td colspan="4"></td>
                <td colspan="2" style="border-bottom: 1px solid #aaa;border-top: 1px solid #aaa;"></td>
                <td style="border-bottom: 1px solid #aaa;border-top: 1px solid #aaa;text-align: right;"></td>
                <td style="border-bottom: 1px solid #aaa;text-align:right;border-top: 1px solid #aaa;text-align: center;"></td>
            </tr>

       </table>

        <?php if($invoice->contact->tax_id && $invoice->contact->tax->invoice_text): ?>
        <p><?php echo e(nl2br($invoice->contact->tax->invoice_text)); ?></p>
        <p>
            USt-IdNr. des Auftraggebers: <?php echo e($invoice->contact->vat_id); ?>

        </p>
       <?php endif; ?>

       <p><strong>
           Der Rechnungsbetrag ist ohne Abzug sofort zahlbar.<br/>
       </strong>
       </p>




       <div style="float: left; width: 2cm;">
           <img src="<?php echo e($invoice->qr_code); ?>" style="width: 1.5cm;">
       </div>
       <div style="float: left;text-align: justify;">
           <p>
           Bitte überweisen Sie den Rechnungsbetrag unter Angabe der Rechnungs- und Kundennummer kurzfristig auf
           unser Konto <strong><?php echo e(iban_to_human_format($bank_account->iban)); ?></strong> bei der <strong><?php echo e($bank_account->bank_name); ?></strong> (<?php echo e($bank_account->bic); ?>).
           </p>
       </div>
    <p>
        Bitte beachten Sie, dass Sie, ohne dass es einer Mahnung bedarf, spätestens in Verzug kommen, wenn Sie Ihre Zahlung nicht innerhalb von 30 Tagen nach Zugang dieser Rechnung leisten (§ 286 Abs. 3 BGB).
    </p>





 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal23a33f287873b564aaf305a1526eada4)): ?>
<?php $attributes = $__attributesOriginal23a33f287873b564aaf305a1526eada4; ?>
<?php unset($__attributesOriginal23a33f287873b564aaf305a1526eada4); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal23a33f287873b564aaf305a1526eada4)): ?>
<?php $component = $__componentOriginal23a33f287873b564aaf305a1526eada4; ?>
<?php unset($__componentOriginal23a33f287873b564aaf305a1526eada4); ?>
<?php endif; ?>
<?php /**PATH /home/dspangenberg/Projects/twiceware.cloud/opsc/resources/views/pdf/invoice/index.blade.php ENDPATH**/ ?>