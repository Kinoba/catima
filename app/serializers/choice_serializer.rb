class ChoiceSerializer < ActiveModel::Serializer
  attributes :uuid, :short_name_translations, :long_name_translations, :category_id
  has_many :children, :serializer => ChoiceSerializer
end
