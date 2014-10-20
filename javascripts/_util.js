var LIB_TAG = 'ru';
var SEPARATOR = ':';

var STANDARD_ROW = 'data-' + LIB_TAG + '-standard-row';
var STANDARD_COLUMN = 'data-' + LIB_TAG + '-standard-column';
var STANDARD_DYNAMIC_HEIGHT = 'data-' + LIB_TAG + '-standard-dh';
var STANDARD_STATIC_HEIGHT = 'data-' + LIB_TAG + '-standard-sh';
var STANDARD_DYNAMIC_WIDTH = 'data-' + LIB_TAG + '-standard-dw';
var STANDARD_STATIC_WIDTH = 'data-' + LIB_TAG + '-standard-sw';

var RELATIVE_HEIGHT = 'data-' + LIB_TAG + '-relative-h';
var RELATIVE_WIDTH = 'data-' + LIB_TAG + '-relative-w';

var RELATIVE_POSITION = 'data-' + LIB_TAG + '-relative-p';

var AUTOCOMPLETE = 'data-' + LIB_TAG + '-autocomplete-source';
var AUTOCOMPLETE_APPEND_TO = 'data-' + LIB_TAG + '-autocomplete-append-to';
var AUTOCOMPLETE_PARAMS = 'data-' + LIB_TAG + '-autocomplete-params';

var DATEPICKER = 'data-' + LIB_TAG + '-datepicker';

var LOADING_LAYER = 'data-' + LIB_TAG + '-loading-layer';
var AJAX_FORM = 'data-' + LIB_TAG + '-ajax-form';
var AJAX_BUTTON = 'data-' + LIB_TAG + '-ajax-button';
var AJAX_LINK = 'data-' + LIB_TAG + '-ajax-link';

var PAGINATION = 'data-' + LIB_TAG + '-pagination';

var ALERT = 'data-' + LIB_TAG + '-alert';

var MENU = 'data-' + LIB_TAG + '-menu';
var BUTTON = 'data-' + LIB_TAG + '-button';

var TOP_PARENT = 'body';

var DYNAMIC_FIXED_HEADER = 'data-' + LIB_TAG + '-df-header';

var TOOLTIP_TOP = 'data-' + LIB_TAG + '-tooltip-top';
var TOOLTIP_BOTTOM = 'data-' + LIB_TAG + '-tooltip-bottom';
var TOOLTIP_LEFT = 'data-' + LIB_TAG + '-tooltip-left';
var TOOLTIP_RIGHT = 'data-' + LIB_TAG + '-tooltip-right';

var _menu_selected_item = {};


// MAIN
// ================================
$(document).on('page:change', function() {
    hide_all_loading_layers();
    set_pagination_links();
    set_ajax_loading_layers();
    setAlerts();
    setTooltips();
    setMenus();
    set_autocompletes();
    set_datepickers();
    setDynamicFixedHeader();

    refresh();

    $(window).resize(function() {
        refresh();
    });
});

function refresh() {
    standard_page_refresh();

    relative_size_refresh();
    relative_position_refresh();

    resizeSmartCells();

    resizeDynamicFixedHeader();
}


// UTILITY FUNCTIONS
// ================================
function get(thing) {
    return $(TOP_PARENT + ' *[' + thing + ']');
}

function get_from_parent(thing, parent) {
    return parent.find('*[' + thing + ']');
}

function get_with_value(thing, value) {
    return $(TOP_PARENT + ' *[' + thing + '=' + value + ']');
}

function get_data_param(params, index) {
    var split = params.split(SEPARATOR);
    return split[index];
}

function sort_DOM_elements(elements) {
    var elements_array = elements;

    var again = true;
    while (again) {
        again = false;
        for (var i = 0; i < elements_array.length - 1; i++) {
            var a = elements_array[i];
            var b = elements_array[i + 1];

            if ($.contains(b, a)) {
                elements_array[i] = b;
                elements_array[i + 1] = a;
                again = true;
            }
        }
    }

    return elements_array;
}

function log(message) {
    console.log('INTERSAIL::UTIL => ' + message);
}


