class TimeCollectionInput < SimpleForm::Inputs::Base
  def input
    from = options.delete(:from) || 700
    to = options.delete(:to) || 2300
    interval = options.delete(:interval) || 30

    selected_value = object.send(attribute_name.to_s) || options.delete(:default)

    options.merge!({selected: object.send(attribute_name.to_s).to_formatted_s(:time)}) if selected_value && selected_value.respond_to?(:to_formatted_s)
    @builder.select attribute_name, hour_list(from, to, interval), options, input_html_options
  end

  private
  def hour_list(start_time=700, end_time=2300, interval=30)
    res = []

    time = start_time
    while time <= end_time do
      t = norm_time time
      res.push(int2time t)
      time = t.to_i + interval
    end

    res
  end

  def norm_time(value)
    m = value % 100
    h = (value - m) / 100
    while m >= 60 do
      h = h + 1
      m = m - 60
    end
    h * 100 + m
  end

  def int2time(value)
    m = value % 100
    h = (value - m) / 100
    while m >= 60 do
      h = h + 1
      m = m - 60
    end
    '%02d:%02d' % [h, m]
  end
end