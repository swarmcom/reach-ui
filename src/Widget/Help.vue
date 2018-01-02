<template>
<div>
  <helper target="Agent Name">
Full name of the agent. This is a required field and this value will be used in many agent based reports.
  </helper>

  <helper target="Login">
Enter an Agent ID or a textual based agent login name. Do not use special characters. This is a required field and this value will be used in many agent based reports. This login will be used by the agent when logging into the user portal. Examples: 'jdoe', 'agent1' or '2000'.
  </helper>

  <helper target="Password">
Enter the password to be used by the agent during the login process to the user portal.
  </helper>

  <helper target="Agent Group">
The Agent Group that the agent belongs to. Select an Agent Group from the drop down list to associate this agent to. Note that agents can pick up configuration settings at the group level and that many reports can be run at the Agent Group level. Additionally, some permissions are determined at an Agent Group level such as (which Agent Groups can be viewed by a specific supervisor user). So, take all of these considerations into account when determining how to organize your agents into Agent Groups.
  </helper>

  <helper target="Release Group">
Select from the drop down which release group will be available to this agent. A release group is a collection of release codes that the administrator has defined under the Config - Releases section in the Admin menu of the user portal. The release group selected here will directly determine which release codes this agent will be able to choose from when marking themselves as being in the release state. If no release group is selected on this agent, the release group used for this agent will be determined by the release group setting on the agent group that this agent is assigned to.
  </helper>

  <helper target="Line Out">
Line Out is indirectly used to determine what client to associate an outbound call to.  When an agent places an outbound call, they will choose an outbound line to place the call over.  This outbound line has it's own caller ID configuration options and has an associated Client.  Therefore, the agent can essentially mark the outbound call as being activity for a specific Client.  Outbound lines are configured in the Lines - Line Out configuration page.  As mentioned, this selected Line Out can drive the caller ID information used for the outbound call if the line out has Override Caler ID configured as true.  This allows the administrator to ensure that a dialable number of there choice is delivered to the called party (i.e. a caller ID number that would enter a specific queue if called back).
  </helper>
  
  <helper target="Role">
Select the permission profile or Role to use for agent permissions determination.  Role is configured on Agent and Agent Group levels with the Agent level setting taking precedence.  The Role is a set of permissions configured by the administrator and given a specific Role name. These permissions include what a user/agent will see, what functions they can perform and what features they can use.  The Roles are configured under the Config - Roles configuration page and once built there, can be assigned to agents.
  </helper>

  <helper target="Primary Contact">
This is the default SIP end point or phone number that the agent will be offered calls on.  So, when an agent is logged in and servicing calls, it is this "phone" that they will be using by default. A user can have more than one phone number or sip uri associated with them (configured in the SIP Contacts field below).  If they have the permission to do so, they can change the phone to use after they log in.  Specifically, they can select any of the SIP Contacts configured for them. They may also have the privilege of entering a free form phone number or sip uri to use.  Note that the system will route calls to agent URI's or phone numbers based on the configuration built in the Instance - Nodes and Instance - Domains configuration.
  </helper>

  <helper target="Additional Contacts">
  Enter a list of additional contact numbers for this agent.  If given the permission to do so, the agent will be able to select from this list of predefined contact numbers when they are logged in.  This will allow the agent to change/set their contact or "phone" on the fly during their logged in session.  Note that these contacts can be SIP URIs or any number that is routable by the system.    Note that the system will route calls to agent URI's or phone numbers based on the configuration built in the Instance - Nodes and Instance - Domains configuration.
  </helper>
  
  <helper target="Caller ID Number">
Caller ID number to be used for this agent when they make outbound calls. Note that this caller ID number may be overridden by Line or Client settings.  An agent selects an outbound line to use when placing an outbound call.  The configuration of this selected line and it's associated client are specifically what can override this caller ID information.  If you do not want this value to be overriden, be sure that Override Caller ID on Line Out and Override Caller ID (outbound) are not set to true.  If this value is not set, the configuration of the caller ID parameters of the Line/Client combination selected during the outbound call process will be used to determine the caller ID number.
  </helper>

  <helper target="Ring Timeout">
