init = ->
  $("#new_advanced_search select[multiple]").select2(theme: "bootstrap")

  # Changes the search fields based on the item type being search for
  $('#advanced_search_item_type').on "change", (e) ->
    window.location.replace($(this).find("option:selected").data("url"))

  # Changes the id and the name of the search input field when changing the selected filter
  $(".filter-condition").on "change", (e) ->
    selectedFilter = $(this).val()
    templateField = $(this).parents('.row').find('.template')

    filerFieldName = templateField.attr('name').replace(/__filter__/g, selectedFilter);
    filerFieldId = templateField.attr('id').replace(/__filter__/g, selectedFilter);

    $(this).parents('.row').find("input[type='text']").attr('name', filerFieldName)
    $(this).parents('.row').find("input[type='text']").attr('id', filerFieldId)
$(document).ready(init)
