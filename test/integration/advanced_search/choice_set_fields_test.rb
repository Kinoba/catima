require "test_helper"

class AdvancedSearch::ReferenceFieldTest < ActionDispatch::IntegrationTest
  setup { use_javascript_capybara_driver }

  test "search for cars by single tag choice" do
    visit("/search/en")
    click_on("Advanced")

    select("Vehicle", :from => "advanced_search[item_type]")

    within("#advanced_search_criteria_search_vehicle_style_uuid_0_id-datetime") do
      find(".css-vj8t7z").click # Click on the filter input

      within(".css-11unzgr") do # Within the filter list
        find('div', text: "Sedan", match: :first).click
      end
    end

    click_on("Search")

    assert(page.has_selector?('h4', text: 'Camry'))
  end

  test "search for authors by multiple single tag reference field" do
    visit("/one/en")
    click_on("Advanced")

    select("Author", :from => "advanced_search[item_type]")

    within(".reference-search-container", match: :first) do
      within("#advanced_search_criteria_one_author_collaborator_uuid_0_exact-editor") do
        find(".css-vj8t7z").click # Click on the filter input

        within(".css-11unzgr") do # Within the filter list
          find('div', text: "Very Old", match: :first).click
        end
      end

      find(".fa.fa-plus").click
    end

    select("or", :from => "advanced_search[criteria][one_author_collaborator_uuid][1][field_condition]")

    within all(".reference-search-container")[1] do
      within("#advanced_search_criteria_one_author_collaborator_uuid_1_exact-editor") do
        find(".css-vj8t7z").click # Click on the filter input
        within(".css-11unzgr") do # Within the filter list
          find('div', text: "Very Young", match: :first).click
        end
      end
    end

    click_on("Search")

    assert(page.has_selector?('h4', text: 'Stephen King'))
    assert(page.has_selector?('h4', text: 'Very Old'))
  end

  test "search for authors by multiple tag reference field" do
    visit("/one/en")
    click_on("Advanced")

    select("Author", :from => "advanced_search[item_type]")

    within("#advanced_search_criteria_one_author_other_collaborators_uuid_0_exact-editor") do
      find(".css-vj8t7z").click # Click on the filter input

      within(".css-11unzgr") do # Within the filter list
        find('div', text: "Very Old", match: :first).click
      end
    end

    find('.choiceset-search-container', match: :first).click

    within("#advanced_search_criteria_one_author_other_collaborators_uuid_0_exact-editor") do
      find(".css-vj8t7z").click # Click on the filter input

      within(".css-11unzgr") do # Within the filter list
        find('div', text: "Stephen King", match: :first).click
      end
    end

    click_on("Search")

    assert(page.has_selector?('h4', text: 'Very Young'))
  end

  test "search for authors by several multiple tag reference field" do
    visit("/one/en")
    click_on("Advanced")

    select("Author", :from => "advanced_search[item_type]")

    # First multiple input reference
    within("#advanced_search_criteria_one_author_other_collaborators_uuid_0_exact-editor") do
      find(".css-vj8t7z").click # Click on the filter input

      within(".css-11unzgr") do # Within the filter list
        find('div', text: "Very Old", match: :first).click
      end
    end

    find('.choiceset-search-container', match: :first).click

    within all(".reference-search-container")[1] do
      within("#advanced_search_criteria_one_author_other_collaborators_uuid_0_exact-editor") do
        find(".css-vj8t7z").click # Click on the filter input

        within(".css-11unzgr") do # Within the filter list
          find('div', text: "Stephen King", match: :first).click
        end
      end

      find(".fa.fa-plus").click
    end

    # Second multiple input reference
    select("exclude", :from => "advanced_search[criteria][one_author_other_collaborators_uuid][1][field_condition]")
    within("#advanced_search_criteria_one_author_other_collaborators_uuid_1_exact-editor") do
      find(".css-vj8t7z").click # Click on the filter input

      within(".css-11unzgr") do # Within the filter list
        find('div', text: "Stephen King", match: :first).click
      end
    end

    click_on("Search")

    refute(page.has_selector?('h4', text: 'Stephen King'))
    refute(page.has_selector?('h4', text: 'Very Young'))
  end
end