Number of seconds that the agents phone will ring when they are offered a call before the call is pulled back and offered to another agent. Enter a number of seconds or leave blank. If blank, the ring timeout period will be taken from the Agent Group that this agent is assigned to.
  </helper>

  <helper target="Max Missed Calls (auto release)">
This value is the maximum amount of calls that an agent can miss before they are automatically placed into the release state. Leave this parameter blank if you never want to have the agent put into the released state automatically. However, note that if this setting is absent on this agent, the agent may still have a max missed calls before set to released parameter associated with them via the agent group that they are assigned to. Note that a missed call includes cases such as the agent was rang but did not answer, the agent declined the call via their phone or were on Do Not Disturb, or the agent phone/end point could not be reached (e.g. their sip phone is not registered). If the system puts them into a release state automatically, it will put them into release with a release reason that is built in the System release group under the config menu. By default, this will be a release reason of "Auto" but can be changed by the administrator if they choose to do so.
  </helper>

  <helper target="Reset Max Rings On Success">
If checked, each time the agent accepts a call, the counter associated with the "Max Missed Calls (auto release)" feature will be reset. This effectively means that the agent would have to miss that number of calls simultaneously before they are placed in the release state automatically. If this parameter is unchecked, the counter is not reset and therefore the auto release takes effect as soon as the agent misses that many calls in total. Once an agent logs off and then back in, the count of missed calls is reset.
  </helper>

  <helper target="Suspend Time">
Enter the number of seconds to suspend the agent when they miss a call.  If left blank, the suspend feature will be off.  However, note that if this setting is absent on the agent settings, this agent may still have a suspend timer associated with them based on the agent group that they are assigned to. An agent that is in this temporary suspended mode will not be offered calls even though they are generally available. This feature is often used to ensure that a single agent is not rang over and over for the same call until such time as they are put in auto release based on the 'Max Missed Calls (auto release) setting. Note that a missed call includes cases such as the agent was rang but did not answer, the agent declined the call via their phone or were on Do Not Disturb, or the agent phone/end point could not be reached (e.g. their sip phone is not registered).
  </helper>

  <helper target="Auto Logout">
Enter a number of seconds or leave blank. If blank, the auto logout time will be assigned based on the agent group that this agent is assigned to. If the auto logout of that agent group is also not set, a user will never be automatically logged off from the system. If set either here or on the agent group level, and an agent sits in the released mode for this specified number of seconds without having any activity, the system will automatically log them off. If the agent is a persistent agent, this auto logout feature will be ignored.
  </helper>

  <helper target="Persistent">
If unchecked the agent will be a "normal" agent. They will login, logout, go available and released via the user portal. If checked, this agent will be considered a persistent agent. Persistent agents are treated as ALWAYS logged in and available. They will not be subject to auto logout or auto release cases. However, the suspend and wrap up modes will still apply to a persistent agent. Note that a user/agent that has the permissions to do so can set the state of a persistent agent manually from the Agents - Persistent administration page. This allows for a mechanism to stop using a persistent agent for a period of time without the need to remove this agent record from the system.
  </helper>

  <helper target="Skills Group">
Select a skill group.  A skill group is a set of skills as defined in the Config - Skill groups configuration page.  If a skill group is defined, all skills from the skill group are added to any other individually selected skills to create a complete skill list.
  </helper>
  
  <helper target="Avatar">
Choose an avatar to associate with this agent.
  </helper>
    
  <helper target="Agent Skills">
Build the list of skills to associate with this agent. These skills are added to skills in the Skills Group if selected.  Note that the agent may also be assigned skills based on the agent group that they are a member of. The skills assigned to an agent directly determine what calls an agent will be offered while they are logged in and available. Calls are assigned skills via the queue that they arrive in and the queue group that the queue is associated with. Specifically, the skills assigned on the queue PLUS the skills assigned on the queue group make up the list of skills required by the call. An agent must have ALL skills required by a call for them to be available for that call. If an agent has more skills than required by the call but have at least the same skills as required by the call, the agent is eligible to receive that call.
  </helper>
  
  <helper target="Agent Group Name">
Enter the name of the agent group.  Note that agents can pick up configuration settings at the group level and that many reports can be run at the Agent Group level. Additionally, some permissions are determined at an Agent Group level such as (which Agent Groups can be viewed by a specific supervisor users). So, take all of these considerations into account when determining how to organize your agents into Agent Groups.
  </helper>

  <helper target="Skills">
