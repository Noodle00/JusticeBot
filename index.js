const Discord = require("discord.js");
const client = new Discord.Client();

const token = "token";
const prefix = ";";

client.on("ready", () => {
  console.log(`Le bot a démarré, avec ${client.users.size} utilisateurs, dans ${client.channels.size} channels pour ${client.guilds.size} serveurs.`); 
  client.user.setGame(`${client.users.size} membres !!`);
});

client.on("guildCreate", guild => {
  console.log(`Nouveau serveur join: ${guild.name} (id: ${guild.id}). Le serveur a ${guild.memberCount} membres!`);
  client.user.setGame(`${client.users.size} membres !!`);
});

client.on("guildDelete", guild => {
  console.log(`A été supprimer de: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`${client.users.size} membres !!`);
});


client.on("message", async message => {
  if(message.author.bot) return;

  if(message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  if(command === "ping") {
    const m = await message.channel.send("Ping...");
    m.edit(`Pong! :ping_pong: **${m.createdTimestamp - message.createdTimestamp}** ms.`);
  }
  
  if(command === "say") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Désolé, vous n'avez pas les permissions pour utiliser cette commande!");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Veuillez mentionner un membre valide de ce serveur");
    if(!member.kickable) 
      return message.reply("Je ne peux pas expulser cet utilisateur! A-t'il un rôle plus important? Ai-je les autorisations d'expulser?");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Veuillez indiquer une raison pour l'expulsion!");

    await member.kick(reason)
      .catch(error => message.reply(`Désolé ${message.author} Je n'ai pu l'expulser suite à une erreur : ${error}`));
    message.reply(`**${member.user.tag}** a été expulser par **${message.author.tag}** raison: **${reason}**`);

  }
  
  if(command === "ban") {
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Désolé, vous n'avez pas les permissions pour utiliser cette commande!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Veuillez mentionner un membre valide de ce serveur");
    if(!member.bannable) 
      return message.reply("Je ne peux pas bannir cet utilisateur! A-t'il un rôle plus important? Ai-je les autorisations de bannir?");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Veuillez indiquer une raison pour le bannissement!");
    
    await member.ban(reason)
      .catch(error => message.reply(`Désolé ${message.author} Je n'ai pu le bannir suite à une erreur : ${error}`));
    message.reply(`**${member.user.tag}** a été banni par **${message.author.tag}** raison: **${reason}**`);
  }
  
  if(command === "purge") {
    const deleteCount = parseInt(args[0], 10);

    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Veuillez indiquer un nombre compris entre 2 et 100 pour le nombre de messages à supprimer");

    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Je n'ai pu supprimer les messages suite à une erreur: ${error}`));
  }
});

client.login(token);
