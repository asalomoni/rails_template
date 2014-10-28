module LayoutHelper
  #========================================================
  #==== CONSTANTS
  #========================================================
  LIB_TAG = 'ru'
  SEPARATOR = ':'

  STANDARD_ROW = 'data-' + LIB_TAG + '-standard-row'
  STANDARD_COLUMN = 'data-' + LIB_TAG + '-standard-column'
  STANDARD_DYNAMIC_HEIGHT = 'data-' + LIB_TAG + '-standard-dh'
  STANDARD_STATIC_HEIGHT = 'data-' + LIB_TAG + '-standard-sh'
  STANDARD_DYNAMIC_WIDTH = 'data-' + LIB_TAG + '-standard-dw'
  STANDARD_STATIC_WIDTH = 'data-' + LIB_TAG + '-standard-sw'

  RELATIVE_HEIGHT = 'data-' + LIB_TAG + '-relative-h'
  RELATIVE_WIDTH = 'data-' + LIB_TAG + '-relative-w'

  RELATIVE_POSITION = 'data-' + LIB_TAG + '-relative-p'

  TOP_PARENT = 'body'

  DYNAMIC_FIXED_HEADER = 'data-' + LIB_TAG + '-df-header'

  #========================================================
  #==== UTIL
  #========================================================
  def n
    "\n"
  end

  def html_tag_attribute(name, value)
    name.to_s + "='" + value.to_s + "' "
  end

  def remove_line_return(string)
    result = string
    if string.end_with?(n)
      result = string.chomp(n)
    end

    result
  end

  def print_html(html)
    raw html.html_safe
  end

  #========================================================
  #==== LAYOUT
  #========================================================
  def dynamic_fixed_header(target_table)
    attributes_string = html_tag_attribute(DYNAMIC_FIXED_HEADER, target_table)
    html = '<table ' + attributes_string + '>' + n
    html += '<thead>' + n

    html += '</thead>' + n

    html += '</table>' + n

    html.html_safe
  end

  def fixed_header_table(target_table, &block)
    html = '<div class="ru_table" data-ru-standard-dh data-ru-standard-column >' + n
    html += '<div class="ru_table_header" data-ru-standard-sh >' + n
    html += dynamic_fixed_header(target_table)
    html += '</div>' + n
    html += '<div class="ru_table_body" style="overflow-y:auto;" data-ru-standard-dh >' + n
    html += remove_line_return(capture(&block).to_s) + n
    html += '</div>' + n
    html += '</div>' + n

    raw html.html_safe
  end

  def render_messages(id)
    render 'layouts/render_messages', render_messages_options: @render_messages_options, id: id if @render_messages_options
  end

end