Build the list of skills to associate with this agent group. Note that all agents assigned to this agent group will be assigned these skills. The skills assigned to an agent directly determine what calls the agent will be offered while they are logged in and available. Calls are assigned skills via the queue that they arrive in and the queue group that the queue is associated with. Specifically, the skills assigned on the queue PLUS the skills assigned on the queue group make up the list of skills required by the call. An agent must have ALL skills required by a call for them to be available for that call. If an agent has more skills than required by the call but have at least the same skills as required by the call, the agent is eligible to receive that call.
  </helper>

  <helper target="ID">
This is the internal ID of the persistent agent.  Persistent agents are configured by the Persistent parameter on the Agent configuration.  All persistent agents are displayed here.  Persistent agents are treated as ALWAYS logged in and available. They will not be subject to auto logout or auto release cases. However, the suspend and wrap up modes will still apply to this agent. Note that a user that has the permissions to do so can set the state of a persistent agent manually from this page. This allows for a mechanism to stop using a persistent agent for a period of time without the need to remove this agent record from the system.
  </helper>

  <helper target="Queue Name">
Name of the Queue being configured
  </helper>

  <helper target="Queue Group Name">
Select a Queue Group from the drop down list. This will be the Queue Group that this queue is part of. Remember that reporting can be done at a queue group level so be sure to take reporting requirements into account when deciding on what queue group a queue should be part of. Also note that many parameters set on the Queue level can also be configured at the queue group level. For parameters that can be set on both the queue and the queue group, note that the queue level setting will take precedence. So, if the value is set here, it will override the same parameter set at the queue group level. If a parameter is left blank on that queue but set at the queue group level, then the value in the queue group will be used. If neither is set, the system default for the parameter will be used.
  </helper>

  <helper target="Recipe">
Select a recipe from the drop down list. Recipes are built in the Queues – Recipes admin page and are a set of one or more recipe steps. Calls entering this queue will be subject to the recipe steps built in the recipe selected here.  Note that recipes can be configured at the queue or queue group level with the selection on the queue level taking precedence.  If set at both the queue and queue group level, ONLY the recipe assigned to the queue level will be executed and all recipe steps associated with the recipe assigned on the queue group level will be ignored.
  </helper>

  <helper target="Music On Hold">
Select the MOH file from the drop down list that you would like to use for calls in this queue. MOH files are configured in the Config – MOHs menu of the admin UI. The selected MOH for a specific call can be set from the line, client or queue level, with that order of precedence. So, if a call arrives on a line that has a MOH file selected, that MOH will be used for that call. If no MOH exists on the line level, the client level associated with the call will be checked for a MOH setting and then finally the queue will be checked for a MOH setting. This means that calls in this queue can be provided with different MOH if they have arrived in the system with different lines and/or clients.  </helper>

  <helper target="Weight">
Enter an integer value. The weight of the queue represents the priority that will be placed on the calls in the queue. This directly affects how calls will be delivered to agents. The higher the weight the more priority will be placed on the calls in the queue. Note that ALL calls with a weight of 2 will be answered before ANY calls with a weight of 1. So, in an environment where there are always calls in the queue with a weight of 2, it's possible that calls of a lower weight will never be answered. If a less aggressive approach to favoring calls is desired, use the Aging parameter.  Note that weight can be set at the queue or queue group level with the queue level setting taking precedence.
  </helper>

  <helper target="Aging">
Enter a value to be used to artificial age calls in this queue. The aging factor can include a single decimal place such as 1.2 or 5.3 or can be a whole number such as 1. The aging factor is used to “age” calls at different rates so that the administrator can prioritize calls in one queue over calls in another queue. It differs from the Weight parameter in that calls with a higher aging factor are not ALWAYS answered prior to ANY call that has a lower aging factor. Instead, calls in queue times are multiplied by the aging factor. The resulting products are used to determine which call should be services first. Example: call1 has been in queue for 30 seconds and has an aging factor of 1. Call 2 has been in queue for 16 seconds and has an aging factor or 2. Call1 has an effective wait time of 30 and call2 has an effective wait time of 32. So in this case, call2 would be answered before call1 even though call1 has been in queue longer.  Note that aging factor can be assigned at the queue or queue group level with the queue level setting taking precedence if set in both places.
  </helper>

  <helper target="Wrap Up Enabled">