// REFRESH
// ================================
function relative_size_refresh() {
    var rh_elements = get(RELATIVE_HEIGHT);
    rh_elements.each(function() {
        var value = $(this).attr(RELATIVE_HEIGHT);
        var split = value.split(SEPARATOR);
        var target = split[0];
        var percent = parseInt(split[1]);

        var target_element = $(target);
        if (target_element.length > 0) {
            var height = (target_element.outerHeight() / 100) * percent;
            $(this).outerHeight(height);
        } else {
            log("Target element doesn't exist");
        }
    });

    var rw_elements = get(RELATIVE_WIDTH);
    rw_elements.each(function() {
        var value = $(this).attr(RELATIVE_WIDTH);
        var split = value.split(SEPARATOR);
        var target = split[0];
        var percent = parseInt(split[1]);

        var target_element = $(target);
        if (target_element.length > 0) {
            var width = (target_element.outerWidth() / 100) * percent;
            $(this).outerWidth(width);
        } else {
            log("Target element doesn't exist");
        }
    });
}

function relative_position_refresh() {
    var rp_elements = get(RELATIVE_POSITION);
    rp_elements.each(function() {
        var value = $(this).attr(RELATIVE_POSITION);
        var split = value.split(SEPARATOR);
        if (split[0] != "null") {
            var w_percent = parseInt(split[0]);
        } else {
            var w_percent = null;
        }
        if (split[1] != "null") {
            var h_percent = parseInt(split[1]);
        } else {
            var h_percent = null;
        }

        var target_element = $(this).parent();
        if (target_element.length > 0) {
            $(this).css('position', 'absolute');

            if (h_percent != null) {
                var target_height = target_element.outerHeight();
                var top = ((target_height / 100) * h_percent) - ($(this).outerHeight() / 2);
                $(this).css('top', top + 'px');
            }
            if (w_percent != null) {
                var target_width = target_element.outerWidth();
                var left = ((target_width / 100) * w_percent) - ($(this).outerWidth() / 2);
                $(this).css('left', left + 'px');
            }
        } else {
            log("Target element doesn't exist");
        }
    });
}

function standard_page_refresh() {
    standard_page_refresh_vertical();
    standard_page_refresh_horizontal();
}

function standard_page_refresh_vertical() {
    var top_parent = $(TOP_PARENT);

    var parents = [];
    parents.push(top_parent);
    var static_children = [];
    var dynamic_children = [];
    for (var i = 0; i < parents.length; i++) {
        var parent = parents[i];

        var parent_static_children =  parent.children('*[' + STANDARD_STATIC_HEIGHT + ']');
        var parent_dynamic_children =  parent.children('*[' + STANDARD_DYNAMIC_HEIGHT + ']');

        var static_children_array = [];
        parent_static_children.each(function() {
            static_children_array.push($(this));
            parents.push($(this));
        });
        static_children.push(static_children_array);

        var dynamic_children_array = [];
        parent_dynamic_children.each(function() {
            dynamic_children_array.push($(this));
            parents.push($(this));
        });
        dynamic_children.push(dynamic_children_array);
    }

    $.each(parents, function(index) {
        if (dynamic_children[index].length > 0) {
            var parent = parents[index];
            var parent_height = parent.height();

            var attr = parent.attr(STANDARD_ROW);
            if (typeof attr !== typeof undefined && attr !== false) {
                var dynamic_children_array = dynamic_children[index];
                $.each(dynamic_children_array, function(index) {
                    var children = dynamic_children_array[index];
                    var percent = parseInt(children.attr(STANDARD_DYNAMIC_HEIGHT));
                    if (percent != null && typeof percent != 'undefined' && !isNaN(percent))  {
                        var height = (parent_height / 100) * percent;
                        children.outerHeight(height, true)
                    } else {
                        children.outerHeight(parent_height, true)
                    }
                });
            } else {
                var dynamic_height = 0;
                var static_height = 0;

                var static_children_array = static_children[index];
                $.each(static_children_array, function(index) {
                    var children = static_children_array[index];
                    static_height += children.outerHeight(true);
                });

                dynamic_height = parent_height - static_height;

                var dynamic_children_values = [];
                var dynamic_children_array = dynamic_children[index];
                var total_percent = 0;
                $.each(dynamic_children_array, function(index) {
                    var children = dynamic_children_array[index];
                    var percent = parseInt(children.attr(STANDARD_DYNAMIC_HEIGHT));
                    if (percent != null && typeof percent != 'undefined' && !isNaN(percent))  {
                        dynamic_children_values[index] = percent;
                        total_percent += percent;
                    }
                });

                var effective_height = 0;
                if (total_percent > 100 || total_percent == 0) {
                    var height = Math.floor(dynamic_height / dynamic_children_array.length);
                    effective_height = height * dynamic_children_array.length;
                    $.each(dynamic_children_array, function(index) {
                        dynamic_children_values[index] = height;
                    });
                } else {
                    $.each(dynamic_children_array, function(index) {
                        var height = Math.floor((dynamic_height / 100) * dynamic_children_values[index]);
                        effective_height += height;

                        dynamic_children_values[index] = height;
                    });
                }

                if (total_percent >= 100) {
                    var delta = dynamic_height - effective_height;
                    if (delta > 0) {
                        while (delta > 0) {
                            for (var i = 0; i < dynamic_children_values.length; i++) {
                                dynamic_children_values[i] = dynamic_children_values[i] + 1;
                                delta --;
                                if (delta <= 0) {
                                    break;
                                }
                            }
                        }
                    }
                }

                $.each(dynamic_children_array, function(index) {
                    var children = dynamic_children_array[index];
                    children.outerHeight(dynamic_children_values[index], true);
                });
            }
        }
    });
}

