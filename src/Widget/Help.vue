<template>
<div>
  <b-popover target="Agent name" triggers="hover">
    Full name of the user. This is a required field and this value will be used in many agent based reports.
  </b-popover>

  <b-popover target="Login" triggers="hover">
    Enter a User ID or a textual based user login name. Do not use special characters. This is a required field and this value will be used in many agent based reports. This login will be used by the user when logging into the user portal. It will also be visible Examples: 'jdoe', 'agent1' or '2000'.
  </b-popover>

  <b-popover target="Password" triggers="hover">
Enter the password to be used by the user during the login process to the user portal.
  </b-popover>

  <b-popover target="Agent Group" triggers="hover">
The User Group that the agent belongs to. Select an User Group from the drop down list of build a User Group to associate this user to, then build this user so that you can select the appropriate User Group. Note that users can pick up configuration settings at the group level and that many reports can be run at the User Group level. Additionally, some permissions are determined at a User Group level such as (which User Groups can be viewed by a specific supervisor user). So, take all of these considerations into account when determining how to organize your users into User Groups.
  </b-popover>

  <b-popover target="Release Group" triggers="hover">
Select from the drop down which release group will be available to this user. A release group is a collection of release codes that the administrator has defined under the Config - Releases configuration section of the administration section of the user portal. The release group selected here will directly determine which release codes this user will be able to choose from when marking themselves as being in the release state. If no release group is selected on this user, the release group used for this user will be determined by the release group setting on the user group that this user is assigned to.
  </b-popover>

  <b-popover target="Permissions" triggers="hover">
Select the permission profile that this user will be a part of. If no permission profile is selected here, the permissions for this agent will be determined by the permission profile set on the user group that this user is assigned to. The permission profile is a set of permissions configured by the administrator and given a specific permission profile name. These permissions include what a user will see, what functions they can perform and what features they can use.
  </b-popover>

  <b-popover target="Primary Phone" triggers="hover">
This is the default SIP end point or phone number that the user will have calls directed to them on. So, when a user is logged into the system and servicing calls this SIP endpoint or phone number will be used as the default to send call to for this user. A user can have more than one phone number or sip uri associated with them and if they have the permission to do so, they can change the phone to be rang after logging into the system. They may have the privilege of entering a free form phone number or sip uri to use, if given the permission to do so. Note that the system will send calls destined for a user to the gateway specified in the fs_outgoing_gateway configuration parameter under the 'Param' menu item of the administration UI.
  </b-popover>

  <b-popover target="Caller ID Number" triggers="hover">
Caller ID number to be used for this user if they make outbound calls. Note that this caller ID number may be overridden by Line/Client settings during the outbound calling process. If not set, the configuration of the caller ID parameters of the Line/Client combination selected during the outbound call process will be used to determine the caller ID number.
  </b-popover>

  <b-popover target="Ring Timeout" triggers="hover">
Number of seconds that the users phone will ring when they are offered a call before the call is pulled back and offered to another user. Enter a number of seconds or leave blank. If blank, the ring timeout period will be taken from the User Group that this user is assigned to.
  </b-popover>

  <b-popover target="Max Missed Calls (auto release)" triggers="hover">
This value is the maximum amount of calls that a user can miss before they are automatically placed into the release state. Leave this parameter blank if you never want to have a user put into the released state automatically. However, note that if this setting is absent on this user, the user may still have a max missed calls before set to released parameter associated with them via the user group that they are assigned to. Note that a missed call includes cases such as the user was rang but did not answer, the user declined the call via their phone or were on Do Not Disturb, or the user phone/end point could not be reached (e.g. their sip phone is not registered). If the system puts them into a release state automatically, it will put them into release with a release reason that is built in the System release group under the config menu. By default, this will be a release reason of "Auto" but can be changed by the administrator if they choose to do so.
  </b-popover>

  <b-popover target="Reset Max Rings On Success" triggers="hover">
If checked, each time the user accepts a call, the counter associated with the "Max Missed Calls (auto release)" feature will be reset. This effectively means that the user would have to miss that number of calls simultaneously before they are placed in the release state automatically. If this parameter is unchecked, the counter is not reset and therefore the auto release takes effect as soon as the user misses that many calls in total. Once a user logs off and then back in, the count of missed calls is reset.
  </b-popover>

  <b-popover target="Suspend Time" triggers="hover">
Enter the number of seconds to suspend a user when they miss a call or leave blank to not use the suspend feature. However, note that if this setting is absent on the user record, this user may still have a suspend timer associated with them based on the user group that they are assigned to. A user that is in this temporary suspended mode will not be offered calls even though they are in general available. This feature is often used to ensure that a single agent is not rang over and over for the same call until such time as they are put in auto release based on the 'Max Missed Calls (auto release) setting. Note that a missed call includes cases such as the user was rang but did not answer, the user declined the call via their phone or were on Do Not Disturb, or the user phone/end point could not be reached (e.g. their sip phone is not registered).
  </b-popover>

  <b-popover target="Auto Logout" triggers="hover">
Enter a number of seconds or leave blank. If blank, the auto logout will be assigned based on the user group that this user is assigned to. If the auto logout of that user group is also not set, a user will never but automatically logged off from the system. If set either here or on the user group level, and a user sits in the released mode for this specified number of seconds without having any activity, the system will automatically log them off. If the agent is a persistent agent, this auto logout feature will be ignored.
  </b-popover>

  <b-popover target="Persistent" triggers="hover">
If unchecked the user will be a "normal" user. They will login, logout, go available and released via the user portal. If checked, this user will be considered a persistent user. Persistent users are treated as ALWAYS logged in and available. They will not be subject to auto logout or auto release cases. However, the suspend and wrap up modes will still apply to this user. Note that a user that has the permissions to do so can set the state of a persistent agent manually via the user portal. This allows for a mechanism to stop using a persistent user for a period of time without the need to remove this user record from the system.
  </b-popover>

  <b-popover target="Skills" triggers="hover">
Build the list of skills to associate with this user. Note that the user may also be assigned skills based on the user group that they are a member of. The skills assigned to a user directly determine what calls a user will be offered while they are logged in and available. Calls are assigned skills via the queue that they arrive in and the queue group that the queue is associated with. Specifically, the skills assigned on the queue PLUS the skills assigned on the queue group make up the list of skills required by the call. A user must have ALL skills required by a call for them to be available for that call. If a user has more skills that required by the call but have at least the same skills as required by the call, the user is eligible to receive that call.
  </b-popover>

</div>
</template>

<style>
.popover {
  max-width: 512px; /* Max Width of the popover (depending on the container!) */
}
</style>
