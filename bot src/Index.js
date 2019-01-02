/*
    Goal: Manage Roles, Nicknames, and Channels. Be able to change nicknames based on roles, change
    role names, change the nickname of anyone, autoplace new members into roles, and
    add new roles/channels and delete roles/channels.

    Completed:
    Add/Delete Roles
    Change Role Names
    Change Role Colors
    Change Any Nickname
    Autoplace Members into Roles
*/

//Require Discord.js
const Discord = require("discord.js");

//Require util
const util = require('util');

const COLOR_NAMES = ['DEFAULT', 'AQUA', 'GREEN', 'BLUE', 'PURPLE', 'LUMINOUS_VIVID_PINK', 'GOLD', 'ORANGE', 'RED', 'GREY', 'DARKER_GREY', 'NAVY', 'DARK_AQUA',
    'DARK_GREEN','DARK_BLUE','DARK_PURPLE','DARK_VIVID_PINK','DARK_GOLD','DARK_ORANGE','DARK_RED','DARK_GREY','LIGHT_GREY','DARK_NAVY'];

const COLOR_NUMBERS = [0, 1752220, 3066993, 3447003, 10181046, 15277667, 15844367, 15105570, 15158332, 9807270, 8359053, 3426654, 1146986, 2067276, 2123412, 7419530,
    11342935, 12745742, 11027200, 10038562, 9936031, 12370112, 2899536];

var currentMessage;
var autoAssignedRole;

var currentRoles = [];
var currentRoleNames = [];
var currentMembers = [];
var currentUserIDs = [];

const Token = "NTA0ODE5NzkxMDAyMDc1MTM3.DseOEQ.QP_THfvEdNN0kAUN5E_7NlB3fJo"; 

const prefix = "//"

//Creating the actual bot
var bot = new Discord.Client();

//When the bot is first activated
bot.on("ready", startUp =>
{
    console.log("Remove Token!");
});

//When a new member joins the server
bot.on("guildMemberAdd", newMember =>
{
    var currentGuild = newMember.guild;
    newMember.send("You have joined the '" + currentGuild.name + "' server.");

    autoAssignNewMember(newMember);
});

function autoAssignNewMember(newMember)
{
    var currentGuild = newMember.guild;

    if (validateRole(autoAssignedRole))
    {
        var automaticRole = currentGuild.roles.find(role => role.name === autoAssignedRole);
        newMember.addRole(automaticRole)
            .then(success => newMember.send("You have also been autoplaced in the " + autoAssignedRole + " role."),
            failure => currentGuild.owner.send("There is no autoassigned role set yet!"));
    }
}

//When we recieve a message, do this function
bot.on("message", message => {

    if (message.author.equals(bot.user))
    {
        return;
    }

    if (message.content.startsWith(prefix))
    {
        currentMessage = message;

        currentRoles = getRoles();
        currentRoleNames = getRoleNames();
        currentMembers = getAllMembers();
        currentUserIDs = getUserIDs();

        var doesUserHavePermission = false;
        var tryingToCommand = false;

        var command = message.content.substring(prefix.length).split(", ");

        switch (command[0].toLowerCase())
        {
            case "test":
                message.reply("Testing! Testing! 1...2...3");
                break;

            case "crro":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_ROLES");
                if (doesUserHavePermission)
                {
                    if (validateRoleName(command[1]))
                    {
                        (command[2]) ? (command[2] = setCorrectColor(command[2])) : (command[2] = 'DEFAULT');
                        createARole(command);
                    }
                    else
                    {
                        message.reply("Pleae choose a valid name for the role!");
                    }
                }
                break;

            case "dero":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_ROLES");
                if (doesUserHavePermission)
                {
                    validateRole(command[1]) ? deleteARole(command) : message.reply("Please choose a valid role!");

                }
                break;

            case "shro":
                message.reply(rolesToString() + " are the current roles");
                break;

            case "chnn":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_NICKNAMES");
                if (doesUserHavePermission)
                {
                    var unwantedCharacters = ["<", ">", "!"]; //When you @someone, there is a <@!ID>, so we remove the <> and !
                    command[1] = removeUnwantedCharacters(command[1], unwantedCharacters);
                    validateUser(command[1]) ? changeANickname(command) : message.reply("Please choose a valid member!");
                }
                break;

            case "rero":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_ROLES");
                if (doesUserHavePermission)
                {
                    if (validateRoleName(command[2]))
                    {
                        validateRole(command[1]) ? changeRoleName(command) : message.reply("Please choose a valid role!");
                    }
                    else
                    {
                        message.reply("Please choose a valid name to rename this role to!");
                    }
                }
                break;

            case "chroco":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_ROLES");
                if (doesUserHavePermission) {
                    if (command[2])
                    {
                        command[2] = setCorrectColor(command[2]);
                        validateRole(command[1]) ? changeRoleColor(command) : message.reply("Please choose a valid role!");
                    }
                    else
                    {
                        message.reply("Please enter a color!");
                    }
                }
                break;

            case "aaro":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_ROLES");
                if (doesUserHavePermission)
                {
                    validateRole(command[1]) ? setAutoRole(command) : message.reply("Please choose a valid role!");
                }
                break;

            case "shaaro":
                try
                {
                    message.reply("The autoassign role is: '" + autoAssignedRole.toLowerCase() + "'.");
                }
                catch (err)
                {
                    message.reply("There is no autoassign role yet.");
                }
                break;

            default:
                    message.reply("Sorry, I didnt get that...");
        }
        if (!doesUserHavePermission && tryingToCommand)
        {
            message.reply("You do not have the required permissions to perform that action.");
        }
    }
});

