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
Allows the user to create a role in the server, if they have the permission to do so. (Managing roles or Administrator)
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
Allows the user to delete *valid* roles in the server, if they have the permission to do so. (Managing roles or Administrator)
#### Properties and Usage:
Example: //dero, New Role

The first property is the name of the role the user wishes to delete. If no name is given, it will not delete a role.
## Show all roles
#### Command:
//shro
#### Description:
Allows the user to show all the roles that are available in the server. (Does not require permission)
#### Properties and Usage:
Example: //shro

There are no extra properties, only the command exists.
## Change User's Nickname
#### Command:
//chnn, @USER TO BE CHANGED, NAME TO CHANGE TO
#### Description:
Allows the user to change any user's nickname (with respect to role placement, if any), if they have the permission to do so. (Manage nicknames or Administrator)
#### Properties and Usage:
Example: //chnn, @fakeusername, moderator

Example: //chnn, @fakeusername, @anotherfakeusername

The first property is the @ of the user you would like to change the name of. If no user is entered, it will not change a nickname.
The second property can be either the name of you would like to change it to, or the @ of another member which means that the user can give the first member the second member's nickname. This allows the user to copy nicknames if they so please to do so.
## Rename a role:
#### Command:
//rero, ROLE TO BE RENAMED, NEW NAME
#### Description:
Allows the user to rename a *valid* role in the server, (with respect to role placement, if any), if they have permission to do so. (Manage roles or Administrator)
#### Properties and Usage:
Example: //rero, New Role, Even Newer Role

The first property is the role that already exists that the user would like to change the name of. If no name/invalid name is given, it will not rename a role.
The second property is the new name you'd like to give to that role. If no name is given, it will not rename the role.












