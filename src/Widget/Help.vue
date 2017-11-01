<template>
<div>
  <b-popover target="Agent Name" triggers="hover" placement="bottom" delay="1000">
Full name of the user. This is a required field and this value will be used in many agent based reports.
  </b-popover>

  <b-popover target="Login" triggers="hover" placement="bottom" delay="1000">
Enter a User ID or a textual based user login name. Do not use special characters. This is a required field and this value will be used in many agent based reports. This login will be used by the user when logging into the user portal. It will also be visible Examples: 'jdoe', 'agent1' or '2000'.
  </b-popover>

  <b-popover target="Password" triggers="hover" placement="bottom" delay="1000">
Enter the password to be used by the user during the login process to the user portal.
  </b-popover>

  <b-popover target="Agent Group" triggers="hover" placement="bottom" delay="1000">
The User Group that the agent belongs to. Select an User Group from the drop down list of build a User Group to associate this user to, then build this user so that you can select the appropriate User Group. Note that users can pick up configuration settings at the group level and that many reports can be run at the User Group level. Additionally, some permissions are determined at a User Group level such as (which User Groups can be viewed by a specific supervisor user). So, take all of these considerations into account when determining how to organize your users into User Groups.
  </b-popover>

  <b-popover target="Release Group" triggers="hover" placement="bottom" delay="1000">
Select from the drop down which release group will be available to this user. A release group is a collection of release codes that the administrator has defined under the Config - Releases configuration section of the administration section of the user portal. The release group selected here will directly determine which release codes this user will be able to choose from when marking themselves as being in the release state. If no release group is selected on this user, the release group used for this user will be determined by the release group setting on the user group that this user is assigned to.
  </b-popover>

  <b-popover target="Permissions" triggers="hover" placement="bottom" delay="1000">
Select the permission profile that this user will be a part of. If no permission profile is selected here, the permissions for this agent will be determined by the permission profile set on the user group that this user is assigned to. The permission profile is a set of permissions configured by the administrator and given a specific permission profile name. These permissions include what a user will see, what functions they can perform and what features they can use.
  </b-popover>

  <b-popover target="Primary SIP Contact" triggers="hover" placement="bottom" delay="1000">
This is the default SIP end point or phone number that the user will have calls directed to them on. So, when a user is logged into the system and servicing calls this SIP endpoint or phone number will be used as the default to send call to for this user. A user can have more than one phone number or sip uri associated with them and if they have the permission to do so, they can change the phone to be rang after logging into the system. They may have the privilege of entering a free form phone number or sip uri to use, if given the permission to do so. Note that the system will send calls destined for a user to the gateway specified in the fs_outgoing_gateway configuration parameter under the 'Param' menu item of the administration UI.
  </b-popover>

  <b-popover target="Caller ID Number" triggers="hover" placement="bottom" delay="1000">
Caller ID number to be used for this user if they make outbound calls. Note that this caller ID number may be overridden by Line/Client settings during the outbound calling process. If not set, the configuration of the caller ID parameters of the Line/Client combination selected during the outbound call process will be used to determine the caller ID number.
  </b-popover>

  <b-popover target="Ring Timeout" triggers="hover" placement="bottom" delay="1000">
Number of seconds that the users phone will ring when they are offered a call before the call is pulled back and offered to another user. Enter a number of seconds or leave blank. If blank, the ring timeout period will be taken from the User Group that this user is assigned to.
  </b-popover>

  <b-popover target="Max Missed Calls (auto release)" triggers="hover" placement="bottom" delay="1000">
This value is the maximum amount of calls that a user can miss before they are automatically placed into the release state. Leave this parameter blank if you never want to have a user put into the released state automatically. However, note that if this setting is absent on this user, the user may still have a max missed calls before set to released parameter associated with them via the user group that they are assigned to. Note that a missed call includes cases such as the user was rang but did not answer, the user declined the call via their phone or were on Do Not Disturb, or the user phone/end point could not be reached (e.g. their sip phone is not registered). If the system puts them into a release state automatically, it will put them into release with a release reason that is built in the System release group under the config menu. By default, this will be a release reason of "Auto" but can be changed by the administrator if they choose to do so.
  </b-popover>

  <b-popover target="Reset Max Rings On Success" triggers="hover" placement="bottom" delay="1000">
If checked, each time the user accepts a call, the counter associated with the "Max Missed Calls (auto release)" feature will be reset. This effectively means that the user would have to miss that number of calls simultaneously before they are placed in the release state automatically. If this parameter is unchecked, the counter is not reset and therefore the auto release takes effect as soon as the user misses that many calls in total. Once a user logs off and then back in, the count of missed calls is reset.
  </b-popover>

  <b-popover target="Suspend Time" triggers="hover" placement="bottom" delay="1000">