//Gets the actual role object, to retrieve names of roles, use getRoleNames()
function getRoles()
{
    var presentRoles = [];
    var roleCollection = currentMessage.guild.roles
    var keysToRoles = roleCollection.keyArray();
    var numberOfRoles = keysToRoles.length;

    for (i = 1; i < numberOfRoles; ++i) //Starts @ 1 instead of 0 to exclude the '@everyone' role
    {
        presentRoles.push(roleCollection.get(keysToRoles[i]));
    }

    return presentRoles;
}

function getRoleNames()
{
    var presentRoleNames = [];
    for (i = 0; i < currentRoles.length; ++i)
    {
        presentRoleNames.push(currentRoles[i].name.toLowerCase());
    }
    return presentRoleNames;
}

function getAllMembers()
{
    var presentMembers = [];
    var memberCollection = currentMessage.guild.members;
    var keysToMembers = memberCollection.keyArray();
    var numberOfMembers = keysToMembers.length;

    for (i = 0; i < numberOfMembers; ++i)
    {
        presentMembers.push((memberCollection.get(keysToMembers[i])));
    }
    return presentMembers;
}

function getUserIDs()
{
    var presentUserIDs = [];
    for (i = 0; i < currentMembers.length; ++i)
    {
        presentUserIDs.push("@" + currentMembers[i].user.id);
    }
    return presentUserIDs;
}

function validateAuthor(action)
{
    var author = currentMessage.member;
    //Params: Permission, explicit(Depreceated), Admin. Override?, Owner Override?
    return author.hasPermission(action, false, true, true);
}

//Check if the role is blank
function validateRoleName(name)
{
    var isRoleValid = false;
    name = name.replace(/\s/g, "");
    (name === "") ? isRoleValid = false : isRoleValid = true;
    return isRoleValid;
}

function setCorrectColor(color)
{
    color = switchWhiteSpaceWithUnderscore(color);
    color = validatePink(color);
    return ((COLOR_NAMES.includes(color.toUpperCase()) || COLOR_NUMBERS.includes(color)) ? color : 'DEFAULT');
}

function validatePink(color)
{
    color = color.toLowerCase();

    if (!COLOR_NAMES.includes(color.toUpperCase()) && color.includes("pink") && !color.includes("dark"))
    {
        color = "LUMINOUS_VIVID_PINK";
    }

    if (!COLOR_NAMES.includes(color.toUpperCase()) && color.includes("pink") && color.includes("dark"))
    {
        color = "DARK_VIVID_PINK";
    }

    color = color.toUpperCase();

    return color;
}

function switchWhiteSpaceWithUnderscore(word)
{
    //The 'g' in the regex function means global, and this means
    //do not stop after the first instance of the character, find
    //all of them
    return word.replace(/\s/g, "_");
}

function createARole(command)
{
    currentMessage.guild.createRole(
        {
            name: command[1],
            color: command[2].toUpperCase()
        })
        .then(success => currentMessage.reply(util.format("Created role with name \'%s\' and with color \'%s\'", success.name, getColorName(success.color))),
        failure => currentMessage.reply("Could not create this role."))
}

//Used to 'map' the color decimal value to the string value
function getColorName(decimal)
{
    var index = COLOR_NUMBERS.findIndex(element => element === decimal);
    return COLOR_NAMES[index].toLowerCase().replace(/_/g, " ");
}