function standard_page_refresh_horizontal() {
    var top_parent = $(TOP_PARENT);

    var parents = [];
    parents.push(top_parent);
    var static_children = [];
    var dynamic_children = [];
    for (var i = 0; i < parents.length; i++) {
        var parent = parents[i];

        var parent_static_children =  parent.children('*[' + STANDARD_STATIC_WIDTH + ']');
        var parent_dynamic_children =  parent.children('*[' + STANDARD_DYNAMIC_WIDTH + ']');

        var static_children_array = [];
        parent_static_children.each(function() {
            static_children_array.push($(this));
            parents.push($(this));
        });
        static_children.push(static_children_array);

        var dynamic_children_array = [];
        parent_dynamic_children.each(function() {
            dynamic_children_array.push($(this));
            parents.push($(this));
        });
        dynamic_children.push(dynamic_children_array);
    }

    $.each(parents, function(index) {
        if (dynamic_children[index].length > 0) {
            var parent = parents[index];
            var parent_width = parent.width();

            var attr = parent.attr(STANDARD_COLUMN);
            if (typeof attr !== typeof undefined && attr !== false) {
                var dynamic_children_array = dynamic_children[index];
                $.each(dynamic_children_array, function(index) {
                    var children = dynamic_children_array[index];
                    var percent = parseInt(children.attr(STANDARD_DYNAMIC_WIDTH));

                    if (percent != null && typeof percent != 'undefined' && !isNaN(percent))  {
                        var width = (parent_width / 100) * percent;
                        children.outerWidth(width, true)
                    } else {
                        children.outerWidth(parent_width, true)
                    }
                });
            } else {
                var dynamic_width = 0;
                var static_width = 0;

                var static_children_array = static_children[index];
                $.each(static_children_array, function(index) {
                    var children = static_children_array[index];
                    static_width += children.outerWidth(true);
                });

                dynamic_width = parent_width - static_width;

                var dynamic_children_values = [];
                var dynamic_children_array = dynamic_children[index];
                var total_percent = 0;
                $.each(dynamic_children_array, function(index) {
                    var children = dynamic_children_array[index];
                    var percent = parseInt(children.attr(STANDARD_DYNAMIC_WIDTH));
                    if (percent != null && typeof percent != 'undefined' && !isNaN(percent))  {
                        dynamic_children_values[index] = percent;
                        total_percent += percent;
                    }
                });

                var effective_width = 0;
                if (total_percent > 100 || total_percent == 0) {
                    var width = Math.floor(dynamic_width / dynamic_children_array.length);
                    effective_width = width * dynamic_children_array.length;
                    $.each(dynamic_children_array, function(index) {
                        dynamic_children_values[index] = width;
                    });
                } else {
                    $.each(dynamic_children_array, function(index) {
                        var width = Math.floor((dynamic_width / 100) * dynamic_children_values[index]);
                        effective_width += width;

                        dynamic_children_values[index] = width;
                    });
                }

                if (total_percent >= 100) {
                    var delta = dynamic_width - effective_width;
                    if (delta > 0) {
                        while (delta > 0) {
                            for (var i = 0; i < dynamic_children_values.length; i++) {
                                dynamic_children_values[i] = dynamic_children_values[i] + 1;
                                delta --;
                                if (delta <= 0) {
                                    break;
                                }
                            }
                        }
                    }
                }

                $.each(dynamic_children_array, function(index) {
                    var children = dynamic_children_array[index];
                    children.outerWidth(dynamic_children_values[index], true);
                });
            }
        }
    });
}

