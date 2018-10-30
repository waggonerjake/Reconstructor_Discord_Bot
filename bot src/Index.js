//Require Discord.js
const Discord = require("discord.js");
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
    if (message.content == "hello")
    {
        message.channel.sendMessage("Hi, there!");
    }
    if (!message.content.startsWith(prefix))
    {
        return;
    }
    else
    {
        var args = message.content.substring(prefix.length).split(" ");

        switch (args[0])
        {
            case "ping":
                message.channel.sendMessage("pong");
                break;
            case "CreateRole":
                var creatingRole = true;
                var creator = message.author;
                message.channel.sendMessage("What would you like the role to be called?")
                break;
            default:
                if (!creatingRole)
                    message.channel.sendMessage("Sorry, I didnt get that...");
        }
    }
    if(creatingRole == true)
    {
        if (message.author.equals(creator))
        {
            message.guild.createRole(
                {
                    name: message.content
                })
                .then(role => message.channel.sendMessage("Created role with the name ${role.name}"))
                .catch(console.error)
        }
    }
});

//Login the bot using the token generated from discord
bot.login(Token);