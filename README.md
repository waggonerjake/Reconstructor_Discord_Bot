# What is the 'Reconstructor' bot?
This bot allows the user to change nicknames, add and delete roles, and add and delete channels.
# How do I use this bot?
Each command must start with two // (two forward slashes) then followed directly by the command, no space needed.
You type the command, then seperate each property with a comma (,) and a space.
# Commands
## Create a role: 
##### Command: 
//crro, ROLE NAME, ROLE COLOR
##### Description:
Allows the user to create a role in the server.
#### Permission:
Must be able to **manage roles** or be an **administrator**.
##### Properties and Usage:
Example: //crro, New Role, red

The first property is the role name. If no name is given, it will not create a role. 
The second property is the role color. If no color is given, it will default to the default color (ligth grey).
##### Acceptable Colors: 
default, aqua, green, blue, purple, pink, gold, red, grey, darker grey, navy, dark aqua, dark green, dark blue, dark purple, dark pink, dark gold, dark orange, dark red, light grey, and dark navy.
## Delete a role: 
#### Command:
//dero, ROLE NAME
#### Description:
Allows the user to delete *valid* roles in the server.
#### Permission:
Must be able to **manage roles** or be an **administrator**.
#### Properties and Usage:
Example: //dero, New Role

The first property is the name of the role the user wishes to delete. If no name is given, it will not delete a role.
## Show all roles:
#### Command:
//shro
#### Description:
Allows the user to show all the roles that are available in the server.
#### Permission:
Does not require special permissions.
#### Properties and Usage:
Example: //shro

There are no extra properties, only the command exists.
## Change User's Nickname:
#### Command:
//chnn, @USER TO BE CHANGED, NAME TO CHANGE TO
#### Description:
Allows the user to change any user's nickname (with respect to role placement, if any).
#### Permission:
Must be able to **manage nicknames** or be an **administrator**. *Does not allow changing of the server owner's nickname.*
#### Properties and Usage:
Example: //chnn, @fakeusername, moderator

Example: //chnn, @fakeusername, @anotherfakeusername

The first property is the @ of the user you would like to change the name of. If no user is entered, it will not change a nickname.
The second property can be either the name of you would like to change it to, or the @ of another member which means that the user can give the first member the second member's nickname. This allows the user to copy nicknames if they so please to do so.
**_When using this command please note that when you select the user's @ it will autoplace a space after. To make it work correctly, replace this space with a comma (,) then a space afterwards. (Since each command is seperated by a comma and a space)_**
## Rename a role:
#### Command:
//rero, ROLE TO BE RENAMED, NEW NAME
#### Description:
Allows the user to rename a *valid* role in the server, (with respect to role placement, if any).
#### Permission:
Must be able to **manage roles** or be an **administrator**.
#### Properties and Usage:
Example: //rero, New Role, Even Newer Role

The first property is the role that already exists that the user would like to change the name of. If no name/invalid name is given, it will not rename a role.
The second property is the new name you'd like to give to that role. If no name is given, it will not rename the role.
## Change Role Color:
#### Command:
//chroco, ROLE NAME, NEW ROLE COLOR
#### Description:
Allows the user to change the current color of an exsisting role in the server.
#### Permission:
Must be able to **manage roles** or be an **administrator**.
#### Properties and Usage:
Example: //chroco, New Role, blue

The first property is the *existing* role's name that you would like to change the color of. If no name is given, no role will have its color changed. The second property is the new color you would like to set the role to. If no color is entered it will not change the role's color, and if an invalid color is entered it will use the default color.
##### Acceptable Colors: 
default, aqua, green, blue, purple, pink, gold, red, grey, darker grey, navy, dark aqua, dark green, dark blue, dark purple, dark pink, dark gold, dark orange, dark red, light grey, and dark navy.
## Set AutoAssign Role
#### Command:
//aaro, ROLE NAME
#### Description:
Allows the user to set the autoassign role, so when a new user joins the server, they will be automatically placed into this role.
#### Permission:
Must be able to **manage roles** or be an **administrator**.
#### Properties and Usage:
Example: //aaro, New Role

The first property is the *existing* role name that you would like to be the auto assign role. If no name or an invalid name is given, no role will be set as the auto assign role.
## Show Auto Assign Role:
#### Command:
//shaaro
#### Description:
Allows the user to show the auto assign role name.
#### Permission:
Does not require special permissions.
#### Properties and Usage:
Example: //shaaro

There are no extra properties, only the command exists.
## Create a Text Channel:
#### Command:
//crtech, CHANNEL NAME
#### Description:
Allows the user to create a new text channel.
#### Permission:
Must be able to **manage channels** or be an **administrator**.
#### Properties and Usage:
Example: //crtech, New text channel

The first property is the name of the text channel you are creating. If no name is entered, no channel will be created.
## Create a Voice Channel:
#### Command:
//crvoch, CHANNEL NAME
#### Descrpition:
Allows the user to create a new voice channel.
#### Permission:
Must be able to **manage channels** or be an **administrator**.
#### Properties and Usage:
Example: //crvoch, New voice channel

The first property is the name of the voice channel you are creating. If no name is entered, no channel will be created.
## Create a Channel Category:
#### Command:
//crcat, CATEGORY NAME
#### Description:
Allows the user to create a new channel category.
#### Permission:
Must be able to **manage channels** or be an *administrator**.
#### Properties and Usage:
Example: //crcat, New Category

The first property is the name of the category you are creating. If no name is entered, no channel will be created.
## Delete a Channel or Category:
#### Command:
//dech, CHANNEL OR CATEGORY NAME
#### Description:
Allows the user to delete channels or categories.
#### Permission:
Must be able to **manage channels** or be an **administrator**.
#### Properties and Usage:
Example: //dech, New Category

Example: //dech, New voice channel

The first property is the name of the channel or category you are deleting. If no name is entered, no channel will be deleted.







