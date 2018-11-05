/*
    Goal: Manage Roles, Nicknames, and Channels. Be able to change nicknames based on roles, change
    role names, change the nickname of anyone, autoplace new members into roles, and
    add new roles/delete roles/channels.
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

//Login token
const Token = "NTA0ODE5NzkxMDAyMDc1MTM3.DrKrTQ.d8B7SRdvru4eZvzIVERquYJ_qx8";

const prefix = "//"

//Creating the actual bot
var bot = new Discord.Client();

//When the bot is first activated, say "Ready" in the console
bot.on("ready", startUp =>
{
    console.log("Ready");
});

//When we recieve a message, do this function
bot.on("message", message =>
{

    if (message.author.equals(bot.user))
    {
        return;
    }

    if (message.content.startsWith(prefix))
    {
        //Setting member variable to the last sent message
        currentMessage = message;

        //get the roles, and their names before they are even needed
        currentRoles = getRoles();
        currentRoleNames = getRoleNames();

        //Used for permission check
        var doesUserHavePermission = false;
        var tryingToCommand = false;

        //Split every command by a comma and a space
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
                    //Check if the user even inputed a color
                    (command[2]) ? (command[2] = validateColor(command[2])) : (command[2] = 'DEFAULT');
                    createARole(command);
                }
                break;

            case "delete role":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_ROLES");
                //console.log(currentRoles);
                //console.log(currentRoleNames);
                if (doesUserHavePermission)
                {
                    validateRole(command[1]) ? deleteARole(command) : message.reply("Please choose a valid role!");
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

function createARole(command) {
    currentMessage.guild.createRole(
        {
            name: command[1],
            color: command[2].toUpperCase()
        })
        .then(role => currentMessage.reply(util.format("Created role with name \'%s\' and with color \'%s\'", role.name, getColorName(role.color))))
        .catch(console.error);
}

function deleteARole(command)
{
        console.log("Role exists. Pretend its deleted");
        //TO DO: Have it delete a role that is in the list of roles
}

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
    for (i = 1; i < currentRoles.length; ++i)
    {
        presentRoleNames.push(currentRoles[i].name.toLowerCase());
    }
    return presentRoleNames;
}

//Used to check if the author of the message has the correct permission to manange roles
function validateAuthor(action) {
    var author = currentMessage.member;
    switch (action) {
        case "MANAGE_ROLES":
            //Params: Permission, explicit(Depreceated), Admin. Override?, Owner Override?
            return author.hasPermission(action, false, true, true)
            break;

        default:
            return false;
    }
}

//Used to check if the color provided by the user is a valid color, if not, just set it to default
function validateColor(color)
{
    color = removeWhiteSpaceFromColor(color);
    return ((COLOR_NAMES.includes(color.toUpperCase()) || COLOR_NUMBERS.includes(color)) ? color : 'DEFAULT');
}

//Used to check if the role entered by the user is a valid role
function validateRole(role)
{
    var doesRoleExist = false;
    (role) ? doesRoleExist = currentRoleNames.includes(role.toLowerCase()) : doesRoleExist = false;
    return doesRoleExist;
}

function removeWhiteSpaceFromColor(color)
{
    //The 'g' in the regex function means global, and this means
    //do not stop after the first instance of the character, find
    //all of them
     return color.replace(/\s/g, "_");
}

//Used to 'map' the color decimal value to the string value
function getColorName(decimal)
{
    var index = COLOR_NUMBERS.findIndex(element => element === decimal);
    return COLOR_NAMES[index].toLowerCase().replace(/_/g, " ");
}

//Login the bot using the token generated from discord
bot.login(Token);
