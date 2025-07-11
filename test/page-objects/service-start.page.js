import { Page } from 'page-objects/page'

class ServiceStartPage extends Page {
  open() {
    return super.open('/')
  }
}

export default new ServiceStartPage()
