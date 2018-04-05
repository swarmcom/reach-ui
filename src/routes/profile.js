import Properties from '@/Role/Agent/Properties'
import Permissions from '@/Role/Permissions'

export default [
  { path: '', component: Properties },
  { path: 'properties', component: Properties },
  { path: 'permissions', component: Permissions },
]
