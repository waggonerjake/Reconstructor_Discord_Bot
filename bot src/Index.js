/*
    Goal: Manage Roles, Nicknames, and Channels. Be able to change nicknames based on roles, change
    role names, change the nickname of anyone, autoplace new members into roles, and
    add new roles/channles and delete roles/channels.
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

var currentRoles = [];
var currentRoleNames = [];
var currentMembers = [];
var currentUserIDs = [];

//Login token
const Token = ""; 

const prefix = "//"

//Creating the actual bot
var bot = new Discord.Client();

//When the bot is first activated, say "Ready" in the console
bot.on("ready", startUp =>
{
    console.log("Remove Token!");
});


//When we recieve a message, do this function
bot.on("message", message => {

    if (message.author.equals(bot.user))
    {
        return;
    }

    if (message.content.startsWith(prefix))
    {
        //Setting member variable to the last sent message
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

            case "create role":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_ROLES");
                if (doesUserHavePermission)
                {
                    (command[2]) ? (command[2] = validateColor(command[2])) : (command[2] = 'DEFAULT');
                    createARole(command);
                }
                break;

            case "delete role":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_ROLES");
                if (doesUserHavePermission)
                {
                    validateRole(command[1]) ? deleteARole(command) : message.reply("Please choose a valid role!");
                }
                break;

            case "show roles":
                message.reply(rolesToString() + " are the current roles");
                break;

            case "change nickname":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_NICKNAMES");
                if (doesUserHavePermission)
                {
                    var unwantedCharacters = ["<", ">", "!"];
                    command[1] = removeUnwantedCharacters(command[1], unwantedCharacters);
                    validateUser(command[1]) ? changeANickname(command) : message.reply("Please choose a valid member!");
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
    var roleCollection = currentMessage.guild.roles;
    var keysToRoles = roleCollection.keyArray();
    var numberOfRoles = keysToRoles.length;

    for (i = 1; i < numberOfRoles; ++i)
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

function validateColor(color)
{
    color = removeWhiteSpace(color);
    return ((COLOR_NAMES.includes(color.toUpperCase()) || COLOR_NUMBERS.includes(color)) ? color : 'DEFAULT');
}

function removeWhiteSpace(word)
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
        .then(role => currentMessage.reply(util.format("Created role with name \'%s\' and with color \'%s\'", role.name, getColorName(role.color))))
        .catch(console.error);
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
    var role = getRoleFromName(command[1]);
    role.delete()
        .then(deleted => currentMessage.reply(util.format("\'%s\' was deleted. It will be missed.", deleted.name)))
        .catch(console.error);
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

    if (validateUserToUserNameChange(command[2]))
    {
        command[2] = changeNicknameToAnotherUser(command[2]);
    }

    changedMember.setNickname(command[2])
        .then(success => currentMessage.reply(changedMember.user.username + " has been renamed to " + command[2]),
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
        inputtedUserID[i] = inputtedUserID[i].substring(1)
        inputtedUserID[i] = "<@!" + inputtedUserID[i] + ">";
    }

    return inputtedUserID;
}

bot.login(Token);