Check or Uncheck. This check box determines whether or not the wrap up feature is on for calls in this queue. The wrap-up feature is used to provide a user with “after call” work. So, once a user finishes a call, they are put into a wrap-up state rather than being placed into the available state immediately. This allows the user to finalize some work on this call that just ended before they get more calls offered to them. If enabled (checked), the Wrap-up timer and Auto wrap-up parameters determine how much time a user is given in the wrap up mode.  Note that Wrap-up enabled can be set at the queue or queue group level with the queue level taking precedence.
  </helper>

  <helper target="Wrap-up timer">
Enter a number of seconds. This value represents the targeted amount of time that a user should be in the wrap up mode after a call. The user will be shown a timer that counts down from this number of seconds to 0 and the counter will turn red thereafter, serving as an indicator that they are taking too much time in after call or wrap-up mode. The Auto wrap-up parameter can be used in conjunction with this timer to end their wrap up mode either at the same time as this counter or at some time later than this timer. This parameter is only in effect if the Wrap Up Enabled check box is enabled (checked). If it is set here, this value will be used. If not, the value will be pulled from the queue group. If it is not set on queue or queue group, it will be treated as blank and the auto wrap-up feature will use only the Auto wrap up timer to control the wrap up counter.
  </helper>

  <helper target="Auto Wrap Up">
Enter a number of seconds. This value will be the amount of seconds after an agent entered the wrap up mode that they will automatically be brought back out of wrap mode and placed into available. If this value is not entered, the agent will never be put back to available automatically. This value will only be used if the Wrap-Up enabled check box is checked. Also note that this value can be set on the queue group level. If it is set here, this value will be used. If not, the value will be pulled from the queue group. If it is not set on queue or queue group, it will be treated as blank and the auto wrap-up feature will not apply.
  </helper>

  <helper target="Queue Skills">
Select the required skills from the drop down selector for calls entering this queue. Remove skills by clicking on the skill name to the right of the drop down selector.  Note that skills may also be assigned at the queue group level, line level and client level. Skills assigned at the queue group level are inherited by all queues within the queue group. Therefore, line, client, queue group and queue level skills assignments are required for calls in the queue. This required skill list is then matched to agents and any agent with AT LEAST the required skills of a call can be offered the call. Also note that skills can be manipulated in recipe steps. This means that not all calls in a queue will necessarily have the same required skills list over time. 
  </helper>

  <helper target="Queue Group Name">
Name of the Queue Group being configured
  </helper>

  <helper target="Auto wrap-up">
Enter a number of seconds. This value will be the amount of seconds after an agent entered the wrap up mode that they will automatically be brought back out of wrap mode and placed into available. If this value is not entered, the agent will never be put back to available automatically. This value will only be used if the Wrap-Up enabled check box is checked. Also note that this value can be set on the queue level. If it is set there, that value will be used. If not, the value will be pulled from here. If it is not set on queue or queue group, it will be treated as blank and the auto wrap-up feature will not apply.
  </helper>

  <helper target="Skills">
Select the required skills from the drop down selector for calls entering this queue. Remove skills by clicking on the skill name to the right of the drop down selector.  Note that skills may also be assigned at the queue level, line level and client level. Skills assigned at the queue group level are inherited by all queues within the queue group. Therefore, line, client, queue group and queue level skills assignments are required for calls in the queue. This required skill list is then matched to agents and any agent with AT LEAST the required skills of a call can be offered the call. Also note that skills can be manipulated in recipe steps. This means that not all calls in a queue will necessarily have the same required skills list over time. 
  </helper>

  <helper target="Recipe Name">
