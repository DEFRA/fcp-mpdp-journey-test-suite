import { Page } from 'page-objects/page'

class StartPage extends Page {
  open() {
    return super.open('/')
  }
}

export default new StartPage()
