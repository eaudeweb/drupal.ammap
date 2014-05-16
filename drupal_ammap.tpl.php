<?php if(!empty($data)) { ?>
    <div class="drupal_ammap_container">
        <span id="drupal_ammap_slider_value"></span>
        <div id="drupal_ammap_slider"></div>
        <span id="drupal_ammap_slider_min"></span>
        <span id="drupal_ammap_slider_max"></span>
        <div class="drupal_ammap_clear"></div>
        <div id="drupal_ammap"></div>
    </div>
<?php } else { ?>
    <div class="drupal_ammap_no_data">
        <?php echo $no_data_text; ?>
    </div>
<?php } ?>