Enter the name of the recipe.  Once the recipe is built (given a name/description and committed), the administrator can change the recipe name or description by clicking the Edit button.  Recipe steps associated with a named recipe are configured after the recipe is built by clicking on the Entries button.  When building the steps of a recipe, the administrator can build one or more criteria and one or more actions to execute if those criteria are true.  In addition, recipe steps may be moved up/down for convienence.  However, it is worth noting that all recipe criteria are checked every second.  Therefore the order of the recipe steps is not important in terms of how the steps are checked and executed.  Ordering the recipe steps is allowed simply to make the recipe more understandable in the configuration.   Also note that when building a recipe, the administrator can provide a description of each recipe step.  They can then expand and contract the recipe step, looking at only the descriptions or all details of the recipe steps (e.g. criterias and actions).
  </helper>

  <helper target="Recipe Descripton">
Enter a description of the recipe.  Using clear and concise descriptions will help the administrator quickly identify the recipe content.
  </helper>

  <helper target="Client Name">
Enter the name of the client.  Clients are used to categorize calls and provide specific configuration.  Specifically, it provides a way to treat and report differently on calls that will be placed into the same queue.  Example: reports can be executed at the queue level to see all of the activity in a particular queue.  However, reports can also be executed on the client level to provide further details of the traffic in a specific queue (at a more precise level). 
  </helper>

  <helper target="Disposition Group">
Select the Disposition Group to be assigned.  A disposition group is a simple list of call dispositions that an agent will choose from during the call or wrap-up time.  This call disposition is then recorded as part of the call detail record and can be reported on.  Dispositions are free form, meaning that the administrator can add as many dispositions as they would like with any name that they would like.  Disposition groups can then be used to provide a different list of dispositions to the agents for calls that arrive for different lines and clients.  Call dispositions and groups are configured in the Config - Disposition Groups configuration page.
  </helper>

  <helper target="Lua Script">
Lua script to be executed at the begining of the call (upon call entry to the system).  Lua scripts are configured in the Config - Lua Actions configuration page and can be used to drastically extend the flexibility of the system.  The administrator can write and deploy as many lua actions or "scripts" as they would like and these lua scripts can be used for things as simple as prompting the caller for information or for functions as complex as integrating with a specific CRM system.
  </helper>

  <helper target="Queue Group Name">
Name of the Queue Group being configured
  </helper>

  <helper target="Music on hold">
Music on hold to be used for calls that are in queue or on hold.  MOH can be configured on the Client, Queue and Queue Group.  The MOH used for a specific call is determined by the most specific of these.  Specifically, MOH will be determined by Client first, then by Queue, then by Queue Group, then by system default (in that order).  MOH sources are configured in the Sounds - MOHs configuration page and then selected as desired.
  </helper>

  <helper target="Announce">
Select an announcement to play upon call arrival for this client.  Calls associated with this client will be delivered this announcement and then placed into queue.  It is a "welcome" message and will not be truncated.  Note that the call does not really enter a queue until this announcement is complete.  Also note that the Welcome Message configuration parameter on the Lines - Lines In configuration page is also a "welcome" message.  So, the administrator can define an announcement to play at the Line or Client level as they desire.  Announcements are built in the system via the Sounds - Prompts configuration page, then selected as desired in the line or client settings.
  </helper>

  <helper target="Allow Voicemail">
If True, queue voicemail is allowed.  If False, queue voicemail is not allowed.  Queue voicemail is a feature that allows a user to request to leave a voicemail or for a recipe step to force a call to leave a voicemail.  Unlike a typical system voicemail in a PBX, these recorded messages or "voicemails" are left as a media in the queue for delivery to an agent.  When a voicemail is recorded, the voicemail is placed into the queue that the call was in and maintains the skills that the call had.  These voicemails look and act like a call in the queue with the only difference being that an agent can simply listen to the message once they are offered and answered the voicemail media rather than being able to talk to the caller.  Voicemails are matched to agents based on skills exactly as calls are matched.  As mentioned, the caller can press a DTMF key to request the transfer.  The key used is configured in the voicemail_dtmf_trigger value under the Params administration menu.  Note that Allow Voicemail can be set on the Line or the Client with the Line setting taking precedence.  </helper>

  <helper target="Enable call recording">
If True, call recording is enabled and all calls will be recorded.  If False, no calls will be recorded.  If set to On Demand, calls will only be recorded if the agent presses the record button during the call.  This allows functionality for "record all", "record none" and "record if agent indicates to do so.  Call recording can be set to true/false/on demand at the Client or Line level with the Line level setting taking precedence.  If it is undefined on the Line configuration, the value from the Client will be used.  It is worth noting that in reality, all calls in the system are recorded behind the scenes.  This setting is really used to determine whether or not to save the recording.  Thus, when call recording is set to On Demand, the entire call is saved as a recording when the agent presses the record button rather than only the portion of the call beyond the time that the agent pressed the record button.
  </helper>

  <helper target="Voicemail prompt">