function validateRole(role)
{
    var doesRoleExist = false;
    (role) ? doesRoleExist = currentRoleNames.includes(role.toLowerCase()) : doesRoleExist = false;
    return doesRoleExist;
}

function deleteARole(command)
{
    var role = getRoleFromName(command[1].toLowerCase());

    role.delete()
        .then(success => currentMessage.reply(util.format("\'%s\' was deleted. It will be missed.", success.name)),
        failure => currentMessage.reply("You cannot delete this role."));
}

function getRoleFromName(roleName)
{
    var index = currentRoleNames.findIndex(element => element === roleName);
    return currentRoles[index];
}

function rolesToString()
{
    var roleNames = "";
    for (i = 0; i < currentRoleNames.length; ++i)
    {
        (i < currentRoleNames.length - 1) ? (roleNames = roleNames + "'" + currentRoleNames[i] + "', ") : (roleNames = roleNames + "'" + currentRoleNames[i] + "'");
    }
    return roleNames;
}

function removeUnwantedCharacters(word, ListOfCharactersToRemove)
{
    for (i = 0; i < ListOfCharactersToRemove.length; ++i)
    {
        var regexExpression = new RegExp(ListOfCharactersToRemove[i], "g");
        word = word.replace(regexExpression, "");
    }
    return word;
}

function validateUser(userID)
{
    var doesUserExist = false;
    (userID) ? doesUserExist = currentUserIDs.includes(userID) : doesUserExist = false;
    return doesUserExist;
}

function changeANickname(command)
{
    var changedMember = getMemberFromID(command[1]);
    var newNickname = command[2];
    var unwantedCharacters = ["<", ">"];

    if (validateUserToUserNameChange(newNickname))
    {
        newNickname = changeNicknameToAnotherUser(newNickname);
    }

    command[2] = removeUnwantedCharacters(command[2], unwantedCharacters)

    if (currentUserIDs.includes(command[2]))
    {
        return currentMessage.reply("Sorry, the user you are copying the nickname from does not have a nickname.");
    }

        changedMember.setNickname(newNickname)
            .then(success => currentMessage.reply(changedMember.user.username + " has been renamed to " + newNickname),
            failure => currentMessage.reply("Sorry, I cannot change this user's nickname..."));
}

function getMemberFromID(userTag)
{
    var index = currentUserIDs.findIndex(element => element === userTag);
    return currentMembers[index];
}

//Used if someone uses '@' they enter the name change
function changeNicknameToAnotherUser(otherUsersNickname)
{
    var unwantedCharacters = ["<", ">", "!"];
    otherUsersNickname = removeUnwantedCharacters(otherUsersNickname, unwantedCharacters);
    (currentUserIDs.includes(otherUsersNickname)) ? otherUsersNickname = getMemberFromID(otherUsersNickname).nickname : otherUsersNickname;
    return otherUsersNickname;
}

function validateUserToUserNameChange(userIDInput)
{
    return createListOfUserInputtedIDs().includes(userIDInput)
}

function createListOfUserInputtedIDs()
{
    var inputtedUserID = currentUserIDs.concat(inputtedUserID);

    for (i = 0; i < currentUserIDs.length; ++i)
    {
        inputtedUserID[i] = inputtedUserID[i].substring(1) //Cuts off @ sign of the id
        inputtedUserID[i] = "<@!" + inputtedUserID[i] + ">";
    }

    return inputtedUserID;
}

function changeRoleName(command)
{
    var currentRole = getRoleFromName(command[1].toLowerCase());
    var previousRoleName = command[1];
    var nameToChangeTo = command[2];

    currentRole.setName(nameToChangeTo)
        .then(success => currentMessage.reply(util.format("Changed the name of role \'%s\' to \'%s\'", previousRoleName, nameToChangeTo)),
        failure => currentMessage.reply("Cannot renanme that role."));
}

function changeRoleColor(command)
{
    var roleBeingChanged = getRoleFromName(command[1].toLowerCase());
    var newColorName = command[2].toLowerCase().replace(/_/g, " ");

    roleBeingChanged.setColor(command[2])
        .then(success => currentMessage.reply(util.format("Changed the color of \'%s'\ to \'%s\'", command[1], newColorName)),
        failure => currentMessage.reply("Cannot change the color of that role."));
}

function setAutoRole(command)
{
    autoAssignedRole = command[1];
    currentMessage.reply(command[1] + " has been set as the auto assigned role.");
}

bot.login(Token);
