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
    Rename Roles
    Change role colors
    Add Channels
    Delete Channels
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

var currentMembers = [];
var currentUserIDs = [];

const Token = "";

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
                    if (validateName(command[1]))
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
                    validateRole(command[1]) ? deleteARole(command[1]) : message.reply("Please choose a valid role!");

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
                    if (validateName(command[2]))
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
                    validateRole(command[1]) ? setAutoRole(command[1]) : message.reply("Please choose a valid role!");
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

            case "crtech":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_CHANNELS");
                if (doesUserHavePermission)
                {
                    validateName(command[1]) ? createChannelType(command[1], "text") : message.reply("Please choose a valid name!");
                }
                break;

            case "crvoch":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_CHANNELS");
                if (doesUserHavePermission)
                {
                    validateName(command[1]) ? createChannelType(command[1], "voice") : message.reply("Please choose a valid name!");
                }
                break;

            case "crcat":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_CHANNELS");
                if (doesUserHavePermission)
                {
                    validateName(command[1]) ? createChannelType(command[1], "category") : message.reply("Please choose a valid name!");
                }
                break;

            case "dech":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_CHANNELS");
                if (doesUserHavePermission)
                {
                    validateChannel(command[1]) ? deleteChannel(command[1]) : message.reply("Please choose a valid channel!");
                }
                break;

            default:
                    message.reply("Sorry, I didnt understand that.");
        }
        if (!doesUserHavePermission && tryingToCommand)
        {
            message.reply("You do not have the required permissions to perform that action.");
        }
    }
});

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
function validateName(name)
{
    var isRoleValid = false;

    try
    {
        name = name.replace(/\s/g, "");
    }
    catch (err)
    {
        return false;
    }

    (name === "") ? isRoleValid = false : isRoleValid = true;
    return isRoleValid;
}

function validateRole(role)
{
    var doesRoleExist = false;
    var currentRoles = currentMessage.guild.roles;
    (role) ? doesRoleExist = currentRoles.find(element => element.name.toLowerCase() === role.toLowerCase()) : doesRoleExist = false;
    return doesRoleExist;
}

function validateUser(userID)
{
    var doesUserExist = false;
    (userID) ? doesUserExist = currentUserIDs.includes(userID) : doesUserExist = false;
    return doesUserExist;
}

function validateUserToUserNameChange(userIDInput)
{
    return createListOfUserInputtedIDs().includes(userIDInput)
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

function validateChannel(channel)
{
    var validChannels = currentMessage.guild.channels;
    return Boolean(validChannels.find(element => element.name === channel));
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

function deleteARole(roleName)
{
    var currentRoles = currentMessage.guild.roles
    var roleToDelete = currentRoles.find(element => element.name.toLowerCase() === roleName.toLowerCase());

    roleToDelete.delete()
        .then(success => currentMessage.reply(util.format("\'%s\' was deleted. It will be missed.", success.name)),
        failure => currentMessage.reply("You cannot delete this role."));
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

function changeRoleName(command)
{
    var previousRoleName = command[1];
    var nameToChangeTo = command[2];
    var currentRoles = currentMessage.guild.roles;
    var roleBeingChanged = currentRoles.find(element => element.name.toLowerCase() === previousRoleName.toLowerCase());

    roleBeingChanged.setName(nameToChangeTo)
        .then(success => currentMessage.reply(util.format("Changed the name of role \'%s\' to \'%s\'", previousRoleName, nameToChangeTo)),
        failure => currentMessage.reply("Cannot renanme that role."));
}

function changeRoleColor(command)
{
    var currentRoles = currentMessage.guild.roles;
    var roleBeingChanged = currentRoles.find(element => element.name.toLowerCase() === command[1].toLowerCase());
    var newColorName = command[2].toLowerCase().replace(/_/g, " ");

    roleBeingChanged.setColor(command[2])
        .then(success => currentMessage.reply(util.format("Changed the color of \'%s'\ to \'%s\'", command[1], newColorName)),
        failure => currentMessage.reply("Cannot change the color of that role."));
}

function setAutoRole(roleName)
{
    autoAssignedRole = roleName;
    currentMessage.reply(roleName + " has been set as the auto assigned role.");
}

function createChannelType(name, type)
{
    currentMessage.guild.createChannel(name, type)
        .then(success => currentMessage.reply(util.format("A %s channel with the name \'%s'\ was created", type, name)),
        failure => currentMessage.reply("Cannot create that channel."));
}

function deleteChannel(channelName)
{
    var validChannels = currentMessage.guild.channels;
    var channelToDelete = validChannels.find(element => element.name === channelName);

    channelToDelete.delete()
        .then(success => currentMessage.reply(util.format("The channel \'%s'\ has been removed", channelName)),
        failure => currentMessage.reply("Cannot delete that channel."));
}

function rolesToString()
{
    var roleNames = "";
    var currentRolesArray = currentMessage.guild.roles.array();
    
    for (i = 0; i < currentRolesArray.length; ++i)
    {
        (i < currentRolesArray.length - 1) ? (roleNames = roleNames + "'" + currentRolesArray[i].name + "', ") : (roleNames = roleNames + "'" + currentRolesArray[i].name + "'");
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

function createListOfUserInputtedIDs()
{
    var inputtedUserID = currentUserIDs.concat(inputtedUserID);

    for (i = 0; i < currentUserIDs.length; ++i) {
        inputtedUserID[i] = inputtedUserID[i].substring(1) //Cuts off @ sign of the id
        inputtedUserID[i] = "<@!" + inputtedUserID[i] + ">";
    }
    return inputtedUserID;
}

bot.login(Token);
