import Vue from 'vue'

import FormText from '@/Widget/FormText'
import FormBool from '@/Widget/FormBool'
import AgentGroups from '@/Widget/Agent/Groups'
import Skills from '@/Widget/Skills'
import Lines from '@/Widget/Lines'
import MOHs from '@/Widget/MOHs'
import FormSelectBool from '@/Widget/FormSelectBool'
import Prompts from '@/Widget/Prompts'
import Queues from '@/Widget/Queues'
import Recipes from '@/Widget/Recipes'
import QueueGroups from '@/Widget/Queue/Groups'
import Clients from '@/Widget/Clients'
import Luas from '@/Widget/Luas'
import DispositionGroups from '@/Widget/DispositionGroups'
import ReleaseGroups from '@/Widget/ReleaseGroups'
import Roles from '@/Widget/Roles'
import TagGroups from '@/Widget/TagGroups'
import AdminHelp from '@/Widget/Help'
import Tags from '@/Widget/Tags'
import Acls from '@/Widget/Acls'
import FormTags from '@/Widget/Form/Tags'
import FormFile from '@/Widget/Form/File'

Vue.component('form-text', FormText)
Vue.component('form-bool', FormBool)
Vue.component('form-select-bool', FormSelectBool)
Vue.component('agent-groups', AgentGroups)
Vue.component('skills', Skills)
Vue.component('lines', Lines)
Vue.component('mohs', MOHs)
Vue.component('prompts', Prompts)
Vue.component('clients', Clients)
Vue.component('queues', Queues)
Vue.component('queue-groups', QueueGroups)
Vue.component('disposition-groups', DispositionGroups)
Vue.component('release-groups', ReleaseGroups)
Vue.component('recipes', Recipes)
Vue.component('luas', Luas)
Vue.component('roles', Roles)
Vue.component('help', AdminHelp)
Vue.component('tag-group', TagGroups)
Vue.component('tags', Tags)
Vue.component('acls', Acls)
Vue.component('form-tags', FormTags)
Vue.component('form-file', FormFile)
