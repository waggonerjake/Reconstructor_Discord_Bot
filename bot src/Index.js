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
        //Split every command by a comma and a space
        var args = message.content.substring(prefix.length).split(", ");

        switch (args[0].toLowerCase())
        {
            case "test":
                message.channel.send("Testing! Testing! 1...2...3");
                break;
            case "create role":
                if(validateAuthor(message.member))
                {
                    args[2] = validateColor(args[2]);
                    createARole(message, args);
                }
                break;
            default:
                    message.channel.send("Sorry, I didnt get that...");
        }
    }
});

//Used to check if the author of the message has the correct permission to manange roles
function validateAuthor(author)
{
    //Params: Permission, explicit(Depreceated), Admin. Override?, Owner Override?
    author.hasPermission("MANAGE_ROLES", false, true, true)
}

function createARole(message, args) 
{
    message.guild.createRole(
        {
            name: args[1],
            color: args[2].toUpperCase()
        })
        .then(role => message.channel.send(util.format("Created role with name \'%s\' and with color \'%s\'", role.name, getColorName(role.color))))
        .catch(console.error);
}

//Used to check if the color provided by the user is a valid color, if not, just set it to default
function validateColor(color)
{
    color = removeWhiteSpaceFromColor(color);
    return ((COLOR_NAMES.includes(color.toUpperCase()) || COLOR_NUMBERS.includes(color)) ? color : 'DEFAULT');
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