// AUTOCOMPLETE
// ================================
function set_autocompletes() {
    var autocompletes = get(AUTOCOMPLETE);

    autocompletes.each(function() {
        var append_to = $(this).attr(AUTOCOMPLETE_APPEND_TO);
        var params = $(this).attr(AUTOCOMPLETE_PARAMS);

        var autocomplete_params = {};
        autocomplete_params['min_length'] = 0;
        autocomplete_params['appendTo'] = null;
        autocomplete_params['focus'] = true;

        if (append_to != null && typeof append_to !== 'undefined') {
            if ($(append_to).length <= 0) {
                log("Append to element doesn't exist");
                return;
            }
            autocomplete_params['appendTo'] = append_to;
        }

        if (params != null && typeof params !== 'undefined') {
            var split = params.split(SEPARATOR);
            if (split[0] != 'null') {
                autocomplete_params['min_length'] = parseInt(split[0]);
                if (isNaN(autocomplete_params['min_length'])) {
                    log("Min length is not a number");
                    return;
                }
            }
            if (split[1] != 'null') {
                if (!(split[1] == 'true' || split[1] == 'false')) {
                    log("Focus is not a boolean");
                    return;
                }
                autocomplete_params['focus'] = Boolean(split[1]);
            }
        }

        if (autocomplete_params['appendTo'] != null) {
            $(this).autocomplete({
                source: $(this).data(LIB_TAG + '-autocomplete-source'),
                appendTo: autocomplete_params['appendTo'],
                minLength: autocomplete_params['min_length'],
            });
        } else {
            $(this).autocomplete({
                source: $(this).data(LIB_TAG + '-autocomplete-source'),
                minLength: autocomplete_params['min_length'],
            });
        }

        if (autocomplete_params['focus']) {
            $(this).focus(function(){
                $(this).autocomplete( "search", $(this).val() );
            });
        }
    });
}


// DATEPICKER
// ================================
$.datepicker.noSundays = function(value)
{
    return [value.getDay() != 0, '', ''];
}

$.datepicker.regional['it'] = {
    clearText: 'Svuota', clearStatus: 'Annulla',
    closeText: 'Chiudi', closeStatus: 'Chiudere senza modificare',
    prevText: '&#x3c;Prec', prevStatus: 'Mese precedente',
    prevBigText: '&#x3c;&#x3c;', prevBigStatus: 'Mostra l\'anno precedente',
    nextText: 'Succ&#x3e;', nextStatus: 'Mese successivo',
    nextBigText: '&#x3e;&#x3e;', nextBigStatus: 'Mostra l\'anno successivo',
    currentText: 'Oggi', currentStatus: 'Mese corrente',
    monthNames: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
        'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
    monthNamesShort: ['Gen','Feb','Mar','Apr','Mag','Giu',
        'Lug','Ago','Set','Ott','Nov','Dic'],
    monthStatus: 'Seleziona un altro mese', yearStatus: 'Seleziona un altro anno',
    weekHeader: 'Sm', weekStatus: 'Settimana dell\'anno',
    dayNames: ['Domenica','Luned&#236','Marted&#236','Mercoled&#236','Gioved&#236','Venerd&#236','Sabato'],
    dayNamesShort: ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'],
    dayNamesMin: ['Do','Lu','Ma','Me','Gio','Ve','Sa'],
    dayStatus: 'Usa DD come primo giorno della settimana', dateStatus: 'Seleziona D, M d',
    dateFormat: 'dd/mm/yy', firstDay: 1,
    initStatus: 'Scegliere una data', isRTL: false,
    todayBtn: 'linked'
};

$.datepicker.setDefaults($.datepicker.regional['it']);

function set_datepickers() {
    var datepickers = get(DATEPICKER);

    datepickers.each(function(index) {
        $(this).datepicker($.datepicker.regional['it']);
    });
}

function set_minicolors_defaults() {
    $.minicolors.defaults = $.extend($.minicolors.defaults, {
        defaultValue: '#ffffff'
    });
}

// PAGINATION
// ================================
function set_pagination_links() {
    var paginations = get(PAGINATION);
    paginations.each(function() {
        var links = $(this).find('a');
        var layer_name = $(this).attr(PAGINATION);

        links.click(function() {
            var layers = get_with_value(LOADING_LAYER, layer_name);
            layers.each(function() {
                $(this).show();
            });
        });
    });
}

