/**
 * Created by dragos on 2/6/14.
 */
var drupal_ammap;
AmCharts.ready(function() {
    // create AmMap object
     drupal_ammap = new AmCharts.AmMap();

    // set path to images
    drupal_ammap.pathToImages = Drupal.settings.drupal_ammap.ammapPath + '/images/';

    var rollOverOutlineColor = '#555555';
    var selectedColor = '#555555';

    // Add countries data to Area Obj
    var areas = drupal_ammap_parse_areas(Drupal.settings.drupal_ammap.ammapData);

    var amdataProvider = {
        mapVar: AmCharts.maps.worldHigh,
        areas: areas
    };

    // pass data provider to the map object
    drupal_ammap.dataProvider = amdataProvider;

    drupal_ammap.areasSettings = {
        autoZoom: true,
        selectedColor: selectedColor,
        //unlistedAreasColor: "#DDDDDD",
        //rollOverColor: "#CC0000",
        rollOverOutlineColor: rollOverOutlineColor,
        balloonText: "<strong>[[title]]</strong><br/>[[customData]]",
        showDescriptionOnHover: "true"
    };

    /*Enlarge the title balloon*/
    drupal_ammap.balloon.fontSize = '14px';
    drupal_ammap.balloon.fillAlpha = '0.9';

    /*Change zoom control colors*/
    drupal_ammap.zoomControl.buttonFillColor = "rgb(102, 135, 168)";
    drupal_ammap.zoomControl.buttonRollOverColor= "rgb(102, 135, 168)";

    if ( typeof Drupal.settings.drupal_ammap.settings.legend != 'undefined' && Drupal.settings.drupal_ammap.settings.legend == true  ) {
        var legend = drupal_ammap_parse_legend(Drupal.settings.drupal_ammap.legend);
        // write the map to container div
        drupal_ammap.addLegend(legend);
    }

    drupal_ammap.write("drupal_ammap");
});

/**
 * Function to construct the areas objects for ammap
 * @param data_areas
 * @returns {Array}
 */
function drupal_ammap_parse_areas(data_areas) {
    // Add countries data to Area Obj
    var areas = new Array();
    jQuery.each(data_areas, function(index, area){
        areas.push(
            {
                id: area.iso2.toUpperCase(),
                color: area.color,
                title: (typeof area.title == 'undefined' || area.title == '') ? "" : area.title ,
                customData: (typeof area.customData == 'undefined' || area.customData == '') ? "" : area.customData ,
                url: (typeof area.url == 'undefined' || area.url == '') ? "" : '/' + area.url,
                selectable: false,
                autoZoom: false
            }
        );
    });
    return areas;
}

/**
 * Function to construct the legend for ammap
 * @param data_legend
 * @returns legend
 */
function drupal_ammap_parse_legend(data_legend) {
    var legend = {
        width: 120 * Object.keys(data_legend).length,
        backgroundAlpha: 0.9,
        backgroundColor: "#FFFFFF",
        borderColor: "#666666",
        borderAlpha: 1,
        bottom: 15,
        left: 15,
        horizontalGap: 10,
        data: (function () {
            var legend_data = new Array();
            jQuery.each(data_legend, function (index, legend) {
                legend_data.push({
                    title: legend.name,
                    color: legend.color
                });
            });
            return legend_data;
        })()
    };
    return legend;
}

/**
 * Function to get data from an ajax endpoint - used with slider
 * @param ajax_endpoint
 * @param val
 */
function drupal_ammap_get_data(ajax_endpoint, val) {
    jQuery.post(
        ajax_endpoint + val,
        null,
        function(response) {
            jQuery.ajax({
                type: "POST",
                url: Drupal.settings.drupal_ammap.ajax_url,
                data: {
                    'ammap_data': JSON.stringify(
                        {
                            'data': response.data,
                            'legend': response.legend,
                            'settings': Drupal.settings.drupal_ammap.settings
                        }
                    )
                },
                success: function(response) {
                    drupal_ammap.dataProvider.areas = drupal_ammap_parse_areas(response.ammapData);
                    var legend = drupal_ammap_parse_legend(response.legend);
                    drupal_ammap.addLegend(legend);
                    drupal_ammap.validateData();
                },
                dataType: 'json'
            });
        },
        'json'
    );
}

(function($) {

    $(document).ready(function() {
        // If slider needed
        if ( typeof Drupal.settings.drupal_ammap.settings.steps != 'undefined'
            && typeof Drupal.settings.drupal_ammap.steps != 'undefined'
            && typeof Drupal.settings.drupal_ammap.settings.ajax_endpoint != 'undefined') {

            var steps = Drupal.settings.drupal_ammap.steps;
            $('#drupal_ammap_slider').slider({
                min:0,
                max: steps.length - 1,
                step: 1,
                value: steps[steps.length - 1],
                create: function( event, ui ) {
                    //set values in inputs
                    $('#drupal_ammap_slider_value').html('&nbsp');
                    $('#drupal_ammap_slider_min').html(steps[0]);
                    $('#drupal_ammap_slider_max').html(steps[steps.length - 1]);
                },
                change:function(event, ui) {
                    //set values in input and make the AJAX Call
                    $('#drupal_ammap_slider_value').html(steps[$(this).slider("value")]);
                    drupal_ammap_get_data(Drupal.settings.drupal_ammap.settings.ajax_endpoint, steps[$(this).slider("value")]);
                    if (ui.value == 0 || ui.value == steps.length -1 ) {
                        $('#drupal_ammap_slider_value').html('&nbsp;');
                    }
                },
                slide:function(event, ui) {
                    //Set value in value input and move it along with handle
                    var delay = function() {
                        $('#drupal_ammap_slider_value').offset({left: $(ui.handle).offset().left});
                    };
                    // wait a little for the ui.handle to set its position to get the correct offset
                    setTimeout(delay, 5);
                    $('#drupal_ammap_slider_value').html(steps[ui.value]);
                    if (ui.value == 0 || ui.value == steps.length -1 ) {
                        $('#drupal_ammap_slider_value').html('&nbsp;');
                    }
                }
            });
        }
    });

})(jQuery);
