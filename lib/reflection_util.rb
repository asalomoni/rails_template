module ReflectionUtil

  # values_to_retrieve = {"0"=>{"key1"=>"prop1.prop11.prop111"}, "1"=>{"key2"=>"prop2.prop22.prop222"}}
  def self.get_property(object, values_to_retrieve)
    return_values = {}
    values_to_retrieve.each do |value_to_retrieve|
      result = object
      # scompongo in base al punto
      value_to_retrieve[1].each do |key, val|
        val.split('.').each do |property|
          result = (result.respond_to?(property) ? result.send(property) : nil) unless result.nil?
        end
        return_values[key] = result.nil? ? '' : result
      end
    end
    return_values
  end

  def self.clone_object(object)
    internal_clone_object(object)
  end

  private

  def self.internal_clone_object(object)
    return object if object.nil? || object.is_a?(Numeric) || object.is_a?(String) || object.is_a?(FalseClass) || object.is_a?(TrueClass)

    cloned_object = object.dup
    object.instance_variables.each do |var|
      val = object.instance_variable_get(var)
      cloned_object.instance_variable_set(var, internal_clone_object(val))
    end
    cloned_object
  end

end