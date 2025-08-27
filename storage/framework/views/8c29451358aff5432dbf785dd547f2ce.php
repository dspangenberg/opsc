<htmlpagefooter name="footer">
  <?php if($footer['hide'] === false): ?>
    <table class="pdf-footer">
      <tr>
        <td>{DATE d.m.Y H:i}</td>
        <td class="center">
          <?php if($footer['title']): ?>
            <?php echo e($footer['title']); ?>

          <?php endif; ?>
        </td>
        <td class="right">{PAGENO}/{nbpg}</td>
      </tr>
    </table>
   <?php endif; ?>
</htmlpagefooter>
<?php /**PATH /home/dspangenberg/Projects/twiceware.cloud/opsc/resources/views/components/footer.blade.php ENDPATH**/ ?>