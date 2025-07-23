import { Page } from './page.js'

class StartPage extends Page {
  async open () {
    await super.open('/')
  }
}

export { StartPage }
