export const dollarInput = function number(cell, onRendered, success, cancel, editorParams) {
  var cellValue = cell.getValue(),
    vertNav = editorParams.verticalNavigation || 'editor',
    input = document.createElement('input')

  input.setAttribute('type', 'number')

  //create and style input
  input.style.padding = '4px'
  input.style.width = '100%'
  input.style.boxSizing = 'border-box'

  input.value = cellValue / 100

  var blurFunc = function blurFunc(e) {
    onChange()
  }

  onRendered(function() {
    //submit new value on blur
    input.removeEventListener('blur', blurFunc)

    input.focus()
    input.style.height = '100%'

    //submit new value on blur
    input.addEventListener('blur', blurFunc)
  })

  function onChange() {
    var value = input.value

    if (!isNaN(value) && value !== '') {
      value = Number(value)
    }

    if (value != cellValue) {
      if (success(value)) {
        cellValue = value //persist value if successfully validated incase editor is used as header filter
      }
    } else {
      cancel()
    }
  }

  //submit new value on enter
  input.addEventListener('keydown', function(e) {
    switch (e.keyCode) {
      case 13:
        // case 9:
        onChange()
        break

      case 27:
        cancel()
        break

      case 38: //up arrow
      case 40:
        //down arrow
        if (vertNav == 'editor') {
          e.stopImmediatePropagation()
          e.stopPropagation()
        }
        break
    }
  })

  return input
}
