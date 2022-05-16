import 'styles/index.scss'
import 'styles/global.scss'
import 'styles/misc.scss'
import 'styles/fonts.scss'
import 'styles/ais.scss'

import packageJson from '../package.json'

function render() {
  const versionContainer = document.getElementById('version')
  versionContainer.innerText = `Version ${packageJson.version}`
}

render()
