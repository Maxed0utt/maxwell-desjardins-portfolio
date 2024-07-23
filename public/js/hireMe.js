/* ==========================================================================
DATA START
============================================================================= */
const data = {
  name: '',
  email: '',
  phone: undefined,
  position: '',
  budget: '50',
  positionDescription: undefined
}

/* ==========================================================================
DOM ELEMENTS START
============================================================================= */
const nameElement = document.getElementById('name')
const nameErrorElement = document.getElementById('nameError')
const emailElement = document.getElementById('email')
const emailErrorElement = document.getElementById('emailError')
const phoneElement = document.getElementById('phone')
const phoneErrorElement = document.getElementById('phoneError')
const positionElement = document.getElementById('position')
const positionErrorElement = document.getElementById('positionError')
const budgetElement = document.getElementById('budget')
const budgetTextElement = document.getElementById('budgetText')
const positionDescriptionElement = document.getElementById('positionDescription')
const sendMessageElement = document.getElementById('sendMessage')
const form = document.getElementById('form')
const serverErrorElement = document.getElementById('serverError')
const modal = document.getElementById('modal')
const closeModalButton = document.getElementById('modal-close-button')

/* ==========================================================================
FUNCTIONS START
============================================================================= */
nameElement.addEventListener('input', () => {
  data.name = nameElement.value
})

emailElement.addEventListener('input', () => {
  data.email = emailElement.value
})

phoneElement.addEventListener('input', () => {
  data.phone = phoneElement.value
})

positionElement.addEventListener('input', () => {
  data.position = positionElement.value
})

budgetElement.addEventListener('input', () => {
  data.budget = budgetElement.value
  budgetTextElement.innerText = `$${data.budget}/hour`
})

positionDescriptionElement.addEventListener('input', () => {
  data.positionDescription = positionDescriptionElement.value
})

closeModalButton.addEventListener('click', () => {
  modal.close()
})

function clearFormInputs() {
  nameElement.value = ''
  emailElement.value = ''
  phoneElement.value = ''
  positionElement.value = ''
  budgetElement.value = ''
  positionDescriptionElement.value = ''
  data.name = ''
  data.email = ''
  data.phone = ''
  data.position = ''
  data.budget = ''
  data.positionDescription = ''
}

function clearErrorMessages() {
  nameErrorElement.innerText = ''
  emailErrorElement.innerText = ''
  phoneErrorElement.innerText = ''
  positionErrorElement.innerText = ''
  serverErrorElement.innerText = ''
}

/**
 * Validates if the input string is a valid phone number.
 *
 * A valid phone number can include digits, spaces, dashes, dots, or parentheses,
 * and can optionally start with a '+' followed by up to 2 digits for the country code.
 * Valid formats include: `123-456-7890`, `(123) 456-7890`, `123 456 7890`, `123.456.7890`, `+91 (123) 456-7890`.
 *
 * @param {string} phoneNumber - The phone number to validate.
 * @returns {boolean} - Returns true if the phone number is valid, false otherwise.
 */
function isPhoneValid(phoneNumber) {
  const phoneRegex = /^(\+\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/
  return phoneRegex.test(phoneNumber)
}

/**
 * Validates if the input string is a valid email address.
 *
 * A valid email address format includes: `username@domain.com`,
 * where the username can contain letters, digits, dots, hyphens, and underscores,
 * and the domain can contain letters, digits, hyphens, and dots.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email address is valid, false otherwise.
 */
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

function validateForm() {
  // required fields
  if (data.name === '') {
    sendErrorMessageToUser('nameError', 'Please enter your name.')
    return false
  }
  if (data.email === '') {
    sendErrorMessageToUser('emailError', 'Please enter your email address.')
    return false
  }
  if (data.position === '') {
    sendErrorMessageToUser('positionError', 'Please enter the name of the position.')
    return false
  }
  if (data.phone === '') data.phone = undefined
  if (data.positionDescription === '') data.positionDescription = undefined
  // incorrect format
  if (data.phone && !isPhoneValid(data.phone)) {
    sendErrorMessageToUser('phoneError', 'Enter a valid phone number with digits, spaces, dashes, dots, or parentheses, optionally starting with + and up to 2 digits. \n (e.g., 123-456-7890, +91 (123) 456-7890).')
    return false
  }
  if (!isValidEmail(data.email)) {
    sendErrorMessageToUser('emailError', 'Enter a valid email address in the format username@domain.com (e.g., example@example.com).')
    return false
  }
  // if nothing wrong return true
  return true
}

/**
 * Sends an error message to the user by updating the inner text of a error message p tag element based on the provided input ID.
 *
 * @param {string} [inputId=''] - The ID of the input field that has an error.
 *                                Expected values are:
 *                                'nameError', 'emailError', 'phoneError', 'positionError'
 *                                or any other value to update the server error element.
 * @param {string} [msg=''] - The error message to display to the user.
 */
function sendErrorMessageToUser(inputId = '', msg = '') {
  switch (inputId) {
    case 'nameError': nameErrorElement.innerText = msg; break
    case 'emailError': emailErrorElement.innerText = msg; break
    case 'phoneError': phoneErrorElement.innerText = msg; break
    case 'positionError': positionErrorElement.innerText = msg; break
    default: serverErrorElement.innerText = msg
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault()
  clearErrorMessages()
  const isValidForm = validateForm()
  if (isValidForm) {
    try {
      const response = await fetch('/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include'
        },
        body: JSON.stringify(data)
      })
      if (response.ok) {
        modal.show()
        clearFormInputs()
      } else {
        const errorData = await response.json()
        serverErrorElement.innerText = `Failed to send email: ${errorData.message}`
      }
    } catch (error) {
      serverErrorElement.innerText = `Failed to send email: ${error}`
    }
  }
})
