/*==========DISCORD.JS===========*/
const Discord = require('discord.js');
const bot = new Discord.Client();
/*==============================*/
const config = bot.config = require('./config.json'); // Global config file
console.log("[!] Starting bot...");
/*==============================*/

// Commands
const commands = {
	"help": {
		process: function (msg, suffix, embed) {
			const list = ["```perl",
			"fr!help #Sends this help message",
			"fr!join #Join to your voice channel",
			"fr!leave #Exit the voice channel",
			"fr!play <flow> #Play radio station",
			"fr!invite #Generate an invitation link to invite me to your server```",
			"I'm **FLow Radio**, a simple bot focused on play music. I'm developed by `Icyz)#4569`"]
			embed.setDescription(list);
			embed.setAuthor("Command list!");
			embed.setColor("#b92727");
			msg.channel.send({ embed });
		}
  	},
	"join": {
		process: function (msg, suffix, embed) {
			if (!msg.member.voiceChannel) return msg.channel.send('<:tick:445752370324832256> You are not on a voice channel.');
			if (!msg.member.voiceChannel.joinable) return msg.channel.send("<:tick:445752370324832256> I\'m unable to play music in this channel.");
			msg.member.voiceChannel.join().then(() => {
				embed.setDescription("<:tick2:445752599631888384> Successfully joined!");
				embed.setColor("#b92727");
				msg.channel.send({ embed });
        		});
		}
	},
	"leave": {
		process: function (msg, suffix) {
			if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("<:tick:445752370324832256> You do not have sufficient permissions.");
			msg.member.voiceChannel.leave().then(() => {
				embed.setDescription("<:tick2:445752599631888384> Successfully joined!");
				embed.setColor("#b92727");
				msg.channel.send({ embed });
			}).catch(() => "<:tick:445752370324832256> I'm not in a voice channel.");
		}
	},
	"play": {
		process: function (msg, suffix, embed) {
			if (!msg.member.voiceChannel) return msg.channel.send('<:tick:445752370324832256> You are not on a voice channel.');
			if (!msg.member.voiceChannel.joinable) return msg.channel.send("<:tick:445752370324832256> I\'m unable to play music in this channel.");
			if (!suffix) {
				embed.setDescription("• Insert a correct radio to play.\n\n`[-]` **Available radios:** `flow`");
				embed.setColor("#b92727");
				return msg.channel.send({ embed });
			}
			let radio; // Empty Variable
			if (suffix.toLowerCase() == "flow") {
				radio = "http://eu10.fastcast4u.com:3900/stream";
			} else if (suffix.toLowerCase() == "jazz") {
				radio = "WineFarmAndTouristradio";
			} else if (suffix.toLowerCase() == "dubstep") {
				radio = "ELECTROPOP-MUSIC";
			} else {
				embed.setDescription("• Insert a correct radio to play.\n\n`[-]` **Available radios:** `flow`");
				embed.setColor("#b92727");
				return msg.channel.send({ embed });
			}
			msg.member.voiceChannel.join().then(connection => {
				require('http').get("" + radio, (res) => {
					connection.playStream(res);
					embed.setColor("#b92727");
					embed.setDescription("<:tick2:445752599631888384> Playing correctly!");
					msg.channel.send({ embed });
				});
			}).catch(err => "<:tick:445752370324832256> **Error:** ```\n" + err + "```");
			}
	},
	"invite": {
		process: function (msg, suffix) {
			embed.setDescription("**Invite link:** `https://discordapp.com/api/oauth2/authorize?client_id=596815382556442624&permissions=8&scope=bot");
      			embed.setColor("#b92727");
     			msg.channel.send({ embed });
		}
	}
};

// Ready Event
bot.on("ready", function () {
	console.log("[*] Logged in " + bot.guilds.array().length + " servers!");
	setInterval(function() {
  		bot.user.setActivity(config.prefix + "help | " + bot.guilds.array().length + " servers!");
  	}, 100000)
});

// Command System
bot.on('message', function (msg) {
	if (msg.content.indexOf(config.prefix) === 0) {
		console.log(`(${msg.guild.name}) ${msg.author.tag}: ${msg.content}`); // Command logger

      		const command = msg.content.split(" ")[0].substring(config.prefix.length); // Command
      		const suffix = msg.content.substring(command.length + config.prefix.length + 1); // Arguments
      		const embed = new Discord.RichEmbed(); // Gets Rich Embed

      		if (!commands[command]) return; // Return if the command doesn't exists
      		try {
			commands[command].process(msg, suffix, embed); // Execute the command
      		} catch(err) { // Catch an error
        		msg.channel.send({embed: {"description": "<:tick:445752370324832256> **Error:** ```\n" + err + "```", "color": 0xff0000}});
      		}
	}
});

bot.login(config.token);