Enter the number of seconds to suspend a user when they miss a call or leave blank to not use the suspend feature. However, note that if this setting is absent on the user record, this user may still have a suspend timer associated with them based on the user group that they are assigned to. A user that is in this temporary suspended mode will not be offered calls even though they are in general available. This feature is often used to ensure that a single agent is not rang over and over for the same call until such time as they are put in auto release based on the 'Max Missed Calls (auto release) setting. Note that a missed call includes cases such as the user was rang but did not answer, the user declined the call via their phone or were on Do Not Disturb, or the user phone/end point could not be reached (e.g. their sip phone is not registered).
  </b-popover>

  <b-popover target="Auto Logout" triggers="hover" placement="bottom" delay="1000">
Enter a number of seconds or leave blank. If blank, the auto logout will be assigned based on the user group that this user is assigned to. If the auto logout of that user group is also not set, a user will never but automatically logged off from the system. If set either here or on the user group level, and a user sits in the released mode for this specified number of seconds without having any activity, the system will automatically log them off. If the agent is a persistent agent, this auto logout feature will be ignored.
  </b-popover>

  <b-popover target="Persistent" triggers="hover" placement="bottom" delay="1000">
If unchecked the user will be a "normal" user. They will login, logout, go available and released via the user portal. If checked, this user will be considered a persistent user. Persistent users are treated as ALWAYS logged in and available. They will not be subject to auto logout or auto release cases. However, the suspend and wrap up modes will still apply to this user. Note that a user that has the permissions to do so can set the state of a persistent agent manually via the user portal. This allows for a mechanism to stop using a persistent user for a period of time without the need to remove this user record from the system.
  </b-popover>

  <b-popover target="Agent Skills" triggers="hover" placement="bottom" delay="1000">
Build the list of skills to associate with this user. Note that the user may also be assigned skills based on the user group that they are a member of. The skills assigned to a user directly determine what calls a user will be offered while they are logged in and available. Calls are assigned skills via the queue that they arrive in and the queue group that the queue is associated with. Specifically, the skills assigned on the queue PLUS the skills assigned on the queue group make up the list of skills required by the call. A user must have ALL skills required by a call for them to be available for that call. If a user has more skills that required by the call but have at least the same skills as required by the call, the user is eligible to receive that call.
  </b-popover>

  <b-popover target="Queue Name" triggers="hover" placement="bottom" delay="1000">
Name of the Queue being configured
  </b-popover>

  <b-popover target="Queue Group Name" triggers="hover" placement="bottom" delay="1000">
Select a Queue Group from the drop down list. This will be the Queue Group that this queue is part of. Remember that reporting can be done at a queue group level so be sure to take reporting requirements into account when deciding on what queue group a queue should be part of. Also note that many parameters set on the Queue level can also be configured at the queue group level. For parameters that can be set on both the queue and the queue group, note that the queue level setting will take precedence. So, if the value is set here, it will override the same parameter set at the queue group level. If a parameter is left blank on that queue but set at the queue group level, then the value in the queue group will be used. If neither is set, the system default for the parameter will be used.
  </b-popover>

  <b-popover target="Exit Lua Script" triggers="hover" placement="bottom" delay="1000">
Select a predefined lua script from the drop down list. Lua scripts are defined in the Config – Lua Actions menu of the admin UI. These lua “actions” or scripts can be launched at different points throughout the call flow. This parameter represents the lua script that will be executed when a call completes from and agent/caller connection perspective. So, as an example, an administrator could write a small lua script that would prompt the caller to press 1 if they were not satisfied with the service the received, then have the script send an email to a supervisor for follow up.  An Exit Lua Script can be defined here and/or on the Queue Group level.  If defined here, this lua script will be used.  If not defined here and there is one defined on the queue group level, the queue group level exit lua script will be used.  If an exit lua script is not defined in either queue or queue group, no lua script will be executed at the end of the call.
  </b-popover>

  <b-popover target="Recipe" triggers="hover" placement="bottom" delay="1000">
Select a recipe from the drop down list. Recipes are built in the Queues – Recipes admin page and are a set of one or more recipe steps. Calls entering this queue will be subject to the recipe steps built in the recipe selected here.  Note that recipes can be configured at the queue or queue group level with the selection on the queue level taking precedence.  If set at both the queue and queue group level, ONLY the recipe assigned to the queue level will be executed and all recipe steps associated with the recipe assigned on the queue group level will be ignored.
  </b-popover>

  <b-popover target="Music On Hold" triggers="hover" placement="bottom" delay="1000">
Select the MOH file from the drop down list that you would like to use for calls in this queue. MOH files are configured in the Config – MOHs menu of the admin UI. The selected MOH for a specific call can be set from the line, client or queue level, with that order of precedence. So, if a call arrives on a line that has a MOH file selected, that MOH will be used for that call. If no MOH exists on the line level, the client level associated with the call will be checked for a MOH setting and then finally the queue will be checked for a MOH setting. This means that calls in this queue can be provided with different MOH if they have arrived in the system with different lines and/or clients.
  </b-popover>

  <b-popover target="Weight" triggers="hover" placement="bottom" delay="1000">
