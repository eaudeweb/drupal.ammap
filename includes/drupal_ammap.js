/**
 * Created by dragos on 2/6/14.
 */
AmCharts.ready(function() {
    // create AmMap object
    var map = new AmCharts.AmMap();

    // set path to images
    map.pathToImages = Drupal.settings.drupal_ammap.ammapPath + '/images/';

    //define range of colors because no of statuses is variable
   /* var range_colors = ['#6A9519', '#003871', '#C50049', '#F5A200', '#34B7C4'];
    //index by status name an array of colors
    var status_colors = new Array();
    jQuery.each(Drupal.settings.cms_country.status_types, function (index, type){
        status_colors[type] = range_colors[index];
    });*/

    var rollOverOutlineColor = '#555555';
    var selectedColor = '#555555';

    // Add countries data to Area Obj
    var areas = new Array();
    jQuery.each(Drupal.settings.drupal_ammap.ammapData, function(index, area){
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
    var amdataProvider = {
        mapVar: AmCharts.maps.worldLow,
        areas: areas
    };

    // pass data provider to the map object
    map.dataProvider = amdataProvider;

    map.areasSettings = {
        autoZoom: true,
        selectedColor: selectedColor,
        //unlistedAreasColor: "#DDDDDD",
        //rollOverColor: "#CC0000",
        rollOverOutlineColor: rollOverOutlineColor,
        balloonText: "<strong>[[title]]</strong><br/>[[customData]]",
        showDescriptionOnHover: "true"
    };

    /*Enlarge the title balloon*/
    map.balloon.fontSize = '14px';
    map.balloon.fillAlpha = '0.9';

    /*Change zoom control colors*/
    map.zoomControl.buttonFillColor = "rgb(102, 135, 168)";
    map.zoomControl.buttonRollOverColor= "rgb(102, 135, 168)";

    if ( typeof Drupal.settings.drupal_ammap.settings.legend != 'undefined' && Drupal.settings.drupal_ammap.settings.legend == true  ) {
        var legend = {
            width: 120 * Object.keys(Drupal.settings.drupal_ammap.legend).length,
            backgroundAlpha: 0.9,
            backgroundColor: "#FFFFFF",
            borderColor: "#666666",
            borderAlpha: 1,
            bottom: 15,
            left: 15,
            horizontalGap: 10,
            data: (function () {
                var legend_data = new Array();
                jQuery.each(Drupal.settings.drupal_ammap.legend, function (index, legend) {
                    legend_data.push({
                        title: legend.name,
                        color: legend.color
                    });
                });
                return legend_data;
            })()
        };
        // write the map to container div
        map.addLegend(legend);
    }

    map.write("drupal_ammap");
});
