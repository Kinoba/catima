require "test_helper"

class AdvancedSearchesTest < ActionDispatch::IntegrationTest
  setup { use_javascript_capybara_driver }

  test "search for toyota excluding camry finds 2 matches" do
    visit("/search/en")
    click_on("Advanced")

    select("Vehicle", :from => "advanced_search[item_type]")
    fill_in(
      "advanced_search[criteria][search_vehicle_make_uuid][exact]",
      :with => "toyota"
    )

    select("exclude", :from => "advanced_search[criteria][search_vehicle_model_uuid][field_condition]")
    select("at least one word", :from => "advanced_search[criteria][search_vehicle_model_uuid][condition]")
    fill_in(
      "advanced_search[criteria][search_vehicle_model_uuid][one_word]",
      :with => "camry"
    )

    click_on("Search")

    assert(page.has_content?("Prius"))
    assert(page.has_content?("Highlander"))
    refute(page.has_content?("Camry"))
  end

  test "search for vehicles by number of doors" do
    visit("/search/en")
    click_on("Advanced")

    select("Vehicle", :from => "advanced_search[item_type]")

    select("less than or equal", :from => "advanced_search[criteria][search_vehicle_doors_uuid][condition]")
    fill_in(
      "advanced_search[criteria][search_vehicle_doors_uuid][less_than_or_equal_to]",
      :with => 3
    )

    click_on("Search")

    assert(page.has_content?("Camry Hybrid"))
    assert(page.has_content?("Prius"))
    assert(page.has_content?("XJ6"))
    refute(page.has_content?("Highlander"))
  end

  test "search for authors by boolean field" do
    visit("/one/en")
    click_on("Advanced")

    select("Author", :from => "advanced_search[item_type]")

    select("Yes", :from => "advanced_search[criteria][one_author_deceased_uuid][exact]")

    click_on("Search")

    assert(page.has_content?("Very Old"))
    refute(page.has_content?("Stephen King"))
  end

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