Enter an integer value. The weight of the queue represents the priority that will be placed on the calls in the queue. This directly affects how calls will be delivered to agents. The higher the weight the more priority will be placed on the calls in the queue. Note that ALL calls with a weight of 2 will be answered before ANY calls with a weight of 1. So, in an environment where there are always calls in the queue with a weight of 2, it's possible that calls of a lower weight will never be answered. If a less aggressive approach to favoring calls is desired, use the Aging parameter.  Note that weight can be set at the queue or queue group level with the queue level setting taking precedence.
  </b-popover>

  <b-popover target="Aging" triggers="hover" placement="bottom" delay="1000">
Enter a value to be used to artificial age calls in this queue. The aging factor can include a single decimal place such as 1.2 or 5.3 or can be a whole number such as 1. The aging factor is used to “age” calls at different rates so that the administrator can prioritize calls in one queue over calls in another queue. It differs from the Weight parameter in that calls with a higher aging factor are not ALWAYS answered prior to ANY call that has a lower aging factor. Instead, calls in queue times are multiplied by the aging factor. The resulting products are used to determine which call should be services first. Example: call1 has been in queue for 30 seconds and has an aging factor of 1. Call 2 has been in queue for 16 seconds and has an aging factor or 2. Call1 has an effective wait time of 30 and call2 has an effective wait time of 32. So in this case, call2 would be answered before call1 even though call1 has been in queue longer.  Note that aging factor can be assigned at the queue or queue group level with the queue level setting taking precedence if set in both places.
  </b-popover>

  <b-popover target="Wrap Up Enabled" triggers="hover" placement="bottom" delay="1000">
Check or Uncheck. This check box determines whether or not the wrap up feature is on for calls in this queue. The wrap-up feature is used to provide a user with “after call” work. So, once a user finishes a call, they are put into a wrap-up state rather than being placed into the available state immediately. This allows the user to finalize some work on this call that just ended before they get more calls offered to them. If enabled (checked), the Wrap-up timer and Auto wrap-up parameters determine how much time a user is given in the wrap up mode.  Note that Wrap-up enabled can be set at the queue or queue group level with the queue level taking precedence.
  </b-popover>

  <b-popover target="Wrap Up Timer" triggers="hover" placement="bottom" delay="1000">
Enter a number of seconds. This value represents the targeted amount of time that a user should be in the wrap up mode after a call. The user will be shown a timer that counts down from this number of seconds to 0 and the counter will turn red thereafter, serving as an indicator that they are taking too much time in after call or wrap-up mode. The Auto wrap-up parameter can be used in conjunction with this timer to end their wrap up mode either at the same time as this counter or at some time later than this timer. This parameter is only in effect if the Wrap Up Enabled check box is enabled (checked). If it is set here, this value will be used. If not, the value will be pulled from the queue group. If it is not set on queue or queue group, it will be treated as blank and the auto wrap-up feature will use only the Auto wrap up timer to control the wrap up counter.
  </b-popover>

  <b-popover target="Auto Wrap Up" triggers="hover" placement="bottom" delay="1000">
Enter a number of seconds. This value will be the amount of seconds after an agent entered the wrap up mode that they will automatically be brought back out of wrap mode and placed into available. If this value is not entered, the agent will never be put back to available automatically. This value will only be used if the Wrap-Up enabled check box is checked. Also note that this value can be set on the queue group level. If it is set here, this value will be used. If not, the value will be pulled from the queue group. If it is not set on queue or queue group, it will be treated as blank and the auto wrap-up feature will not apply.
  </b-popover>

  <b-popover target="Queue Skills" triggers="hover" placement="bottom" delay="1000">
Select the required skills for calls entering this queue. Note that skills may also be assigned at the queue group level. Skills assigned at the queue group level are inherited by all queues within the queue group. Therefore, both queue group and queue level skills assignments are required for calls in the queue. This required skill list is then matched to agents/users and any agent with AT LEAST the required skills of a call can be offered the call. Also note that skills can be manipulated in recipe steps. This means that not all calls in a queue will necessarily have the same required skills list over time.
  </b-popover>

  <b-popover target="Queue Group Name" triggers="hover" placement="bottom" delay="1000">
Name of the Queue Group being configured
  </b-popover>

</div>
</template>

<style>
.popover {
  max-width: 512px; /* Max Width of the popover (depending on the container!) */
  background: #ffc;
}
.popover.bs-popover-right .arrow::after, .popover.bs-popover-auto[x-placement^="right"] .arrow::after {
  border-right-color: #ffc;
}

</style>
