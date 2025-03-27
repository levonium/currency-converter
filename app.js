import {currencies} from './currencies.js'

const fromInput = document.getElementById('from')
const toInput = document.getElementById('to')

const fromLabel = document.getElementById('from-currency')
const toLabel = document.getElementById('to-currency')

const timesTenButton = document.querySelector('.add-zero')
const divideByTenButton = document.querySelector('.remove-zero')
const increaseButton = document.querySelector('.increase')
const decreaseButton = document.querySelector('.decrease')

const resetButton = document.querySelector('.reset')

// -- data

const storeData = (data) => {
  localStorage.setItem('currency-data', JSON.stringify(data))
}

const getStoredData = () => {
  const data = localStorage.getItem('currency-data')
  return data ? JSON.parse(data) : null
}

const deleteStoredData = () => {
  localStorage.removeItem('currency-data')
}

const promptData = () => {
  const data = {}

  const fromAnswer = prompt('Please enter the 1st currency code, e.g. USD, EUR, VND')
  const fromCurrency = fromAnswer
    ? Object.values(currencies).find((currency) => currency.code === fromAnswer.toUpperCase())
    : null
  const from = fromCurrency ? fromCurrency : Object.values(currencies).find((currency) => currency.code === 'VND')
  data.from = from

  const toAnswer = prompt('Please enter the 2nd currency code, e.g. USD, EUR, VND')
  const toCurrency = toAnswer
    ? Object.values(currencies).find((currency) => currency.code === toAnswer.toUpperCase())
    : null
  const to = toCurrency ? toCurrency : Object.values(currencies).find((currency) => currency.code === 'THB')
  data.to = to

  data.rate = prompt(`Please enter ${from.code}/${to.code} exchange rate, e.g. 0.08`) || 0.0013
  data.amount = prompt(`Please enter the amount of ${from.code} you want to convert, e.g 1000`) || 1000000

  return data
}

// --- setters

const setLabels = () => {
  const data = getStoredData()
  fromLabel.innerText = data.from.code
  toLabel.innerText = data.to.code
}

const setValues = (fromValue = 0) => {
  // -- definitions
  const set = (input, formatted, raw) => {
    input.value = formatted
    input.dataset.value = raw
  }

  const format = (value, currency) => {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
    }).format(value)
  }

  const convert = (value, rate) => value * rate

  // -- actions
  let data = getStoredData()
  const value = fromValue === 0 ? data.amount : fromValue

  set(fromInput, format(value, data.from), value)

  const toValue = convert(value, data.rate)
  set(toInput, format(toValue, data.to), toValue)
}

// -- increase button
increaseButton.addEventListener('click', () => {
  const inputStr = fromInput.dataset.value
  const digit = parseInt(inputStr[0])

  setValues(`${digit + 1}${inputStr.slice(1)}`)

  decreaseButton.removeAttribute('disabled')
})

// -- decrease button
decreaseButton.addEventListener('click', () => {
  const inputStr = fromInput.dataset.value
  const digit = parseInt(inputStr[0])

  if (digit > 1) {
    setValues(`${digit - 1}${inputStr.slice(1)}`)

    if (digit === 2) {
      decreaseButton.setAttribute('disabled', true)
    } else {
      decreaseButton.removeAttribute('disabled')
    }
  } else {
    decreaseButton.setAttribute('disabled', true)
  }
})

// -- x 10 button
timesTenButton.addEventListener('click', () => {
  setValues(parseInt(fromInput.dataset.value) * 10)
  divideByTenButton.removeAttribute('disabled')
})

// -- ÷ 10 button
divideByTenButton.addEventListener('click', () => {
  if (fromInput.dataset.value.length > 1) {
    setValues(parseInt(fromInput.dataset.value) / 10)

    if (fromInput.dataset.value.length === 1) {
      divideByTenButton.setAttribute('disabled', true)
    } else {
      divideByTenButton.removeAttribute('disabled')
    }
  } else {
    divideByTenButton.setAttribute('disabled', true)
  }
})

// -- switch currencies button
document.getElementById('switch').addEventListener('click', () => {
  const data = getStoredData()
  const clone = structuredClone(data)
  clone.from = data.to
  clone.to = data.from
  clone.rate = 1 / data.rate

  storeData(clone)
  setValues()
  setLabels()
})

// -- from input
fromInput.addEventListener('change', (e) => {
  setValues(fromInput.value.replace(/[^\d.-]/g, ''))
})

// -- reset button
resetButton.addEventListener('click', () => {
  deleteStoredData()
  const data = promptData()
  storeData(data)

  setLabels()
  setValues()
})

// --- start
const start = () => {
  let storedData = getStoredData()

  if (!storedData) {
    storedData = promptData()
    storeData(storedData)
  }

  setLabels()
  setValues()

  document.querySelectorAll('.loading').forEach((el) => el.classList.add('loaded'))
}

start()