Select a prompt to be played prior to the beep when a user is about to leave a voicemail.  The list of prompts that can be selected are configured under the Sounds - Prompts configuration page.  Note that this Voicemail Prompt can be set at the Line or Client level with the Line level configuration taking precedence.  If Voicemail Prompt is not configured but call recording is enabled, only a beep tone will play prior to the user being in a state that they are recroding a message.  If Allow Voicemail is disabled and there is a configured Voicemail Prompt, the configured prompt will simply be ignored.
  </helper>

  <helper target="Override Caller ID on Line In">
If True, the caller ID set on the Line In associated with this call will be ignored.  Instead, the Caller ID configuration will be taken from the Caller ID Name and Caller ID Number values below.  If undefined or false, the Line In configuration will be used.
  </helper>

  <helper target="Override Caller ID on Line Out">
If True, the caller ID set on the Line Out associated with an outbound call will be ignored.  Instead, the Caller ID configuration will be taken from the Caller ID Name and Caller ID Number values below.  If undefined or false, the Line Out configuration will be used.
  </helper>

  <helper target="Caller ID Name">
Caller ID (name portion).
  </helper>

  <helper target="Caller ID Number">
Caller ID (number portion)
  </helper>

  <helper target="Queue Group Name">
Name of the Queue Group being configured
  </helper>

  <helper target="Client Avatar">
A specific Avatar to associate with this Client.  This avatar is displayed in the agent UI and can therefore be a nice visual indicator to the agent.  If set, this avatar would be associated with calls to or from this Client.  In other words, if placing an outbound call through the agent UI, the Line Out selected determines the Client to associate with the outbound call and that Client in turn deterines the avatart to use for that outbound call.
  </helper>

  <helper target="Client Skills">
Select the skills to assign to calls for this Client.  Remove skills by clicking on the skill name to the right of the drop down selector.  Note that skills can be set at the Line, Client, Queue and Queue Group levels.  All skills assigned at all of those levels are aggregated together to form a single skill list that is required for the call.  This allows an administrator to assign many different types of calls from many different sources to one queue while still having unique requirements on those calls.  
  </helper>

  <helper target="Lua Name">
Name of the lua action or "script".  An administrator can define as may lua actions in the system as they would like.  These actions or "scripts" can then be assigned to a Line or Client to be executed against a call.  Note that lua actions can be triggered at the beginning of a call (before queue entry), when the call arrives at an agent or at the end of a call.  This allows a system administrator to drastically extend the feature functionality of the system to care for requirements specific to their environment.  
  </helper>

  <helper target="Lua Description">
Description of the lua action of "script".  It is useful to provide a clean and concise description for the lua action so that an administrator does not need to look at the lua code to determine what the script is intended to do.  Of course, the lua code below may also be well commented to ensure an understanding of what the script does.
  </helper>

  <helper target="Skill Group Name">
Name of the skill group.  A skill group is used to create lists or groups of skills that are often used in the system.  An administrator can then assign a skill group to an agent, queue, etc rather than having to assign a list of separate skills.
  </helper>

  <helper target="Skill Group Description">
Description of the skill group.
  </helper>

  <helper target="All skills">
Add skills to the system by typing in the skill name in the entry box and pressing return.  Once added, a full list of the skills built in the system can be seen by using the drop down.  Remove skills from the system by clicking on the skill name to the right of the drop down selector.  Note that once a skill is built in the system here, it can be referenced throughout the system by name.  Example configuration referenceing these skills includes skill groups, queue, queue group, agent, agent group, line, client, etc.
  </helper>

  <helper target="Role Name">
Name of the Role (permission profile).  This is a simple name that could be something like Agents, Supervisors or Administrators.  As many roles can be built as the system administrator would like.  These roles are then assigned to agents and other supervisor or admin users for the purposes of providing them with a list of permissions that are specific to them.  Roles are assigned to agents or agent groups and are intended to limit or expose as much feature functionality, UI content and system control as desired to a specific agent or group of agents.
  </helper>

  <helper target="Role Description">