// AJAX
// ================================
var _current_xhr = null;

function recordXHR(event, jqXHR) {
    if (_current_xhr != null) {
        _current_xhr.abort();
    }
    _current_xhr = jqXHR;

    show_layer($(event.currentTarget));
}

function show_layer(element) {
    var layer_name = element.attr(AJAX_FORM);
    var layers = get_with_value(LOADING_LAYER, layer_name);
    layers.each(function() {
        $(this).show();
    });

    layer_name = element.attr(AJAX_LINK);
    layers = get_with_value(LOADING_LAYER, layer_name);
    layers.each(function() {
        $(this).show();
    });
}

function set_ajax_loading_layers() {
    var forms = get(AJAX_FORM);
    forms.each(function() {
        $(this).bind('ajax:beforeSend', recordXHR);
    });

    var buttons = get(AJAX_BUTTON);
    buttons.each(function() {
        var button_form = $(this).parents('form');
        button_form.attr(AJAX_FORM, $(this).attr(AJAX_BUTTON));
        button_form.bind('ajax:beforeSend', recordXHR);
    });

    var links = get(AJAX_LINK);
    links.each(function() {
        $(this).bind('ajax:beforeSend', recordXHR);
    });
}

function hide_all_loading_layers() {
    var layers = get(LOADING_LAYER);

    layers.each(function() {
        $(this).hide();
    });
}

// ALERT
// ================================
function setAlerts() {
    var alerts = get(ALERT);

    alerts.each(function() {
        var alert = $(this);
        alert.find('.close').click(function() {
            alert.html('');
            refresh();
        });
    });
}

// TOOLTIP
// ================================
function setTooltips() {
    var tooltips = get(TOOLTIP_TOP);

    tooltips.each(function() {
        var tooltip = $(this);
        tooltip.data('toggle', 'tooltip');
        tooltip.data('placement', 'top');
        tooltip.data('title', $(this).attr(TOOLTIP_TOP));
        tooltip.tooltip({container: 'body'});
    });

    tooltips = get(TOOLTIP_BOTTOM);

    tooltips.each(function() {
        var tooltip = $(this);
        tooltip.data('toggle', 'tooltip');
        tooltip.data('placement', 'bottom');
        tooltip.data('title', $(this).attr(TOOLTIP_BOTTOM));
        tooltip.tooltip({container: 'body'});
    });

    tooltips = get(TOOLTIP_LEFT);

    tooltips.each(function() {
        var tooltip = $(this);
        tooltip.data('toggle', 'tooltip');
        tooltip.data('placement', 'left');
        tooltip.data('title', $(this).attr(TOOLTIP_LEFT));
        tooltip.tooltip({container: 'body'});
    });

    tooltips = get(TOOLTIP_RIGHT);

    tooltips.each(function() {
        var tooltip = $(this);
        tooltip.data('toggle', 'tooltip');
        tooltip.data('placement', 'right');
        tooltip.data('title', $(this).attr(TOOLTIP_RIGHT));
        tooltip.tooltip({container: 'body'});
    });
}

// MENU
// ================================
function setMenus() {
    var menus = get(MENU);

    menus.each(function() {
        var menu = $(this);
        var split = menu.attr(MENU).split(SEPARATOR);
        var menu_name = split[0];
        var hover_class = split[2];

        var menu_buttons = get_from_parent(BUTTON, menu);
        menu_buttons.each(function() {
            $(this).click(function() {
                deselectAllMenuItems(menu);
                setMenuSelectedItem(menu, $(this));
            });
        });

        menu_buttons.mouseenter(function() {
            var button_name = $(this).attr(BUTTON);
            if (button_name != _menu_selected_item[menu_name]) {
                $(this).addClass(hover_class);
            }
        });

        menu_buttons.mouseleave(function() {
            $(this).removeClass(hover_class)
        });
    });
}

function deselectAllMenuItems(menu) {
    var split = menu.attr(MENU).split(SEPARATOR);
    var selected_class = split[1];
    var hover_class = split[2];
    var menu_buttons = get_from_parent(BUTTON, menu);
    menu_buttons.removeClass(selected_class);
    menu_buttons.removeClass(hover_class);
}

