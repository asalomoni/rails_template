class DurationInput < SimpleForm::Inputs::Base
  def input
    base_name = "#{object_name}_#{attribute_name}"
    hour_name = options.delete(:hour_name) || "#{base_name}_hour"
    min_name = options.delete(:min_name) ||"#{base_name}_min"
    value = object.send(attribute_name.to_s) || options.delete(:default)

    template.content_tag(:div) do
      template.concat @builder.hidden_field(attribute_name)
      template.concat template.number_field_tag hour_name, intValue(value) / 60, onchange: j_update(base_name, hour_name, min_name), min: 0, max: 99, step: 1
      template.concat ' h     '
      template.concat template.number_field_tag min_name, intValue(value) % 60, onchange: j_update(base_name, hour_name, min_name), min: 0, max: 59, step:30
      template.concat ' m'
      template.concat template.javascript_tag(j_update(base_name, hour_name, min_name))
    end
  end

  def intValue(value)
    return 0 unless value.present?
    value.respond_to?(:to_i) ? value.to_i : value
  end

  def j_update(base_name, hour_name, min_name)
    "$('##{base_name}').val(parseInt('0'+$('##{hour_name}').val())*60 + parseInt('0'+$('##{min_name}').val()))"
  end
end