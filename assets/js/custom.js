/* Custom javascript */
const lifeInEmoji = ['🇲🇾', '👾', '🏀', '🚲', '🖌', '👟', '💻', '🖊', '🎙', '🦊', '🧗‍♀️', '🏳️‍🌈']

if (navigator.userAgent.indexOf('Mac OS X') !== -1) {
  window.location.replace('#' + lifeInEmoji[Math.floor(Math.random() * (lifeInEmoji.length - 1 ))])
}

const blendCheckbox = document.getElementById('blendToggle')
const blender = document.getElementById('blender')
blendCheckbox.addEventListener('click', toggleBlend, false)

function toggleBlend(e) {
  if (e.target.checked) {
    localStorage.checked = true
    blender.classList.add('active')
  } else {
    localStorage.checked = ''
    blender.classList.remove('active')
  }
}

(function() {
  blendCheckbox.checked = localStorage.checked
  if (localStorage.checked) {
    blender.classList.add('active')
  } else {
    blender.classList.remove('active')
  }
})()
