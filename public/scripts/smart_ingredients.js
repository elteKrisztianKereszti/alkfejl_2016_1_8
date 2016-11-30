
function parseIngredients (text) {
  return text.split("\n")
    .map(line => {
      const firstSpace = line.indexOf(' ')
      return {
        amount: line.substring(0, firstSpace),
        name: line.substring(firstSpace + 1)
      }
    })
}

function collectIngredients () {
  const ingredients = []

  $('.smart-ingredient').each(function () {
    ingredients.push({
      amount: $(this).find('.smart-ingredient-amount').val(),
      name: $(this).find('.smart-ingredient-name').val()
    })
  })

  if (ingredients.some(ing => ing.amount.indexOf(' ') !== -1)) {
    return ''
  } else {
    return ingredients
      .filter(ing => ing.amount.length > 0 && ing.name.length > 0)
      .map(ing => ing.amount + ' ' + ing.name)
      .join("\n")
  }
}

function insertIngredientInput (ingredient, $before) {
  const $amountInput = $(`<input class="form-control smart-ingredient-amount" type="text" value="${ingredient.amount}" required pattern="^\\S*$">`)
  const $nameInput = $(`<input class="form-control smart-ingredient-name" type="text" value="${ingredient.name}" required>`)

  const $removeBtn = $(`
    <button type="button" class="btn btn-danger btn-block">
      <span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>
    </button>`
  )

  $removeBtn.on('click', function () { 
    $(this).closest('.smart-ingredient').remove()
    $('form').validator('update')  
  })

  const $row = $('<div class="form-group smart-ingredient"><div class="row"></div></div>')
    .append($('<div class="col-md-3"></div>').append($amountInput))
    .append($('<div class="col-md-7"></div>').append($nameInput))
    .append($('<div class="col-md-2"></div>').append($removeBtn))

  $row.insertBefore($before)
}

$('#inputIngredients').each(function () {
  const $textarea = $(this)
  const ingredients = parseIngredients($textarea.val())

  for (let ingredient of ingredients) {
    insertIngredientInput(ingredient, $textarea)
  }

  $textarea.hide()

  const $addBtn = $(`
    <button type="button" class="btn btn-success btn-block">
      <span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
    </button>
  `)

  $addBtn
    .on('click', () => { 
      insertIngredientInput({ amount: '', name: '' }, $textarea)
      $('form').validator('update') 
    })
    .insertAfter($textarea)

  $textarea.closest('form')
    .on('submit', function (e) {
      const text = collectIngredients()
      if (text.length > 0) {
        $textarea.val(text)
      } else {
        e.preventDefault()
      }
    })
})

$('form').validator('update')