The description of the Role or permission profile. 
  </helper>

  <helper target="Release Group Name">
Name of the release group. Once a release group has been added to the system (given a name and description and committed), the administrator can add release reasons to the release group by clicking on the Entries button.  The name and description of a release group can always be changed by using the Edit button.  A release group is a collection of release codes that the administrator defines.  The release groups built here can be used in the agent group and agent configuration pages to define what release codes will be available to different agents or groups of agents.  That is, which release codes this user will be able to choose from when marking themselves as being in the release state. 
  </helper>

  <helper target="Release Group Description">
Description of the Release Group
  </helper>

  <helper target="Disposition Group Name">
Name of the disposition group. Once a disposition group has been added to the system (given a name and description and committed), the administrator can add call dispositions to the disposition group by clicking on the Entries button.  The name and description of a group can always be changed by using the Edit button.  A Dispostion Group is a collection of call dispositions that the administrator defines.  The disposition groups built here can be used in the client configuration page to define what call dispositions will be available for the agent to select during a call or after the call in wrap-up mode. Because the disposition group is assigned at the client level, a different list of call dispositions can be presented to the agent (client dependent).
  </helper>

  <helper target="Disposition Group Description">
Description of the Disposition Group
  </helper>

  <helper target="Prompt Name">
Name of the prompt.  A prompt may be something as simple as a tone that you want to play somewhere in the sytem or may be something more complex like an announcement to be used to prompt a caller for some interaction.  The prompts built here can be referenced throughout the system.  Example:  Line, Client, Recipes, Queue, Etc.
  </helper>

  <helper target="Choose File">
Choose the prompt file to upload.
  </helper>

  <helper target="MOH Name">
Name of the MOH.  A MOH or "music on hold" file, is a file to be used by the system while a call is in queue or on hold.  The prompts built here can be referenced on the Client, Queue and Queue Group configuration to specify what MOH to play to a caller when in queue or on hold.
  </helper>

  <helper target="MOH Description">
Description of the MOH.  Some description that helps the administrator understand what the MOH is or what it is used for.
  </helper>

  <helper target="File">
Choose the prompt file to upload.
  </helper>

  <helper target="Line-In Name">
Name of the line.  A Line-In is pointed to by the dialplan and is used to route inbound calls to a client and queue.  The dialplan matches a pattern and sends the call an inbound line.  Then the inbound line points a call to a queue and assigns the client as well perhaps some skills and other feature related configuration.  Note that reporting can be done at a line level so that the contact center can get details about calls to a specific number are being cared for.
  </helper>

  <helper target="Line-In Description">
Description of the line.  This can be a description of where the line comes from or what it is used for.
  </helper>

  <helper target="Entry Lua Script">
Select the lua action to perform prior to the call being placed into the queue.  Ultimately this lua script can set skills, assign the client, set values to be screen popped to the agent and queue the call to a specific queue.  Lua actions are defined under the Config - Lua actions page.  Once configured there, they are selectable here.
  </helper>

  <helper target="Exit Lua Script">
Select the lua action to perform at the end of a call.  End of call means that the call has been answered by an agent and that agent has dropped the call.  At this point in the call, the caller may still be on the line and thus a lua action could be used to interact with the caller.  This hook can be used to do things like creating an end of call survey.  Lua actions are defined under the Config - Lua actions page.  Once configured there, they are selectable here.
  </helper>

  <helper target="Agent Lua Script">
Select the lua action to perform when a call is answered by an agent.  Once the call is answered by the agent, the lua action would typically be performed in the background, without the knowledge of the agent or calle.  This hook can be used to do things like update a CRM database with call detail information that includes what agent took the call.  Lua actions are defined under the Config - Lua actions page.  Once configured there, they are selectable here.
  </helper>

  <helper target="Queue">
Select the queue that the call will be placed into.  Note that a call is answered based on the skills required for it NOT based on the queue that it resides in.  Calls can be assigned skills based on what Line, Client, Queue and Queue Group they are assigned and call delivery to an agent matches this full list of required skills to agents in the system.  For simple queue based routing, the administrator can assign required skills only at the queue level.  Queues are configured in the Queues - Queues configuration page and once they are added there they can be selected here.
  </helper>

  <helper target="Client">
