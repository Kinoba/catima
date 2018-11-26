$(".text-condition").on "change", (e) ->
  alert 'coucou'

init = ->
  $("#new_advanced_search select[multiple]").select2(theme: "bootstrap")

$(document).ready(init)
