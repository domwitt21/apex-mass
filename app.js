const Discord = require("discord.js");
const { Partials, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, AttachmentBuilder  } = require("discord.js");
const client = new Discord.Client({intents: ["GuildMessages", "MessageContent", "GuildEmojisAndStickers", "Guilds"], partials: [Partials.Channel]});
const config = require("./auth.json");
const axios = require("axios");
const { text } = require("stream/consumers");

client.on("unhandledRejection", error => {
    console.error("Unhandled promise rejections", error);
});
client.on("shardError", error => {
    console.error("A websocket connection has encountered an error", error);
});
client.on("ready", () => {
    console.log("Apex Mass is online and ready for action!");
});
client.login(config.token);

client.on("messageCreate", message => {
    const args = message.content.trim().split(/ +/g);
    if(args[0] === "!apex" && args[1] === "help") {
        const helpEmbed = new EmbedBuilder()
            .setColor("DarkRed")
            .setTitle("Getting Started")
            .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.avatarURL()}` })
            .setDescription("**This should help you get started.**\n\nYou can find all the information you'll ever need for **Apex Legends** right here in your discord server!\n\n**Command prefix is** ``!apex``\n\n**Currently supported platforms**\n<:origin:1008528451201945702>**PC**\n<:psn:1008528482021687386>**PS4**\n<:xbox:1008528415101562910>**X1**\n\n***All data supplied by [Apex Legends Status](https://portal.apexlegendsapi.com/)***")
            .addFields([
                {name: "``!apex player <name> <platform>``", value: "- Search players in Apex Legends; Ex: !apex player Kill_rick PC"},
                {name: "``!apex maps``", value: "- Display information on current map rotation"},
                {name: "``!apex store``", value: "- Display information on current store items"},
                {name: "``!apex group``", value: "- Start an apex legends group for you and friends to party up"},
                {name: "``!apex craft``", value: "- Display's items that can be crafted in replicators"},
                {name: "``!apex news``", value: "- Display's news information"},
                {name: "``!apex predator``", value: "- Display's RP/AP required to reach Apex Predator on all platforms"},
            ])
        message.channel.send({ embeds: [helpEmbed] })
            .catch((err) => console.log(err));
        return;
    } else if(args[0] === "!apex" && args[1] === "craft") {
        const options = {
            method: 'GET',
            url: "https://api.mozambiquehe.re/crafting?auth=b152112263b39a67cee6e9e137580133",
            headers: {
              'X-RapidAPI-Key': 'b152112263b39a67cee6e9e137580133',
              'X-RapidAPI-Host': 'api.mozambiquehe.re'
            }
          };
          
        axios.request(options).then(async (response) => {
            const test = response.data[0].bundle;
            const tester = response.data[0].bundleContent[0].itemType.name;
            const weeklyTest = response.data[1].bundleContent[0].itemType.name;
            const weeklyTester = response.data[1].bundleContent[1].itemType.name;
            const weeklyItemOne = weeklyTest.replaceAll("_", " ").toUpperCase();
            const weeklyItemTwo = weeklyTester.replaceAll("_", " ").toUpperCase();
            const itemOne = tester.replaceAll("_", " ").toUpperCase();
            const bundleName = test.replaceAll("_", " ").toUpperCase();
            const craftEmbed = new EmbedBuilder()
                .setColor(response.data[0].bundleContent[1].itemType.rarityHex)
                .setTitle("🔥 **Crafting Rotation** 🔥")
                .setDescription("\n\**Daily** and **weekly** crafting rotations\n\n(HINT: The color of the embed is the color\nof one of your **daily** craft items)\n")
                .addFields([
                    {name: "📦 **Daily**", value: `Item: **${itemOne}**\nCost: **${response.data[0].bundleContent[0].cost}**\nRarity: **[${response.data[0].bundleContent[0].itemType.rarity}](${response.data[0].bundleContent[0].itemType.asset})**\nStarted: **${response.data[0].startDate}**\nEnding: **${response.data[0].endDate}**\n\nItem: **${response.data[0].bundleContent[1].itemType.name.toUpperCase()}**\nCost: **${response.data[0].bundleContent[1].cost}**\nRarity: **[${response.data[0].bundleContent[1].itemType.rarity}](${response.data[0].bundleContent[1].itemType.asset})**\nStarted: **${response.data[0].startDate}**\nEnding: **${response.data[0].endDate}**`},
                    {name: "📦 **Weekly**", value: `Item: **${weeklyItemOne}**\nCost: **${response.data[1].bundleContent[0].cost}**\nRarity: **[${response.data[1].bundleContent[0].itemType.rarity}](${response.data[1].bundleContent[0].itemType.asset})**\nStarted: **${response.data[1].startDate}**\nEnding: **${response.data[1].endDate}**\n\nItem: **${weeklyItemTwo}**\nCost: **${response.data[1].bundleContent[1].cost}**\nRarity: **[${response.data[1].bundleContent[1].itemType.rarity}](${response.data[1].bundleContent[1].itemType.asset})**\nStarted: **${response.data[1].startDate}**\nEnding: **${response.data[1].endDate}**`},
                ])

            message.channel.send({embeds: [craftEmbed]})
                .catch((err) => console.log(err));
            return;
        });
    } else if(args[0] === "!apex" && args[1] === "maps") {
        const options = {
            method: 'GET',
            url: "https://api.mozambiquehe.re/maprotation?auth=b152112263b39a67cee6e9e137580133",
            headers: {
              'X-RapidAPI-Key': 'b152112263b39a67cee6e9e137580133',
              'X-RapidAPI-Host': 'api.mozambiquehe.re'
            }
          };
          
        axios.request(options).then((response) => {
            const mapEmbed = new EmbedBuilder()
                .setColor("DarkRed")
                .setTitle("Map Rotation's")
                .addFields([
                    {name: "🗺️ **Current Map**", value: `Map: **${response.data.current.map}**\nStarting: **${response.data.current.readableDate_start}**\nEnding: **${response.data.current.readableDate_end}**\nRemaining Time: **${response.data.current.remainingTimer}**`},
                    {name: "🗺️ **Next Map**", value: `Map: **${response.data.next.map}**\nStarting: **${response.data.next.readableDate_start}**\nEnding: **${response.data.next.readableDate_end}**`},
                ])
                .setImage(response.data.current.asset)
            message.channel.send({ embeds: [mapEmbed] })
                .catch((err) => console.log(err));
            return;
        });
    } else if(args[0] === "!apex" && args[1] === "player") {
        const urlQuery = `https://api.mozambiquehe.re/bridge?auth=b152112263b39a67cee6e9e137580133&player=${args[2]}&platform=${args[3]}`
        const options = {
            method: 'GET',
            url: urlQuery,
            headers: {
              'X-RapidAPI-Key': 'b152112263b39a67cee6e9e137580133',
              'X-RapidAPI-Host': 'api.mozambiquehe.re'
            }
          };
          
        axios.request(options).then((response) => {
            const tillLvl = 100 - response.data.global.toNextLevelPercent;
            const nextLvl = response.data.global.level + 1;
            const brRank = response.data.global.rank.rankName;
            const arenaRank = response.data.global.arena.rankName;
            const badges = response.data.legends.selected.gameInfo.badges.map(m => m.name).toString();
            const badgesSpaced = badges.replaceAll(",", ", ");
            const state = response.data.realtime.currentStateAsText;
            if(state === "Offline") {
                const playerEmbed = new EmbedBuilder()
                    .setColor("DarkRed")
                    .setTitle(response.data.global.name)
                    .setDescription(`🔴 **${response.data.realtime.currentStateAsText}**`)
                    .addFields([
                        {name: "📊 **Player Stats**", value: `Platform: **${response.data.global.platform}**\nLevel: **${response.data.global.level}** (${tillLvl}% till ***${nextLvl}***)\nBattlepass Level: **${response.data.global.battlepass.level}**\nPrestige Level: **${response.data.global.levelPrestige}**\nKD: **${response.data.total.kd.value}**\n`, inline: true},
                        {name: "⚔️ **BR Rank**", value: `Rank: **${response.data.global.rank.rankName}**\nScore : **${response.data.global.rank.rankScore}**`},
                        {name: "👑 **Arena Rank**", value: `Rank: **${response.data.global.arena.rankName}**\nScore : **${response.data.global.arena.rankScore}**`},
                        {name: "🦸 **Legend Stats**", value: `Name: **${response.data.legends.selected.LegendName}**\nSkin : **${response.data.legends.selected.gameInfo.skinRarity}; ${response.data.legends.selected.gameInfo.skin}**\nFrame: **${response.data.legends.selected.gameInfo.frameRarity}; ${response.data.legends.selected.gameInfo.frame}**\nPose: **${response.data.legends.selected.gameInfo.poseRarity}; ${response.data.legends.selected.gameInfo.pose}**\nIntro: **${response.data.legends.selected.gameInfo.introRarity}; ${response.data.legends.selected.gameInfo.intro}**\nBadges: **${badgesSpaced}**`},
                    ])
                    .setImage(response.data.global.rank.rankImg)
                message.channel.send({ embeds: [playerEmbed] })
                    .catch((err) => console.log(err));
                return;
            } else {
                const playerEmbed = new EmbedBuilder()
                    .setColor("DarkRed")
                    .setTitle(`${response.data.global.name}'s Apex Stat's`)
                    .setDescription(`\n🟢 **${response.data.realtime.currentStateAsText}** as **${response.data.realtime.selectedLegend}**\n`)
                    .addFields([
                        {name: "📊 **Player Stats**", value: `Platform: **${response.data.global.platform}**\nLevel: **${response.data.global.level}** (${tillLvl}% till ***${nextLvl}***)\nBattlepass Level: **${response.data.global.battlepass.level}**\nPrestige Level: **${response.data.global.levelPrestige}**\nKD: **${response.data.total.kd.value}**\n`, inline: true},
                        {name: "⚔️ **BR Rank**", value: `Rank: **${response.data.global.rank.rankName}**\nScore : **${response.data.global.rank.rankScore}**`},
                        {name: "👑 **Arena Rank**", value: `Rank: **${response.data.global.arena.rankName}**\nScore : **${response.data.global.arena.rankScore}**`},
                        {name: "🦸 **Legend Stats**", value: `Name: **${response.data.legends.selected.LegendName}**\nSkin : **${response.data.legends.selected.gameInfo.skinRarity}; ${response.data.legends.selected.gameInfo.skin}**\nFrame: **${response.data.legends.selected.gameInfo.frameRarity}; ${response.data.legends.selected.gameInfo.frame}**\nPose: **${response.data.legends.selected.gameInfo.poseRarity}; ${response.data.legends.selected.gameInfo.pose}**\nIntro: **${response.data.legends.selected.gameInfo.introRarity}; ${response.data.legends.selected.gameInfo.intro}**\nBadges: **${badgesSpaced}**`},
                    ])
                    .setImage(response.data.global.rank.rankImg)
                message.channel.send({ embeds: [playerEmbed] })
                    .catch((err) => console.log(err));
                return;
            };
        }).catch(function (error) {
            message.reply("```Player doesnt exist```")
                .then((msg) => {
                    setTimeout(function timing() {
                        msg.delete();
                    }, 4000);
                    return;
                });
            return;
        });
    } else if(args[0] === "!apex" && args[1] === "store") {
        const options = {
            method: 'GET',
            url: "https://api.mozambiquehe.re/store?auth=b152112263b39a67cee6e9e137580133",
            headers: {
              'X-RapidAPI-Key': 'b152112263b39a67cee6e9e137580133',
              'X-RapidAPI-Host': 'api.mozambiquehe.re'
            }
          };
        axios.request(options).then((response) => {
            const storeEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("🏪 **Apex Store** 🏪")
                .addFields([
                    {name: `${response.data[0].title}`, value: `Price: <:apexcoin:1008766701493551184> **${response.data[0].pricing[0].quantity}**\n Content: **${response.data[0].content[0].name}**, **${response.data[0].content[1].name}**, **${response.data[0].content[2].name}**, **${response.data[0].content[3].name}**`},
                    {name: `${response.data[1].title}`, value: `Price: <:apexcoin:1008766701493551184> **${response.data[1].pricing[0].quantity}**\n Content: **${response.data[1].content[0].name}**, **${response.data[1].content[1].name}**`},
                    {name: `${response.data[2].title}`, value: `Price: <:apexcoin:1008766701493551184> **${response.data[2].pricing[0].quantity}**\n Content: **${response.data[2].content[0].name}**, **${response.data[2].content[1].name}**, **${response.data[2].content[2].name}**`},
                    {name: `${response.data[3].title}`, value: `Price: <:apexcoin:1008766701493551184> **${response.data[3].pricing[0].quantity}**\n Content: **${response.data[3].content[0].name}**, **${response.data[3].content[1].name}**`},
                    {name: `${response.data[4].title}`, value: `Price: <:apexcoin:1008766701493551184> **${response.data[4].pricing[0].quantity}**\n Content: **${response.data[4].content[0].name}**`},
                    {name: `${response.data[5].title}`, value: `Price: <:apexcoin:1008766701493551184> **${response.data[5].pricing[1].quantity}** <:legendtoken:1008772463120875601> **${response.data[5].pricing[0].quantity}**\n Content: **${response.data[5].content[0].name}**`},
                    {name: `${response.data[6].title}`, value: `Price: <:apexcoin:1008766701493551184> **${response.data[6].pricing[0].quantity}**\n Content: **${response.data[6].content[0].name}**`},
                    {name: `${response.data[7].title}`, value: `Price: <:apexcoin:1008766701493551184> **${response.data[7].pricing[1].quantity}** <:legendtoken:1008772463120875601> **${response.data[7].pricing[0].quantity}**\n Content: **${response.data[7].content[0].name}**`},
                    {name: `${response.data[8].title}`, value: `Price: <:apexcoin:1008766701493551184> **${response.data[8].pricing[0].quantity}**\n Content: **${response.data[8].content[0].name}**, **${response.data[8].content[1].name}**`},
                    {name: `${response.data[9].title}`, value: `Price: <:apexcoin:1008766701493551184> **${response.data[9].pricing[0].quantity}**\n Content: **${response.data[9].content[0].name}**, **${response.data[9].content[1].name}**, **${response.data[9].content[2].name}**`},
                    {name: `${response.data[10].title}`, value: `Price: <:apexcoin:1008766701493551184> **${response.data[10].pricing[0].quantity}**\n Content: **${response.data[10].content[0].name}**, **${response.data[10].content[1].name}**`},
                    {name: `${response.data[11].title}`, value: `Price: <:apexcoin:1008766701493551184> **${response.data[11].pricing[0].quantity}**\n Content: **${response.data[11].content[0].name}**, **${response.data[11].content[1].name}**, **${response.data[11].content[2].name}**`},
                ])
            message.channel.send({embeds: [storeEmbed]});
            return;
        })
            .catch((err) => console.log(err));
    } else if(args[0] === "!apex" && args[2] === "predator") {
        const options = {
            method: 'GET',
            url: "https://api.mozambiquehe.re/predator?auth=b152112263b39a67cee6e9e137580133",
            headers: {
              'X-RapidAPI-Key': 'b152112263b39a67cee6e9e137580133',
              'X-RapidAPI-Host': 'api.mozambiquehe.re'
            }
          };
        axios.request(options).then((response) => {
            const predatorEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("👹 Apex Predator 👹")
                .addFields([
                    {name: "**Battle Royale**", value: `**${response.data.RP.PC.val} RP** required on <:origin:1008528451201945702>\n**${response.data.RP.PS4.val} RP** required on <:psn:1008528482021687386>\n**${response.data.RP.X1.val} RP** required on <:xbox:1008528415101562910>\n**${response.data.RP.SWITCH.val} RP** required on <:switch:1008783555398209597>`},
                    {name: "**Arena**", value: `**${response.data.AP.PC.val} RP** required on <:origin:1008528451201945702>\n**${response.data.AP.PS4.val} RP** required on <:psn:1008528482021687386>\n**${response.data.AP.X1.val} RP** required on <:xbox:1008528415101562910>\n**${response.data.AP.SWITCH.val} RP** required on <:switch:1008783555398209597>`},
                    {name: "**Total Masters and Preds BR**", value: `**${response.data.RP.PC.totalMastersAndPreds}** on <:origin:1008528451201945702>\n**${response.data.RP.PS4.totalMastersAndPreds}** on <:psn:1008528482021687386>\n**${response.data.RP.X1.totalMastersAndPreds}** on <:xbox:1008528415101562910>\n**${response.data.RP.SWITCH.totalMastersAndPreds}** on <:switch:1008783555398209597>`},
                    {name: "**Total Masters and Preds Arena**", value: `**${response.data.AP.PC.totalMastersAndPreds}** on <:origin:1008528451201945702>\n**${response.data.AP.PS4.totalMastersAndPreds}** on <:psn:1008528482021687386>\n**${response.data.AP.X1.totalMastersAndPreds}** on <:xbox:1008528415101562910>\n**${response.data.AP.SWITCH.totalMastersAndPreds}** on <:switch:1008783555398209597>`},
                ])

            message.channel.send({embeds: [predatorEmbed]})
                .catch((err) => console.log(err));
            return;
        })
            .catch((err) => console.log(err));
    } else if(args[0] === "!apex" && args[1] === "news") {
        const options = {
            method: 'GET',
            url: "https://api.mozambiquehe.re/news?auth=b152112263b39a67cee6e9e137580133",
            headers: {
              'X-RapidAPI-Key': 'b152112263b39a67cee6e9e137580133',
              'X-RapidAPI-Host': 'api.mozambiquehe.re'
            }
          };
        axios.request(options).then((response) => {
            const newsEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("📰 **Apex News** 📰")
                .setDescription("***Click on the links for more information***\n\n")
                .addFields([
                    {name: `📰 ${response.data[0].title}`, value: `${response.data[0].short_desc} [Learn More](${response.data[0].link})`},
                    {name: `📰 ${response.data[1].title}`, value: `${response.data[1].short_desc} [Learn More](${response.data[1].link})`},
                    {name: `📰 ${response.data[2].title}`, value: `${response.data[2].short_desc} [Learn More](${response.data[2].link})`},
                    {name: `📰 ${response.data[3].title}`, value: `${response.data[3].short_desc} [Learn More](${response.data[3].link})`},
                    {name: `📰 ${response.data[4].title}`, value: `${response.data[4].short_desc} [Learn More](${response.data[4].link})`},
                    {name: `📰 ${response.data[5].title}`, value: `${response.data[5].short_desc} [Learn More](${response.data[5].link})`},
                    {name: `📰 ${response.data[6].title}`, value: `${response.data[6].short_desc} [Learn More](${response.data[6].link})`},
                    {name: `📰 ${response.data[7].title}`, value: `${response.data[7].short_desc} [Learn More](${response.data[7].link})`},
                    {name: `📰 ${response.data[8].title}`, value: `${response.data[8].short_desc} [Learn More](${response.data[8].link})`},
                    {name: `📰 ${response.data[9].title}`, value: `${response.data[9].short_desc} [Learn More](${response.data[9].link})`},
                    {name: `📰 ${response.data[10].title}`, value: `${response.data[10].short_desc} [Learn More](${response.data[10].link})`},
                    {name: `📰 ${response.data[11].title}`, value: `${response.data[11].short_desc} [Learn More](${response.data[11].link})`},
                    {name: `📰 ${response.data[12].title}`, value: `${response.data[12].short_desc} [Learn More](${response.data[12].link})`},
                    {name: `📰 ${response.data[13].title}`, value: `${response.data[13].short_desc} [Learn More](${response.data[13].link})`},
                    {name: `📰 ${response.data[14].title}`, value: `${response.data[14].short_desc} [Learn More](${response.data[14].link})`},
                    {name: `📰 ${response.data[15].title}`, value: `${response.data[15].short_desc} [Learn More](${response.data[15].link})`},
                    {name: `📰 ${response.data[16].title}`, value: `${response.data[16].short_desc} [Learn More](${response.data[16].link})`},
                    {name: `📰 ${response.data[17].title}`, value: `${response.data[17].short_desc} [Learn More](${response.data[17].link})`},
                    {name: `📰 ${response.data[18].title}`, value: `${response.data[18].short_desc} [Learn More](${response.data[18].link})`},
                    {name: `📰 ${response.data[19].title}`, value: `${response.data[19].short_desc} [Learn More](${response.data[19].link})`},
                    {name: `📰 ${response.data[20].title}`, value: `${response.data[20].short_desc} [Learn More](${response.data[20].link})`},
                    {name: `📰 ${response.data[21].title}`, value: `${response.data[21].short_desc} [Learn More](${response.data[21].link})`},
                    {name: `📰 ${response.data[22].title}`, value: `${response.data[22].short_desc} [Learn More](${response.data[22].link})`},
                    {name: `📰 ${response.data[23].title}`, value: `${response.data[23].short_desc} [Learn More](${response.data[23].link})`},
                    {name: `📰 ${response.data[24].title}`, value: `${response.data[24].short_desc} [Learn More](${response.data[24].link})`},
                ])
            message.channel.send({ embeds: [newsEmbed] })
                .catch((err) => console.log(err));
            return;
        })
            .catch((err) => console.log(err));
    } else if(args[0] === "!apex" && args[1] === "group") {
        const findChannel = message.guild.channels.cache.find(c => c.name === `${message.author.username}'s Apex Group`);
        if(findChannel == undefined) {
            message.guild.channels.create({
                name: `${message.author.username}'s Apex Group`,
                type: 2,
                parent: message.channel.parent,
            })
            .then((chn) => {
                chn.send(`<@${message.author.id}>`);
            })
            .catch((err) => console.log(err));
            return;
        } else if(findChannel != undefined) {
            const dltChannel = message.guild.channels.cache.find(c => c.name === `${message.author.username}'s Apex Group`);
            dltChannel.delete()
                .then(function create() {
                    message.guild.channels.create({
                        name: `${message.author.username}'s Apex Group`,
                        type: 2,
                        parent: message.channel.parent,
                    })
                    .then((chn) => {
                        chn.send(`<@${message.author.id}> welcome to your group. You are the only one who can delete it other than Admin. Use **dlt channel** when you're finished.`);
                    })
                    .catch((err) => console.log(err));
                    return;
                });
            return;
        } else {
            return;
        };
    } else if(args[0] === "dlt" && args[1] === "channel") {
        const complete = message.guild.channels.cache.find(c => c.name === `${message.author.username}'s Apex Group`);
        if(complete === undefined) return;
        complete.delete()
            .catch((err) => console.log(err));
        return;
    };
});

