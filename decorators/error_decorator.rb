class ErrorDecorator < Draper::Decorator
  delegate_all

  def self.create(base_object, custom_messages=[], excluded_attributes=[])
    excluded = []
    excluded_attributes.each do |attribute|
      excluded.push(attribute.to_sym)
    end

    decor = ErrorDecorator.new(base_object.errors)
    decor.base_object_class = base_object.class
    decor.custom_messages = custom_messages
    base_object.errors.each do |k, v|
      decor.custom_messages.push(v) if k == :base
    end
    decor.excluded_attributes = excluded
    decor
  end

  def attribute_excluded? (attribute)
    @excluded_attributes.include? (attribute)
  end

  def excluded_attributes
    @excluded_attributes
  end

  def excluded_attributes=(value)
    @excluded_attributes = value
  end

  def base_object_class
    @base_object_class
  end

  def base_object_class=(value)
    @base_object_class = value
  end

  def custom_messages
    @custom_messages
  end

  def custom_messages=(value)
    @custom_messages = value
  end

  def keys
    model.inject([]) { |arr, (k,v)| arr << k if model[k].count > 0 && !arr.include?(k) && k != :base; arr }
  end

  def messages(key)
    model[key].map {|mex| "#{mex}"}.join(', ')
  end

  def t_key(key)
    translated_attribute(key)
  end

  def t_messages(key)
    model[key].map {|mex| "#{translated_message(mex)}"}.join(', ')
  end

  def errors_count
    err_count = keys.length
    err_count += custom_messages.length if custom_messages
    err_count
  end

  def blank?
    model.blank? && custom_messages.blank?
  end

  private

  def translated_attribute(attribute)
    attr_name = attribute.to_s.tr('.', '_').humanize
    base_object_class.human_attribute_name(attribute, :default => attr_name)
  end

  def translated_message(message)
    I18n.t(:'errors.format', { default: '%{message}', attribute: nil, message: message })
  end
end