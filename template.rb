# SET SOURCE PATH
def source_paths
  [File.expand_path(File.dirname(__FILE__))]
end

# INCLUDES GEMS
gem_group :development, :test do
  gem 'rspec-rails'
  gem 'capybara'
  gem 'shoulda-matchers'
  gem 'factory_girl_rails'
  gem 'better_errors'
  gem 'binding_of_caller'
end

group :development, :production do
  gem 'pg'
end

gem_group :production do
  gem 'rails_12factor'
  gem 'puma'
end

group :development do
  gem 'capistrano', require: false
  gem 'capistrano-rvm', require: false
  gem 'capistrano-rails', require: false
  gem 'capistrano-bundler', require: false
  gem 'capistrano3-puma', require: false
end

gem 'jquery-ui-rails'

gem 'jquery-turbolinks'

gem 'cancan'

gem 'breadcrumbs_on_rails'

gem 'password_strength'

gem 'enumerize', git: 'https://github.com/INTERSAIL/enumerize.git'

gem 'simple_form'

gem 'seed_dump'

gem 'will_paginate'

gem 'placeholder-gem'

gem 'jquery-fileupload-rails'

gem 'jquery-minicolors-rails'

gem 'draper'

gem 'sidekiq'

gem 'colorize'

run 'bundle install'
run 'bundle update'

# BOOTSTRAP INSTALLATION
copy_file 'bootstrap-3.2.0/css/bootstrap.css', 'app/assets/stylesheets/bootstrap.css'
copy_file 'bootstrap-3.2.0/css/bootstrap-theme.css', 'app/assets/stylesheets/bootstrap-theme.css'
copy_file 'bootstrap-3.2.0/css/bootstrap.css.map', 'vendor/assets/stylesheets/bootstrap.css.map'
copy_file 'bootstrap-3.2.0/css/bootstrap-theme.css.map', 'vendor/assets/stylesheets/bootstrap-theme.css.map'

copy_file 'bootstrap-3.2.0/fonts/glyphicons-halflings-regular.eot', 'app/assets/fonts/glyphicons-halflings-regular.eot'
copy_file 'bootstrap-3.2.0/fonts/glyphicons-halflings-regular.svg', 'app/assets/fonts/glyphicons-halflings-regular.svg'
copy_file 'bootstrap-3.2.0/fonts/glyphicons-halflings-regular.ttf', 'app/assets/fonts/glyphicons-halflings-regular.ttf'
copy_file 'bootstrap-3.2.0/fonts/glyphicons-halflings-regular.woff', 'app/assets/fonts/glyphicons-halflings-regular.woff'

copy_file 'bootstrap-3.2.0/js/bootstrap.js', 'app/assets/javascripts/bootstrap.js'

# DEVISE INSTALLATION
devise = ask('Do you want to use Devise? [y/n]').downcase
if devise == 'y' || devise.blank?
  gem 'devise'
  run 'bundle install'
  generate 'devise:install'
  devise_model = ask('What should Devise User model be called?')
  devise_model = 'user' if devise_model.blank?
  generate 'devise', devise_model
end

# RAILS_ADMIN INSTALLATION
rails_admin = ask('Do you want to use RailsAdmin? [y/n]').downcase
if rails_admin == 'y' || rails_admin.blank?
  gem 'rails_admin'
  run 'bundle install'
  generate 'rails_admin:install'
end

# SIMPLE_FORM INSTALLATION
generate 'simple_form:install --bootstrap'

# RSPEC + CAPYBARA INSTALLATION
run 'rm -rf test'
generate 'rspec:install'
insert_into_file 'spec/spec_helper.rb', "require 'capybara/rails'\nrequire 'shoulda/matchers'\n", after: "require 'rspec/autorun'\n"

# IMAGES
copy_file 'images/logo_intersail.png', 'app/assets/images/logo_intersail.png'

# VIEWS
copy_file 'views/_render_messages.html.erb', 'app/views/_render_messages.html.erb'
copy_file 'views/ajax_messages.js.erb', 'app/views/ajax_messages.js.erb'
copy_file 'views/ajax_response.js.erb', 'app/views/ajax_response.js.erb'

# CONTROLLER CONCERNS
copy_file 'controllers/concerns/ajax_responseable.rb', 'app/controllers/concerns/ajax_responseable.rb'
copy_file 'controllers/concerns/messageable.rb', 'app/controllers/concerns/messageable.rb'
copy_file 'controllers/concerns/params_storable.rb', 'app/controllers/concerns/params_storable.rb'

# DECORATORS
copy_file 'decorators/error_decorator.rb', 'app/decorators/error_decorator.rb'

# INPUTS
copy_file 'inputs/duration_input.rb', 'app/inputs/duration_input.rb'
copy_file 'inputs/time_collection_input.rb', 'app/inputs/time_collection_input.rb'

# STYLESHEET ASSETS
copy_file 'stylesheets/_util.css.scss', 'app/assets/stylesheets/_util.css.scss'
create_file 'app/assets/stylesheets/common.css.scss'
append_file 'app/assets/stylesheets/common.css.scss', "@import \"util\";\n"
insert_into_file 'app/assets/stylesheets/application.css', "\n *= require jquery.ui.all\n *= require jquery.fileupload-ui\n *= require jquery.minicolors\n *= require common\n", after: "*= require_tree ."

# JAVASCRIPT ASSETS
copy_file 'javascripts/_util.js', 'app/assets/javascripts/_util.js'
create_file 'app/assets/javascripts/common.js.coffee'
insert_into_file 'app/assets/javascripts/application.js', "//= require jquery\n //= require jquery_ujs\n //= require turbolinks\n //= require jquery-fileupload/basic\n //= require jquery.ui\n //= require placeholder\n //= require jquery.minicolors\n //= require jquery.minicolors.simple_form\n", before: "//= require_tree ."

# HELPERS
copy_file 'helpers/bootstrap_flash_helper.rb', 'app/helpers/bootstrap_flash_helper.rb'
copy_file 'helpers/layout_helper.rb', 'app/helpers/layout_helper.rb'

# LOCALES
copy_file 'locales/activerecord.it.yml', 'config/locales/activerecord.it.yml'
copy_file 'locales/devise.it.yml', 'config/locales/devise.it.yml'
copy_file 'locales/it.yml', 'config/locales/it.yml'
copy_file 'locales/rails_admin.it.yml', 'config/locales/rails_admin.it.yml'
copy_file 'locales/simple_form.it.yml', 'config/locales/simple_form.it.yml'
copy_file 'locales/will_paginate.it.yml', 'config/locales/will_paginate.it.yml'

# INITIALIZERS
initializer 'will_paginate.rb', <<-CODE
require 'will_paginate/collection'
require 'will_paginate/array'
CODE

initializer 'locale.rb', <<-CODE
I18n.default_locale = :it
CODE

copy_file 'initializers/kaminari.rb', 'config/initializers/kaminari.rb'

copy_file 'initializers/load_config.rb', 'config/initializers/load_config.rb'
copy_file 'initializers/config.yml', 'config/config.yml'

# CONFIGURATIONS
insert_into_file 'config/application.rb', "\nI18n.enforce_available_locales = false\n", after: "Bundler.require(*Rails.groups)\n"
append_file '.gitignore', "\n/.idea\n"

# RUN MIGRATION
rake 'db:migrate'

# INITIAL GIT COMMIT
git :init
git add: '.'
