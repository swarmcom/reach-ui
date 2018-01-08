import Agent from '@/Admin/Agent'
import Agents from '@/Admin/Agents'
import PersistentAgents from '@/Admin/Agent/Persistent'
import Queue from '@/Admin/Queue'
import Queues from '@/Admin/Queues'
import QueueGroup from '@/Admin/Queue/Group'
import QueueGroups from '@/Admin/Queue/Groups'
import AgentGroup from '@/Admin/Agent/Group'
import AgentGroups from '@/Admin/Agent/Groups'
import ReleaseGroup from '@/Admin/Release/Group'
import Releases from '@/Admin/Releases'
import ReleaseEntries from '@/Admin/Release/Entries'
import DispositionGroup from '@/Admin/Disposition/Group'
import DispositionEntries from '@/Admin/Disposition/Entries'
import Dispositions from '@/Admin/Dispositions'
import LineIn from '@/Admin/LineIn'
import LineIns from '@/Admin/LineIns'
import LineOut from '@/Admin/LineOut'
import LineOuts from '@/Admin/LineOuts'
import Client from '@/Admin/Client'
import Clients from '@/Admin/Clients'
import Prompt from '@/Admin/Prompt'
import Prompts from '@/Admin/Prompts'
import MOH from '@/Admin/MOH'
import MOHs from '@/Admin/MOHs'
import Dialplan from '@/Admin/Dialplan'
import Recipe from '@/Admin/Recipe'
import RecipeEntries from '@/Admin/Recipe/Entries'
import Recipes from '@/Admin/Recipes'
import Lua from '@/Admin/Lua'
import Luas from '@/Admin/Luas'
import Role from '@/Admin/Role'
import Roles from '@/Admin/Roles'
import TagGroups from '@/Admin/Tag/Groups'
import TagGroup from '@/Admin/Tag/Group'
import Tags from '@/Admin/Tags'
import Permissions from '@/Admin/Permissions'
import Params from '@/Admin/Params'

export default [
  { path: '', component: Agents },
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
  { path: 'tags', component: Tags },
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