Select the Client to assign the outbound call to.  For inbound calls, Client assignment is important for the purpose of both routing and configuration.  However, for outbound calls, it is used explicitly for reporting.  Reporting can be done based on the client assignment of outbound calls.  Clients are built in the Clients menu and configuration page.  Once they are added there, they can be selected here. 
  </helper>

  <helper target="Welcome Message">
Select an announcement to play upon call arrival for this line.  Calls associated with this line will be delivered this announcement and then placed into queue.  It is a "welcome" message and will not be truncated.  Note that the call does not really enter a queue until this announcement is complete.  Also note that the Announcement configuration parameter on the Client configuration page is also a "welcome" message.  So, the administrator can define an announcement to play at the Line or Client level as they desire.  Announcements are built in the system via the Sounds - Prompts configuration page, then selected as desired in the line or client settings.
  </helper>

  <helper target="Answer on Agent pickup">
If True, answer supervision or SIP 200 OK is not sent to originating party until an agent answers the call.  If false, it is sent immediately upon call arrival.  Note that if you set this value to False, the voice path may not be cut through immediately unless early media is allowed.  Therefore it is possible for the user to not hear the MOH for the queue or welcome messaging.  Therefore if setting this configuration parameter to false, the administrator should ensure that the delivering system plays some sort of acceptable media such as ringing to the caller.  This parameter is particularly useful in cases where the delivering system is set up to play some audio information to the agent when they answer.  Example; Directory Assistance where the contact center has a voice system in front of the agent system (often called voice store and forward).
  </helper>

  <helper target="Override Caller ID">
If True, the Caller ID name and number delivered to the system over this Line will be disregarded and replaced with the Caller ID Name and Caller ID Number values defined below.  Note that even if overriding the originally delivered values here, this may not be the final Caller ID Name and Number.  This is because any Caller ID set here at the line level can be overridden by the Client level configuration.  So, the order of precedence for Caller ID information is Client, then Line, then originally received caller ID.
  </helper>

  <helper target="Line-In Skills">
Select the skills to assign to calls arriving on this Line.  Remove skills by clicking on the skill name to the right of the drop down selector.  Note that skills can be set at the Line, Client, Queue and Queue Group levels.  All skills assigned at all of those levels are aggregated together to form a single skill list that is required for the call.  This allows an administrator to assign many different types of calls from many different sources to one queue while still having unique requirements on those calls.  
  </helper>

  <helper target="Line-Out Name">
Name of the line.  A Line-Out is used when an agent is placing an outbound call through the UI.  The agent selects a virtual line to use to place the outbound call on.  This in turn associates the call with a specific Client and can therefore be reported on in terms of client activity.  
  </helper>

  <helper target="Line-Out Description">
Description of the line.  This can be a description of what client the line is associated with or what it is used for.
  </helper>

  <helper target="Override Caller ID (outbound)">
If True, Caller ID used for outbound calls using this Line-Out is the Caller ID name and Caller ID number below.  If False, the Caller ID information is picked up from the Agent specific record under the Agents - Agents configuration page.  Specifically, the Agent Name and Caller ID Number of the agent is used as the Caller ID information sent.  Note that in the Client configuration, the Caller ID of both the agent and the Line-Out can be overridden.  This is done via the Override Caller ID on Line Out configuration parameter.  
  </helper>

</div>
</template>

<script>
import Helper from '@/Widget/Helper'

export default {
  components: {Helper}
}
</script>

<style>
.popover {
  max-width: 512px; /* Max Width of the popover (depending on the container!) */
  background: #ffc;
}
.popover.bs-popover-right .arrow::after, .popover.bs-popover-auto[x-placement^="right"] .arrow::after {
  border-right-color: #ffc;
}

.popover.bs-popover-top .arrow::after, .popover.bs-popover-auto[x-placement^="top"] .arrow::after {
  border-top-color: #ffc;
}

.popover.bs-popover-bottom .arrow::after, .popover.bs-popover-auto[x-placement^="bottom"] .arrow::after {
  border-bottom-color: #ffc;
}
</style>
