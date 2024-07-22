window.onscroll = () => {
  const nav = document.getElementById('lDUHFs')
  if (window.scrollY > 80) {
    nav.classList.add('background-reveal')
  } else {
    nav.classList.remove('background-reveal')
  }
}