function setMenuSelectedItem(menu, item) {
    var split = menu.attr(MENU).split(SEPARATOR);
    var menu_name = split[0];
    var selected_class = split[1];
    _menu_selected_item[menu_name] = item.attr(BUTTON);
    item.addClass(selected_class);
}

// TABLE SMART CELLS
// ================================
function resizeSmartCells() {
    $('table').each(function() {
        var table = $(this);
        var table_width = table.innerWidth();

        var static_space = 0;
        table.find('tbody tr:first td').each(function(index) {
            if (!$(this).hasClass('smart_cell')) {
                static_space += $(this).outerWidth();
            }
        });

        var smart_cells = table.find('tbody tr:first .smart_cell');
        var cell_space = (table_width - static_space) / smart_cells.length;
        cell_space = Math.round(cell_space);

        table.find('tbody .smart_cell').each(function() {
            $(this).css('width', cell_space + 'px');
            $(this).css('white-space', 'nowrap');
            $(this).css('overflow', 'hidden');
            $(this).css('text-overflow', 'ellipsis');
        });
    });
}

// TABLE DYNAMIC FIXED HEADER
// ================================
function setDynamicFixedHeader() {
    var headers = get(DYNAMIC_FIXED_HEADER);

    headers.each(function() {
        var table = $(this).attr(DYNAMIC_FIXED_HEADER);

        var class_attribute = $(table).attr('class');
        $(this).attr('class', class_attribute);

        $(this).find('thead').html($(table).find('thead').html());

        $(table + ' thead').hide();
    });
}

function resizeDynamicFixedHeader() {
    var headers = get(DYNAMIC_FIXED_HEADER);

    headers.each(function() {
        var width_array = [];
        var table = $(this).attr(DYNAMIC_FIXED_HEADER);
        $(table).find('tbody tr:first td').each(function(index){
            width_array[index] = $(this).innerWidth();
        });

        if (width_array.length > 0) {
            $(this).innerWidth($(table).innerWidth());
            $(this).find('th').each(function(index) {
                var td_width = width_array[index];
                $(this).innerWidth(td_width);
            });
        }
    });
}

// DECIMAL NUMBERS
// =================================
function round(value, n_decimals) {
    elevated_value = value * Math.pow(10, n_decimals);
    ret_value = Math.floor(elevated_value);
    if ((elevated_value - ret_value) * 10 >= 5)
        ret_value += 1;
    return ret_value / Math.pow(10, n_decimals);
}

// AUTO FILL FIELDS
// =================================
function autoFill(this_element, this_element_value, returnFunction, parameters) {
    source_url = this_element.data("source-url");
    form_div = $("#"+this_element.data("form-div"));
    overwrite = this_element.data("overwrite");
    // inizializzo l'array dei valori contenuti nel div
    params = {};
    //form_div.find("*[data-name]").each(function(index) {
        params[this_element.data('name')] = this_element_value;
    //});
    // inizializzo una sezione apposta dei parametri con le destinazioni
    params['values_to_retrieve'] = {};
    destinations_index = 0;
    $.each(this_element.data("destinations"), function(index, destination) {
        params['values_to_retrieve'][destinations_index] = {};
        params['values_to_retrieve'][destinations_index][destination['target']] = destination['value'];
        destinations_index++;
    });
    $.ajax({
        url: source_url,
        type: 'GET',
        data: params,
        dataType: 'json',
        success: function (resultData) {
            // per ogni destinazione, inserisco il valore letto
            $.each(this_element.data("destinations"), function(index, destination) {
                element_id = "#"+destination['target'];
                form_div.find(element_id).each(function(index) {
                    if ($(this).val() == "" || overwrite == true)
                        //alert($(this).val());
                        $(this).val(resultData[destination['target']]);
                });
            });
            if (returnFunction)
                returnFunction(parameters);
        }
    });
}

// MISC
// ================================
function addEvenOddClasses(collection, even_classes, odd_classes) {
    collection.each( function(index) {
        if (index % 2 == 0) {
            $(this).addClass('even');
        } else {
            $(this).addClass('odd');
        }
    });
}

function verticalScrollbarWidth() {
    var scrollDiv = document.createElement("div");
    scrollDiv.className = "scrollbar-measure";
    document.body.appendChild(scrollDiv);

    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

    document.body.removeChild(scrollDiv);

    return scrollbarWidth;
}

function hasVerticalScrollbar(element) {
    return element.get(0).scrollHeight > element.get(0).clientHeight
}