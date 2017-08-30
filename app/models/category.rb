# == Schema Information
#
# Table name: categories
#
#  catalog_id     :integer
#  created_at     :datetime         not null
#  deactivated_at :datetime
#  id             :integer          not null, primary key
#  name           :string
#  updated_at     :datetime         not null
#  uuid           :string
#

class Category < ActiveRecord::Base
  include HasDeactivation
  include HasFields
  include HasHumanId

  human_id :name
  validates_presence_of :name

  def self.sorted
    order("LOWER(categories.name) ASC")
  end

  def describe
    as_json(only: %i(name uuid)).merge({"fields": fields.map { |f| f.describe }})
  end
end
