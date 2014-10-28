module AjaxResponseable
  extend ActiveSupport::Concern

  included do

  end

  def ajax_response(options={})
    render 'layouts/ajax_response', locals: { partials: options[:partials] || [], hide_modals: options[:hide_modals] || [], show_modals: options[:hide_modals] || [], html: options[:html] || [], errors: options[:errors] || [] }
  end

  def ajax_messages(errors, action=0)
    action == 0 ? selected_action = action_name : selected_action = action
    if selected_action
      render 'layouts/ajax_messages', locals: { action: selected_action.to_s, errors: errors || [] }
    else
      render 'layouts/ajax_messages', locals: { action: nil, errors: errors || [] }
    end
  end
end