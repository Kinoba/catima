class CatalogAdmin::ChoiceSetsController < CatalogAdmin::BaseController
  layout "catalog_admin/setup"

  def index
    authorize(ChoiceSet)
    @choice_sets = catalog.choice_sets.sorted
  end

  def new
    build_choice_set
    authorize(@field)
  end

  def create
    build_choice_set
    authorize(@field)

    @field.assign_attributes(choice_set_params.except(:choices_attributes))
    loop_trough_children(choice_set_params[:choices_attributes])

    if @field.update(choice_set_params.except(:choices_attributes))
      if request.xhr?
        render json: { choice_set: @field }
      else
        redirect_to(after_create_path, :notice => created_message)
      end
    else
      if request.xhr?
        render json: { errors: @field.errors.full_messages.join(', ') }, status: :unprocessable_entity
      else
        render("new")
      end
    end
  end

  def edit
    find_choice_set
    authorize(@field)
  end

  def update
    find_choice_set
    authorize(@field)

    post_choices = []
    post_choices = loop_trough_children(choice_set_params[:choices_attributes], post_choices)
    # p post_choices
    # p @field.choices.reject { |c| post_choices.include?(c.uuid) }
    # Deletes choices that are not in the params but were previously in the database
    Choice.delete(@field.choices.reject { |c| post_choices&.include?(c.uuid) })

    # return redirect_to(:back)

    if @field.update(choice_set_params.except(:choices_attributes))
      redirect_to(catalog_admin_choice_sets_path, :notice => updated_message)
    else
      render("edit")
    end
  end

  def loop_trough_children(params, post_choices=[], parent=nil)
    return if params.blank?

    params.each do |i, choices_attributes|
      next unless choices_attributes.is_a?(ActionController::Parameters)

      allowed_params = {}
      # Manually allow all numeric params
      choices_attributes.keys.select { |k| !k.to_s.match(/\A\d+\Z/) }.map { |key, _v| allowed_params[key] = choices_attributes[key] }

      choice = if allowed_params["uuid"].present?
                 Choice.find_by(:uuid => allowed_params["uuid"])
               else
                 Choice.new
               end

      choice.row_order = i
      choice.assign_attributes(allowed_params)
      choice.parent = parent
      choice.catalog = @field.catalog
      choice.uuid = SecureRandom.uuid if choice.uuid.blank?

      post_choices << choice.uuid

      @field.choices << choice
      @field.save

      if i.match?(/\A\d+\Z/)
        loop_trough_children(choices_attributes, post_choices, choice) if i =~ /\A\d+\Z/
      end
    end

    post_choices
  end

  def create_choice
    choice_set = catalog.choice_sets.find(params[:choice_set_id])
    authorize(choice_set)
    choice = choice_set.choices.new
    if choice.update(choice_params)
      render json: {
        catalog: catalog.id, choice_set: choice_set.id,
        choice: choice
      }
    else
      render json: {
        errors: choice.errors.full_messages.join(', '),
        catalog: catalog.id, choice_set: choice_set.id
      }, status: :unprocessable_entity
    end
  end

  def synonyms
    @field = catalog.choice_sets.find(params[:choice_set_id])
  end

  def update_synonyms
    choice_set = catalog.choice_sets.find(params[:choice_set_id])
    authorize(choice_set)

    if params[:choice_synonyms].nil?
      choice_set.choices.each { |c| c.update(:synonyms => nil) }
      return redirect_to :action => :synonyms
    end

    updated_choices = []
    choice_synonym_params.each do |choice_id, synonyms|
      choice = Choice.find_by(:id => choice_id)
      next if choice.nil?

      choice.synonyms = []

      synonyms.each do |_i, synonym_params|
        synonym = {}

        synonym_params.each do |lang, syn|
          synonym[lang] = syn
        end

        choice.synonyms << synonym
      end

      choice.save
      updated_choices << choice
    end

    redirect_to :action => :synonyms
  end

  private

  def build_choice_set
    @field = catalog.choice_sets.new
  end

  def find_choice_set
    @field = catalog.choice_sets.find(params[:id])
  end

  def choice_set_params
    params.require(:choice_set).permit(
      :name,
      :deactivated_at,
      :choices_attributes => {})
  end

  def choice_params
    params.require(:choice).permit(
      :short_name_de, :short_name_en, :short_name_fr, :short_name_it,
      :long_name_de, :long_name_en, :long_name_fr, :long_name_it
    )
  end

  def choice_synonym_params
    params.require(:choice_synonyms)
  end

  def created_message
    "Choice set “#{@field.name}” has been created."
  end

  def updated_message
    message = "Choice set “#{@field.name}” has been "
    message << if choice_set_params.key?(:deactivated_at)
                 (@field.active? ? "reactivated." : "deactivated.")
               else
                 "updated."
               end
    message
  end

  def after_create_path
    case params[:commit]
    when /another/i then new_catalog_admin_choice_set_path
    else catalog_admin_choice_sets_path(catalog, I18n.locale, @item_type)
    end
  end
end
