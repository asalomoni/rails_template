module ParamsStorable
  extend ActiveSupport::Concern

  included do

  end

  def stored_name(param_name)
    controller_name + '_' + param_name.to_s
  end

  def params_store(parameters, clear=false)
    parameters.each do |p|
      if clear
        session[stored_name(p)] = nil
      else
        session[stored_name(p)] = params[p] if params[p]
      end
    end
  end

  def params_store_and_get(parameters, clear=false)
    params_store(parameters, clear)
    get_params(parameters)
  end

  def get_stored(param_name)
    session[stored_name(param_name)] ? session[stored_name(param_name)] : nil
  end

  def get_param(parameter)
    params[parameter] || get_stored(parameter)
  end

  def get_params(parameters=[])
    hash = {}
    parameters.each do |p|
      hash[p] = get_param(p)
    end

    hash
  end
end