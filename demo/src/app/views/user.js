import { user } from '@/app/data/models/user'
import settings from '../settings'
import profile from './elements/profile'

export default {
  async render () {
    const data = await user.load(settings.id)
    return profile.replace('{{ data }}', data)
  }
}