// client.on("messageCreate", message => {
//     const args = message.content.trim().split(/ +/g);
//     const findChannel = message.guild.channels.cache.find(c => c.name === `${message.author.username}'s Apex Group`);
//     // console.log(findChannel);
//     if(message.author.bot) return;
//     if(args[0] === "!apex" && args[1] === "group") {
//         const findChannel = message.guild.channels.cache.find(c => c.name === `${message.author.username}'s Apex Group`);
//         if(findChannel == undefined) {
//             message.guild.channels.create({
//                 name: `${message.author.username}'s Apex Group`,
//                 type: 2,
//                 parent: message.channel.parent,
//             })
//             .then((chn) => {
//                 chn.send(`<@${message.author.id}>`);
//             })
//             .catch((err) => console.log(err));
//             return;
//         } else if(findChannel != undefined) {
//             const dltChannel = message.guild.channels.cache.find(c => c.name === `${message.author.username}'s Apex Group`);
//             dltChannel.delete()
//                 .then(function create() {
//                     message.guild.channels.create({
//                         name: `${message.author.username}'s Apex Group`,
//                         type: 2,
//                         parent: message.channel.parent,
//                     })
//                     .then((chn) => {
//                         chn.send(`<@${message.author.id}> welcome to your group. You are the only one who can delete it other than Admin. Use **dlt channel** when you're finished.`);
//                     })
//                     .catch((err) => console.log(err));
//                     return;
//                 });
//             return;
//         } else {
//             return;
//         };
//     } else if(args[0] === "dlt" && args[1] === "channel") {
//         const complete = message.guild.channels.cache.find(c => c.name === `${message.author.username}'s Apex Group`);
//         if(complete === undefined) return;
//         complete.delete()
//             .catch((err) => console.log(err));
//         return;
//     };
    // if(message.content === "f1") {
    //     // console.log(message.channel.parent.name);
    //     message.guild.channels.create({
    //         name: `${message.author.username}'s Apex Group`,
    //         type: 2,
    //         parent: message.channel.parent,
    //     })
    //     .then((chn) => {
    //         chn.send(`<@${message.author.id}>`);
    //         const filter = i => i.name === chn.name;
    //         const collector = chn.createMessageCollector({ filter });
    //         collector.on("collect", collection => {
    //             console.log(collection);
    //             return;
    //         });
    //     })
    //     .catch((err) => console.log(err));
    // };
// });