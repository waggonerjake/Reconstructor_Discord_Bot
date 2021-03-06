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
    Rename Channels
    Move channels to categories
    Remove channels from category

    TODO:
    Rename all members based on role
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

const prefix = "//";

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
        //Typically, command[0] is the command, command[1] is the name of role/channel/person to change/create/delete, and
        //if there is a command[2] it is the new name/color/parent

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
                        if (validateDuplicates("role", command[1]))
                        {
                            (validateName(command[2])) ? (command[2] = setCorrectColor(command[2])) : (command[2] = 'DEFAULT');
                            createARole(command);
                        }
                        else
                        {
                            message.reply("A role named \'" + command[1] + "\' already exists! Either rename the current one or choose a unique name!");
                        }
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
                        if (validateDuplicates("role", command[2]))
                        {
                            validateRole(command[1]) ? changeRoleName(command) : message.reply("Please choose a valid role!");
                        }
                        else
                        {
                            message.reply("A role named \'" + command[2] + "\' already exists! Either rename the current one or choose a unique name!");
                        }
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
                    if (validateName(command[2]))
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
                    if (validateName(command[1]))
                    {
                        validateDuplicates("text", command[1]) ? createChannelType(command[1], "text") : message.reply("A text channel named \'" + command[1] +
                                                                                    "\' already exists! Either rename the current one or choose a unique name!");
                    }
                    else
                    {
                        message.reply("Please choose a valid name!");
                    }
                }
                break;

            case "crvoch":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_CHANNELS");
                if (doesUserHavePermission)
                {
                    if (validateName(command[1]))
                    {
                        validateDuplicates("voice", command[1]) ? createChannelType(command[1], "voice") : message.reply("A text channel named \'" + command[1] +
                                                                                    "\' already exists! Either rename the current one or choose a unique name!");
                    }
                    else
                    {
                        message.reply("Please choose a valid name!");
                    }
                }
                break;

            case "crcat":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_CHANNELS");
                if (doesUserHavePermission)
                {
                    if (validateName(command[1]))
                    {
                        validateDuplicates("category", command[1]) ? createChannelType(command[1], "category") : message.reply("A text channel named \'" + command[1] +
                                                                            "\' already exists! Either rename the current one or choose a unique name!");
                    }
                    else
                    {
                        message.reply("Please choose a valid name!");
                    }
                }
                break;

            case "detech":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_CHANNELS");
                if (doesUserHavePermission)
                {
                    if (validateName(command[1]))
                    {
                        validateChannel(command[1]) ? deleteChannel(command[1], "text") : message.reply("Please choose a valid channel!");
                    }
                    else
                    {
                        message.reply("Please choose a valid name!");
                    }
                }
                break;

            case "devoch":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_CHANNELS");
                if (doesUserHavePermission)
                {
                    if (validateName(command[1]))
                    {
                        validateChannel(command[1]) ? deleteChannel(command[1], "voice") : message.reply("Please choose a valid channel!");
                    }
                    else
                    {
                        message.reply("Please choose a valid name!");
                    }
                }
                break;

            case "decat":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_CHANNELS");
                if (doesUserHavePermission)
                {
                    if (validateName(command[1]))
                    {
                        validateCategory(command[1]) ? deleteChannel(command[1], "category") : message.reply("Please choose a valid category!");
                    }
                    else
                    {
                        message.reply("Please choose a valid name!");
                    }
                }
                break;

            case "retech":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_CHANNELS");
                if (doesUserHavePermission)
                {
                    if (validateName(command[2]))
                    {
                        validateChannel(command[1]) ? renameChannel(command, "text") : message.reply("Please choose a valid channel!");
                    }
                    else
                    {
                        message.reply("Please choose a valid name!");
                    }
                }
                break;

            case "revoch":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_CHANNELS");
                if (doesUserHavePermission) {
                    if (validateName(command[2]))
                    {
                        validateChannel(command[1]) ? renameChannel(command, "voice") : message.reply("Please choose a valid channel!");
                    }
                    else
                    {
                        message.reply("Please choose a valid name!");
                    }
                }
                break;

            case "recat":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_CHANNELS");
                if (doesUserHavePermission) {
                    if (validateName(command[2]))
                    {
                            validateCategory(command[1]) ? renameChannel(command, "category") : message.reply("Please choose a valid category!");
                    }
                    else
                    {
                        message.reply("Please choose a valid name!");
                    }
                }
                break;

            case "chtecat":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_CHANNELS");
                if (doesUserHavePermission)
                {
                    setChannelCategory(command, "text");
                }
                break;

            case "chvocat":
                tryingToCommand = true;
                doesUserHavePermission = validateAuthor("MANAGE_CHANNELS");
                if (doesUserHavePermission)
                {
                    setChannelCategory(command, "voice");
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

//Check if the name is blank
function validateName(name)
{
    var isNameValid = false;

    try
    {
        name = name.replace(/\s/g, "");
    }
    catch (err)
    {
        return false;
    }

    (name === "") ? isNameValid = false : isNameValid = true;
    return isNameValid;
}

function validateRole(roleName)
{
    var doesRoleExist = false;
    var currentRoles = currentMessage.guild.roles;
    (roleName) ? doesRoleExist = currentRoles.find(element => element.name.toLowerCase() === roleName.toLowerCase()) : doesRoleExist = false;
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

function setCorrectColor(colorName)
{
    colorName = colorName.replace(/\s/g, "_");
    colorName = validatePink(colorName);
    return ((COLOR_NAMES.includes(colorName.toUpperCase()) || COLOR_NUMBERS.includes(colorName)) ? colorName : 'DEFAULT');
}

function validatePink(colorName)
{
    colorName = colorName.toLowerCase();

    if (!COLOR_NAMES.includes(colorName.toUpperCase()) && colorName.includes("pink") && !colorName.includes("dark"))
    {
        colorName = "LUMINOUS_VIVID_PINK";
    }

    if (!COLOR_NAMES.includes(colorName.toUpperCase()) && colorName.includes("pink") && colorName.includes("dark"))
    {
        colorName = "DARK_VIVID_PINK";
    }

    colorName = colorName.toUpperCase();

    return colorName;
}

function validateChannel(channelName)
{
    var validChannels = currentMessage.guild.channels;
    return Boolean(validChannels.find(element => element.name.toLowerCase() === channelName.toLowerCase()));
}

function validateCategory(categoryName)
{
    if (validateChannel(categoryName) === false)
    {
        return false;
    }

    var isCategory = false;
    validChannels = currentMessage.guild.channels;
    category = validChannels.find(element => element.name.toLowerCase() === categoryName.toLowerCase());
    (category.type === "category") ? isCategory = true : isCategory = false;
    return isCategory;
}

function validateDuplicates(type, name)
{
    var hasNoDuplicates = false;
    var duplicates = [];
    var validChannels;

    switch (type)
    {
        case "role":
            var currentRoles = currentMessage.guild.roles.array();
            for (i = 0; i < currentRoles.length; i++)
            {
                if (currentRoles[i].name.toLowerCase() === name.toLowerCase())
                {
                    duplicates.push(currentRoles[i]);
                }
            }
            break;
        case "text":
            validChannels = currentMessage.guild.channels.array();
            name = name.replace(/\s/g, "-"); //Text channels cannot have spaces
            for (i = 0; i < validChannels.length; i++)
            {
                if (validChannels[i].type !== "text")
                {
                    continue;
                }
                if (validChannels[i].name.toLowerCase() === name.toLowerCase())
                {
                    duplicates.push(validChannels[i]);
                }
            }
            break;
        case "voice":
            validChannels = currentMessage.guild.channels.array();
            for (i = 0; i < validChannels.length; i++)
            {
                if (validChannels[i].type !== "voice")
                {
                    continue;
                }
                if (validChannels[i].name.toLowerCase() === name.toLowerCase())
                {
                    duplicates.push(validChannels[i]);
                }
            }
            break;
        case "category":
            validChannels = currentMessage.guild.channels.array();
            for (i = 0; i < validChannels.length; i++)
            {
                if (validChannels[i].type !== "category")
                {
                    continue;
                }
                if (validChannels[i].name.toLowerCase() === name.toLowerCase())
                {
                    duplicates.push(validChannels[i]);
                }
            }
            break;
    }

    (duplicates.length > 0) ? hasNoDuplicates = false : hasNoDuplicates = true;

    return hasNoDuplicates;
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
    var currentRoles = currentMessage.guild.roles;
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

    command[2] = removeUnwantedCharacters(command[2], unwantedCharacters);

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

function deleteChannel(channelName, type)
{
    var channelToDelete = findChannel(channelName, type);

    channelToDelete.delete()
        .then(success => currentMessage.reply(util.format("The channel \'%s'\ has been removed", channelName)),
        failure => currentMessage.reply("Cannot delete that channel."));
}

function renameChannel(command, type)
{
    var currentChannelName = command[1];
    var newName = command[2];
    var channelToRename = findChannel(currentChannelName, type);

    channelToRename.setName(newName)
        .then(success => currentMessage.reply(util.format("The channel \'%s'\ has been renamed to \'%s'\. ", currentChannelName, newName)),
            failure => currentMessage.reply("Cannot rename that channel."));
}

function setChannelCategory(command, type)
{
    var channelName;
    var categoryName;
    var channel;
    var category;

    if (validateName(command[1]) === false)
    {
        return currentMessage.reply("Please choose a valid channel!");
    }

    channelName = command[1];
    channel = findChannel(channelName, type);

    if (command.length === 2)
    {
        removeFromCategory(channelName, channel);
    }

    else {

        if (validateName(command[2]) === false)
        {
            return currentMessage.reply("Please choose a valid category!");
        }

        categoryName = command[2];
        category = findChannel(categoryName, "category");

        if (validateChannel(channelName))
        {
            if (validateCategory(categoryName))
            {
                channel.setParent(category)
                    .then(success => currentMessage.reply(util.format("Placed the channel '\%s'\ in the category '\%s'\.", channelName, categoryName)),
                    failure => currentMessage.reply("Cannot place that channel in that category."));
            }
            else
            {
                currentMessage.reply("Please choose a valid category!");
            }
        }
        else
        {
            currentMessage.reply("Please choose a valid channel!");
        }
    }
}

function removeFromCategory(channelName, channel)
{
    if (validateChannel(channelName))
    {
        if (channel.parent !== null)
        {
            channel.setParent(null)
                .then(success => currentMessage.reply(util.format("Placed the channel '\%s'\ back at the top.", channelName)),
                failure => currentMessage.reply("Cannot remove that channel from that category."));
        }
        else
        {
            currentMessage.reply(util.format("The channel '\%s'\ is not in a category!", channelName));
        }
    }
    else
    {
        currentMessage.reply("Please choose a valid channel!");
    }
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

function findChannel(channelName, type)
{
    var validChannels = currentMessage.guild.channels.array();
    var channel;

    switch (type) {
        case "text":
            for (i = 0; i < validChannels.length; i++) {
                if (validChannels[i].type !== "text") {
                    continue;
                }
                if (validChannels[i].name.toLowerCase() === channelName.toLowerCase()) {
                    channel = validChannels[i];
                }
            }
            break;
        case "voice":
            for (i = 0; i < validChannels.length; i++) {
                if (validChannels[i].type !== "voice") {
                    continue;
                }
                if (validChannels[i].name.toLowerCase() === channelName.toLowerCase()) {
                    channel = validChannels[i];
                }
            }
            break;
        case "category":
            for (i = 0; i < validChannels.length; i++) {
                if (validChannels[i].type !== "category") {
                    continue;
                }
                if (validChannels[i].name.toLowerCase() === channelName.toLowerCase()) {
                    channel = validChannels[i];
                }
            }
            break;
    }
    return channel;
}

bot.login(Token);
