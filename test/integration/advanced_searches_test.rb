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

  test "search for authors by editor field" do
    visit("/one/en")
    click_on("Advanced")

    select("Author", :from => "advanced_search[item_type]")

    select("at least one word", :from => "advanced_search[criteria][one_author_editor_uuid][condition]")

    fill_in(
      "advanced_search[criteria][one_author_editor_uuid][one_word]",
      :with => "user"
    )
    click_on("Search")

    assert(page.has_content?("Stephen King"))
    refute(page.has_content?("Very Young"))
  end

  test "search for authors by email field" do
    visit("/one/en")
    click_on("Advanced")

    select("Author", :from => "advanced_search[item_type]")

    select("exclude", :from => "advanced_search[criteria][one_author_email_uuid][field_condition]")
    select("at least one word", :from => "advanced_search[criteria][one_author_email_uuid][condition]")

    fill_in(
      "advanced_search[criteria][one_author_email_uuid][one_word]",
      :with => "@stephenking.com"
    )
    click_on("Search")

    refute(page.has_content?("Stephen King"))
  end

  test "search for authors by reference field" do
    visit("/one/en")
    click_on("Advanced")

    select("Author", :from => "advanced_search[item_type]")

    within("#advanced_search_criteria_one_author_collaborator_uuid_0_exact-editor") do
      find(".css-vj8t7z").click # Click on the filter input

      within(".css-11unzgr") do # Within the filter list
        find('div', text: "Very Old", match: :first).click
      end
    end

    click_on("Search")

    refute(page.has_content?("Stephen King"))
  end

  test "search for authors by url field" do
    visit("/one/en")
    click_on("Advanced")

    select("Author", :from => "advanced_search[item_type]")

    fill_in(
      "advanced_search[criteria][one_author_site_uuid][exact]",
      :with => "http://stephenking.com/index.html"
    )
    click_on("Search")

    assert(page.has_content?("Stephen King"))
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
