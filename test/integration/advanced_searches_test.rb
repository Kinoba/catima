require "test_helper"

class AdvancedSearchesTest < ActionDispatch::IntegrationTest
  setup { use_javascript_capybara_driver }

  test "allows navigation from one result to another, and back to results" do
    visit("/search/en")
    click_on("Advanced")

    select("Vehicle", :from => "advanced_search[item_type]")
    fill_in(
      "advanced_search[criteria][search_vehicle_make_uuid][exact]",
      :with => "toyota"
    )
    click_on("Search")

    click_on("Highlander")
    within("h1") { assert(page.has_content?("Highlander")) }

    click_on("Next:")
    click_on("Previous:")
    within("h1") { assert(page.has_content?("Highlander")) }
    click_on("Back to search results")

    assert(page.has_content?("Prius"))
    assert(page.has_content?("Highlander"))
    assert(page.has_content?("Camry"))
  end
end
