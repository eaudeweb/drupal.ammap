<div class="drupal_ammap_container">

    <?php if(!empty($data)) { ?>
        <span id="drupal_ammap_slider_value"></span>
        <div id="drupal_ammap_slider"></div>
        <span id="drupal_ammap_slider_min"></span>
        <span id="drupal_ammap_slider_max"></span>
        <div class="drupal_ammap_clear"></div>
        <div id="drupal_ammap"></div>
    <?php } else { ?>
        <div id="drupal_ammap" class="no_map">
            <?php echo $no_data_text; ?>
        </div>
    <?php } ?>
</div>
