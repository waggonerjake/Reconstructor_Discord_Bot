/*
    Goal: Manage Roles, Nicknames, and Channels. Be able to change nicknames based on roles, change
    role names, change the nickname of anyone, autoplace new members into roles, and
    add new roles/delete roles/channels.
*/

//Require Discord.js
const Discord = require("discord.js");

const util = require('util');

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
        var args = message.content.substring(prefix.length).split(" ");

        switch (args[0])
        {
            case "ping":
                message.channel.send("pong");
                break;
            case "CreateRole":
                createARole(message, args);
                break;
            default:
                    message.channel.send("Sorry, I didnt get that...");
        }
    }
});

function createARole(message, args) 
{
    message.guild.createRole(
        {
            name: args[1],
            color: args[2]
        })
        .then(role => message.channel.send(util.format("Created role with name %s and with color %s",role.name,role.color)))
           .catch(console.error);
}
//Login the bot using the token generated from discord
bot.login(Token);