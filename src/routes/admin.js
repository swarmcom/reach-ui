import Agent from '@/Admin/Agent.vue'
import Agents from '@/Admin/Agents.vue'
import PersistentAgents from '@/Admin/Agent/Persistent.vue'
import Queue from '@/Admin/Queue.vue'
import Queues from '@/Admin/Queues.vue'
import QueueGroup from '@/Admin/Queue/Group.vue'
import QueueGroups from '@/Admin/Queue/Groups.vue'
import AgentGroup from '@/Admin/Agent/Group.vue'
import AgentGroups from '@/Admin/Agent/Groups.vue'
import ReleaseGroup from '@/Admin/Release/Group.vue'
import Releases from '@/Admin/Releases.vue'
import ReleaseEntries from '@/Admin/Release/Entries.vue'
import DispositionGroup from '@/Admin/Disposition/Group.vue'
import DispositionEntries from '@/Admin/Disposition/Entries.vue'
import Dispositions from '@/Admin/Dispositions.vue'
import LineIn from '@/Admin/LineIn.vue'
import LineIns from '@/Admin/LineIns.vue'
import LineOut from '@/Admin/LineOut.vue'
import LineOuts from '@/Admin/LineOuts.vue'
import Client from '@/Admin/Client.vue'
import Clients from '@/Admin/Clients.vue'
import Prompt from '@/Admin/Prompt.vue'
import Prompts from '@/Admin/Prompts.vue'
import MOH from '@/Admin/MOH.vue'
import MOHs from '@/Admin/MOHs.vue'
import Dialplan from '@/Admin/Dialplan.vue'
import Recipe from '@/Admin/Recipe.vue'
import RecipeEntries from '@/Admin/Recipe/Entries.vue'
import Recipes from '@/Admin/Recipes.vue'
import Lua from '@/Admin/Lua.vue'
import Luas from '@/Admin/Luas.vue'
import Role from '@/Admin/Role.vue'
import Roles from '@/Admin/Roles.vue'
import TagGroups from '@/Admin/Tag/Groups.vue'
import TagGroup from '@/Admin/Tag/Group.vue'
import Tags from '@/Admin/Tags.vue'
import Permissions from '@/Admin/Permissions.vue'
import Params from '@/Admin/Params.vue'

export default [
  { path: 'agents', component: Agents },
  { path: 'agent/persistent', component: PersistentAgents },
  { path: 'queues', component: Queues },
  { path: 'params', component: Params },
  { path: 'queue_groups', component: QueueGroups },
  { path: 'agent_groups', component: AgentGroups },
  { path: 'releases', component: Releases },
  { path: 'dispositions', component: Dispositions },
  { path: 'roles', component: Roles },
  { path: 'clients', component: Clients },
  { path: 'line_ins', component: LineIns },
  { path: 'line_outs', component: LineOuts },
  { path: 'prompts', component: Prompts },
  { path: 'mohs', component: MOHs },
  { path: 'recipes', component: Recipes },
  { path: 'luas', component: Luas },
  { path: 'tag_groups', component: TagGroups },
  { path: 'agent', component: Agent },
  { path: 'dialplan', component: Dialplan },
  { path: 'agent/:id', component: Agent, props: true },
  { path: 'queue', component: Queue },
  { path: 'queue/:id', component: Queue, props: true },
  { path: 'agent_group', component: AgentGroup },
  { path: 'agent_group/:id', component: AgentGroup, props: true },
  { path: 'queue_group', component: QueueGroup },
  { path: 'queue_group/:id', component: QueueGroup, props: true },
  { path: 'release', component: ReleaseGroup },
  { path: 'release/:id', component: ReleaseGroup, props: true },
  { path: 'release/:id/entries', component: ReleaseEntries, props: true },
  { path: 'role', component: Role },
  { path: 'role/:id', component: Role, props: true },
  { path: 'role/:id/permissions', component: Permissions, props: true },
  { path: 'tag_group', component: TagGroup },
  { path: 'tag_group/:id', component: TagGroup, props: true },
  { path: 'tag_group/:id/entries', component: Tags, props: true },
  { path: 'disposition', component: DispositionGroup },
  { path: 'disposition/:id', component: DispositionGroup, props: true },
  { path: 'disposition/:id/entries', component: DispositionEntries, props: true },
  { path: 'prompt', component: Prompt },
  { path: 'prompt/:id', component: Prompt, props: true },
  { path: 'moh', component: MOH },
  { path: 'moh/:id', component: MOH, props: true },
  { path: 'client', component: Client },
  { path: 'client/:id', component: Client, props: true },
  { path: 'line_in', component: LineIn },
  { path: 'line_in/:id', component: LineIn, props: true },
  { path: 'line_out', component: LineOut },
  { path: 'line_out/:id', component: LineOut, props: true },
  { path: 'lua', component: Lua },
  { path: 'lua/:id', component: Lua, props: true },
  { path: 'recipe', component: Recipe },
  { path: 'recipe/:id', component: Recipe, props: true },
  { path: 'recipe/:id/entries', component: RecipeEntries, props: true },
]
