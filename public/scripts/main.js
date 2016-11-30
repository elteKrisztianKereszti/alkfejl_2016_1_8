function ajaxSearch(text) {
  const headers = {
    'csrf-token': $('[name="_csrf"]').val()
  }
  return $.ajax({
    url: `/ajax/search`,
    method: 'GET',
    dataType: 'json',
    data: { q: text },
    headers
  })
}

function onSearch () {
  const text = $(this).val()
  const suggestions = $('.recipe-suggestions')

  if (text.length === 0) {
    suggestions.empty()
    return;
  }

  ajaxSearch(text)
    .then(recipes => {
      suggestions.empty()

      for (let recipe of recipes) {
        suggestions.append(`<a class="list-group-item" href="${recipe.self_url}">${recipe.name}</a>`)
      }
    })
}

$('.recipe-search').on('input', onSearch)
