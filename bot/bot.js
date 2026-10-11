import { 
    Client, 
    GatewayIntentBits, 
    EmbedBuilder, 
    ActionRowBuilder, 
    StringSelectMenuBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    PermissionFlagsBits, 
    ChannelType,
    AttachmentBuilder,
    MessageFlags,
    ApplicationCommandOptionType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';
import discordTranscripts from 'discord-html-transcripts';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Global anti-crash handlers to enforce Zero-Crash Architecture
process.on('unhandledRejection', (reason, promise) => {
    console.error('[Anti-Crash] Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('[Anti-Crash] Uncaught Exception:', err);
});

// ─── Config ───────────────────────────────────────────────────────────────────
const TOKEN = process.env.DISCORD_TOKEN || process.env.BOT_TOKEN || process.env.TOKEN || "MTUxMTEwODY0NjY5NDgxNzg3NA.G9AmiW.jAGzCv9gnxRH8jIPyF0NQyM3zp2BVXJNygbpSI";

const GUILD_IDS = ["1497496326517031034", "1472127319140339722", "1096444793841791030"];
const TICKET_CATEGORY_ID = "1545423374258405456";
const STAFF_ROLE_ID = "1500459667535564911";
const RESELLER_ROLE_ID = "1497496326517031040";
const STAFF_USER_ID = "1421835488808931441";
const LOGS_CHANNEL_ID = "1545439297942065272";

const COLORS = {
    PRIMARY:   0xF2B233,
    SUCCESS:   0xF2B233,
    DANGER:    0xF2B233,
    INFO:      0xF2B233,
    SECONDARY: 0xF2B233,
};

const TICKET_NAMES = {
    "nitro":        "nitro",
    "boosts":       "boosts",
    "promo-links":  "promolinks",
    "blox-fruits":  "bloxfruits",
    "mm2":          "mm2",
    "adopt-me":     "adoptme",
    "netflix":      "netflix",
    "crunchyroll":  "crunchyroll",
    "spotify":      "spotify",
    "disney":       "disney",
    "middleman":    "middleman",
};

// ─── Emojis ───────────────────────────────────────────────────────────────────
const EMOJI_DISCORD_CATEGORY   = "<a:NITRO:1511064418585415710>";
const EMOJI_ROBLOX_CATEGORY    = "<:RobloxWhite:1511080035623374997>";
const EMOJI_STREAMING_CATEGORY = "<a:steam:1511078817333121166>";

const EMOJI_NITRO       = "<a:NITRO:1511064418585415710>";
const EMOJI_BOOSTS      = "<a:serverboost:1511039259543339219>";
const EMOJI_PROMO       = "<:links:1511065939611746336>";
const EMOJI_BLOXFRUITS  = "<:Blox_Fruits:1538468768219533463>";
const EMOJI_MM2         = "<:Mm2:1538468830542827590>";
const EMOJI_ADOPTME     = "<:Pet_BatDragon:1538468991679463554>";
const EMOJI_NETFLIX     = "<:netflix:1538465599213281310>";
const EMOJI_CRUNCHYROLL = "<:Crunchyroll:1538465571983589426>";
const EMOJI_SPOTIFY     = "<:148804spotify:1538465701474467841>";
const EMOJI_DISNEY      = "<:disney:1538465649297199194>";
const EMOJI_DECO        = "<a:deco:1538463232933756978>";
const EMOJI_LTC         = "<a:LTC:1510582169674715207>";

const TICKET_LABELS = {
    "nitro":        `${EMOJI_NITRO} Discord Nitro`,
    "boosts":       `${EMOJI_BOOSTS} Server Boosts`,
    "promo-links":  `${EMOJI_PROMO} Promo Links`,
    "blox-fruits":  `${EMOJI_BLOXFRUITS} Blox Fruits`,
    "mm2":          `${EMOJI_MM2} Murder Mystery 2`,
    "adopt-me":     `${EMOJI_ADOPTME} Adopt Me`,
    "netflix":      `${EMOJI_NETFLIX} Netflix`,
    "crunchyroll":  `${EMOJI_CRUNCHYROLL} Crunchyroll`,
    "spotify":      `${EMOJI_SPOTIFY} Spotify Premium`,
    "disney":       `${EMOJI_DISNEY} Disney+`,
    "deco":         `${EMOJI_DECO} Decorations`,
    "middleman":    `🤝 Middleman Request`,
};

const openTickets = new Map();
const activeGames = new Set();
const activePolls = new Map();
const autoDeleteTimers = new Map();

// ─── Interaction Router ──────────────────────────────────────────────────────
client.on('error', (err) => {
    if (err.code === 10062 || err.code === 40060) return;
    console.error('Discord Client Error:', err);
});

client.on('interactionCreate', async (interaction) => {
    try {
        if (interaction.isChatInputCommand()) {
            if (interaction.commandName === 'panel') {
                await handlePanelCommand(interaction);
            } else if (interaction.commandName === 'embed') {
                await handleEmbedCommand(interaction);
            } else if (interaction.commandName === 'close') {
                await handleCloseCommand(interaction);
            } else if (interaction.commandName === 'restock_setup') {
                await handleRestockSetupCommand(interaction);
            } else if (interaction.commandName === 'questioner') {
                await handleQuestionerCommand(interaction);
            } else if (interaction.commandName === 'lock') {
                await handleLockCommand(interaction);
            } else if (interaction.commandName === 'unlock') {
                await handleUnlockCommand(interaction);
            } else if (interaction.commandName === 'poll') {
                await handlePollCommand(interaction);
            } else if (interaction.commandName === 'setupautodelete') {
                await handleSetupAutoDeleteCommand(interaction);
            } else if (interaction.commandName === 'middleman-request') {
                await handleMiddlemanRequestCommand(interaction);
            } else if (interaction.commandName === 'add') {
                await handleAddCommand(interaction);
            } else if (interaction.commandName === 'massdm') {
                await handleMassDmCommand(interaction);
            }
        }

        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'middleman_modal') {
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });
                
                const partnerId = interaction.fields.getTextInputValue('partner_id');
                const tradeInfo = interaction.fields.getTextInputValue('trade_info');
                
                const ticketChannel = await createTicket(interaction, 'middleman', 'na');
                
                if (ticketChannel && ticketChannel.id) {
                    const infoEmbed = new EmbedBuilder()
                        .setTitle("🤝 Trade Information")
                        .addFields(
                            { name: "Partner ID / Username", value: partnerId, inline: false },
                            { name: "Trade Details", value: tradeInfo, inline: false }
                        )
                        .setColor(COLORS.INFO)
                        .setTimestamp();
                        
                    await ticketChannel.send({ embeds: [infoEmbed] });
                }
            }
        }

        if (interaction.isStringSelectMenu()) {
            const customId = interaction.customId;

            if (customId === 'main_category') {
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });
                const category = interaction.values[0];
                const result = buildSubMenu(category);
                if (!result) {
                    return interaction.editReply({ content: "❌ Unknown category." });
                }
                await interaction.editReply({ embeds: [result.embed], components: [result.row] });
            }

            if (customId.startsWith('sub_')) {
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });
                const subOption = interaction.values[0];
                
                let embedDesc = `You selected **${TICKET_LABELS[subOption] || subOption}**.\n\n` +
                    `Please select your payment method below to continue.\n\n` +
                    `${EMOJI_LTC} **Litecoin (LTC)** is the only accepted payment method.`;
                
                let paymentOptions = [
                    {
                        label: "Litecoin (LTC)",
                        description: "Pay with Litecoin — the only accepted payment method",
                        // FIXED: Using Object format for component emoji
                        emoji: { name: "LTC", id: "1510582169674715207", animated: true }, 
                        value: "ltc"
                    }
                ];

                if (subOption === 'deco') {
                    embedDesc = `You selected **${TICKET_LABELS[subOption] || subOption}**.\n\n` +
                        `Please select your payment method below to continue.\n\n` +
                        `${EMOJI_LTC} **Litecoin (LTC)** is the only accepted payment method.\n` +
                        `${EMOJI_BLOXFRUITS} **Blox Fruits** is the only accepted in-game payment method.`;
                        
                    paymentOptions.push({
                        label: "Blox Fruits",
                        description: "Pay with Blox Fruits",
                        emoji: { name: "Blox_Fruits", id: "1538468768219533463", animated: false },
                        value: "bf"
                    });
                }

                const embed = new EmbedBuilder()
                    .setTitle("💳 Select Payment Method")
                    .setDescription(embedDesc)
                    .setColor(COLORS.PRIMARY)
                    .setFooter({ text: "Nachos Marketplace" });

                const paymentSelect = new StringSelectMenuBuilder()
                    .setCustomId(`pay_${subOption}`)
                    .setPlaceholder("💳 Select payment method...")
                    .addOptions(paymentOptions);

                const row = new ActionRowBuilder().addComponents(paymentSelect);
                await interaction.editReply({ embeds: [embed], components: [row] });
            }

            if (customId.startsWith('pay_')) {
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });
                const subOption = customId.split('_')[1];
                const paymentMethod = interaction.values[0];
                await createTicket(interaction, subOption, paymentMethod);
            }
        }

        if (interaction.isButton()) {
            const channelId = interaction.channel.id;
            if (interaction.customId === 'ticket_close_global') {
                await closeTicket(interaction, channelId);
            } else if (interaction.customId === 'request_middleman') {
                const modal = new ModalBuilder()
                    .setCustomId('middleman_modal')
                    .setTitle('Middleman Request');

                const partnerInput = new TextInputBuilder()
                    .setCustomId('partner_id')
                    .setLabel("Partner User ID / Username")
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("E.g. 123456789012345678 or @user")
                    .setRequired(true);

                const tradeInfoInput = new TextInputBuilder()
                    .setCustomId('trade_info')
                    .setLabel("What is the trade info?")
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder("Provide details of the trade...")
                    .setRequired(true);

                const row1 = new ActionRowBuilder().addComponents(partnerInput);
                const row2 = new ActionRowBuilder().addComponents(tradeInfoInput);

                modal.addComponents(row1, row2);
                await interaction.showModal(modal);
            } else if (interaction.customId === 'ticket_delete_global') {
                await deleteTicket(interaction, channelId);
            } else if (interaction.customId.startsWith('restock_role_')) {
                await handleRestockRoleButton(interaction);
            } else if (interaction.customId.startsWith('poll_vote_')) {
                await handlePollVote(interaction);
            } else if (interaction.customId === 'poll_end') {
                await handlePollEnd(interaction);
            } else if (interaction.customId === 'questioner_unlock') {
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });
                if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                    return interaction.editReply({ content: "❌ Only administrators can use this button." });
                }
                
                await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                    SendMessages: null
                }).catch(err => console.error("Could not unlock channel manually:", err));
                
                await interaction.editReply({ content: "✅ You unlocked the channel." });
                await interaction.channel.send("🔓 **The channel has been unlocked.**");
                
                try {
                    const newComponents = interaction.message.components.map(row => {
                        return new ActionRowBuilder().addComponents(
                            row.components.map(component => ButtonBuilder.from(component).setDisabled(true))
                        );
                    });
                    await interaction.message.edit({ components: newComponents });
                } catch(e) {}
            }
        }
    } catch (err) {
        // Do not log or attempt to reply if the interaction is already dead or acknowledged
        if (err.code === 10062 || err.code === 40060) return;
        
        console.error("Unhandled interaction error:", err);
        
        try {
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ content: "❌ An error occurred while processing this command.", flags: MessageFlags.Ephemeral }).catch(() => {});
            } else {
                await interaction.reply({ content: "❌ An error occurred while processing this command.", flags: MessageFlags.Ephemeral }).catch(() => {});
            }
        } catch (e) {
            console.error("Failed to send error fallback message:", e);
        }
    }
});

// ─── Sub Menu Factory ────────────────────────────────────────────────────────
function buildSubMenu(category) {
    let embed = new EmbedBuilder().setFooter({ text: "Nachos Marketplace" });
    let options = [];
    let selectId = '';

    // FIXED: Using Object format for ALL component emojis below based on your IDs
    if (category === 'discord') {
        embed.setTitle("Discord Products").setDescription("Select the Discord product you wish to purchase.").setColor(COLORS.INFO);
        options = [
            { label: "Nitro", description: "Discord Nitro subscription", emoji: { id: "1510582084492722227", animated: true }, value: "nitro" },
            { label: "Server Boosts", description: "Discord Server Boosts", emoji: { id: "1511039259543339219", animated: true }, value: "boosts" },
            { label: "Promo Links", description: "Discord promotional links", emoji: { name: "🔗" }, value: "promo-links" }
        ];
        selectId = 'sub_discord';
    } else if (category === 'roblox') {
        embed.setTitle("Roblox Marketplace").setDescription("Select the Roblox item you wish to purchase.").setColor(COLORS.PRIMARY);
        options = [
            { label: "Blox Fruits", description: "Blox Fruits items and currency", emoji: { name: "Blox_Fruits", id: "1538468768219533463" }, value: "blox-fruits" },
            { label: "Murder Mystery 2", description: "MM2 knives, guns, and pets", emoji: { name: "Mm2", id: "1538468830542827590" }, value: "mm2" },
            { label: "Adopt Me", description: "Adopt Me pets and items", emoji: { name: "Pet_BatDragon", id: "1538468991679463554" }, value: "adopt-me" }
        ];
        selectId = 'sub_roblox';
    } else if (category === 'streaming') {
        embed.setTitle("Streaming Services").setDescription("Select the streaming service you wish to purchase.").setColor(COLORS.DANGER);
        options = [
            { label: "Netflix", description: "Netflix subscription", emoji: { name: "netflix", id: "1538465599213281310" }, value: "netflix" },
            { label: "Crunchyroll", description: "Crunchyroll premium", emoji: { name: "Crunchyroll", id: "1538465571983589426" }, value: "crunchyroll" },
            { label: "Spotify Premium", description: "Spotify Premium subscription", emoji: { name: "148804spotify", id: "1538465701474467841" }, value: "spotify" },
            { label: "Disney+", description: "Disney+ subscription", emoji: { name: "disney", id: "1538465649297199194" }, value: "disney" }
        ];
        selectId = 'sub_streaming';
    } else if (category === 'decorations') {
        embed.setTitle("Decorations").setDescription("Select the decorations you wish to purchase.").setColor(COLORS.PRIMARY);
        options = [
            { label: "Profile Decorations", description: "Avatar and Profile Decorations", emoji: { name: "deco", id: "1538463232933756978", animated: true }, value: "deco" }
        ];
        selectId = 'sub_decorations';
    } else {
        return null;
    }

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(selectId)
        .setPlaceholder("🛒 Select an item...")
        .addOptions(options);

    const row = new ActionRowBuilder().addComponents(selectMenu);
    return { embed, row };
}

// ─── Ticket Operational Handlers ─────────────────────────────────────────────
async function createTicket(interaction, subOption, paymentMethod) {
    const guild = interaction.guild;
    const user = interaction.user;

    const userTickets = Array.from(openTickets.values()).filter(t => t.userId === user.id);
    if (userTickets.length >= 3) {
        return interaction.followUp({ content: `❌ You can only have a maximum of 3 open tickets at a time!`, flags: MessageFlags.Ephemeral });
    }

    const alreadyHasTicket = userTickets.some(t => t.subOption === subOption);
    if (alreadyHasTicket) {
        return interaction.followUp({ content: `❌ You already have an open **${TICKET_LABELS[subOption] || subOption}** ticket!`, flags: MessageFlags.Ephemeral });
    }

    const prefix = TICKET_NAMES[subOption] || subOption;
    const cleanName = user.username.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
    const channelName = `${prefix}-${cleanName}`;

    const overwrites = [
        { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AttachFiles] },
        { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageMessages] }
    ];

    if (STAFF_ROLE_ID !== "0" && guild.roles.cache.has(STAFF_ROLE_ID)) {
        overwrites.push({ id: STAFF_ROLE_ID, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.AttachFiles] });
    }
    if (RESELLER_ROLE_ID !== "0" && guild.roles.cache.has(RESELLER_ROLE_ID)) {
        overwrites.push({ id: RESELLER_ROLE_ID, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.AttachFiles] });
    }

    try {
        const channel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: (TICKET_CATEGORY_ID !== "0" && guild.channels.cache.has(TICKET_CATEGORY_ID)) ? TICKET_CATEGORY_ID : null,
            permissionOverwrites: overwrites
        });

        openTickets.set(channel.id, {
            userId: user.id,
            subOption: subOption,
            claimedBy: null
        });

        await interaction.followUp({ content: `✅ Your ticket has been created: ${channel}`, flags: MessageFlags.Ephemeral });

        // ✅ New Version (Stays permanently)
        let pingRole = subOption === 'middleman' ? STAFF_ROLE_ID : RESELLER_ROLE_ID;
        let rolePingText = guild.roles.cache.has(pingRole) ? `<@&${pingRole}>` : "";
        let rolePingArray = guild.roles.cache.has(pingRole) ? [pingRole] : [];
        
        await channel.send({ 
             content: `||${rolePingText} ${user}||`, 
             allowedMentions: { roles: rolePingArray, users: [user.id] } 
         });

        let paymentText = `${EMOJI_LTC} **Payment:** Litecoin (LTC) only`;
        if (paymentMethod === 'bf') {
            paymentText = `${EMOJI_BLOXFRUITS} **Payment:** Blox Fruits`;
        } else if (subOption === 'middleman') {
            paymentText = `🤝 **Service:** Middleman Request`;
        }

        const embed = new EmbedBuilder()
            .setDescription(
                `🎫 **Ticket opened by ${user}**\n` +
                `🛒 **Category:** ${TICKET_LABELS[subOption] || subOption}\n` +
                `${paymentText}\n\n` +
                "A staff member will be with you shortly."
            )
            .setColor(COLORS.PRIMARY)
            .setFooter({ text: "Nachos Marketplace" })
            .setTimestamp();

        const closeBtn = new ButtonBuilder().setCustomId('ticket_close_global').setLabel('Close Ticket').setEmoji('🔒').setStyle(ButtonStyle.Danger);
        const row = new ActionRowBuilder().addComponents(closeBtn);

        await channel.send({ embeds: [embed], components: [row] });
        return channel;

    } catch (err) {
        console.error("Error generating channel:", err);
        return interaction.followUp({ content: "❌ Failed to create ticket channel.", flags: MessageFlags.Ephemeral });
    }
}

async function closeTicket(interaction, channelId) {
    await interaction.deferReply();
    const data = openTickets.get(channelId);
    const hasStaffRole = interaction.member.roles.cache.has(STAFF_ROLE_ID) || interaction.member.roles.cache.has(RESELLER_ROLE_ID);
    
    let isOwner = false;
    if (data) {
        isOwner = data.userId === interaction.user.id;
    } else {
        // Fallback for bot restart: if they have ViewChannel permission in a ticket category, assume they are the owner
        const perms = interaction.channel.permissionsFor(interaction.user);
        if (perms && perms.has(PermissionFlagsBits.ViewChannel)) {
            isOwner = true;
        }
    }

    if (!hasStaffRole && !isOwner) return interaction.editReply({ content: "❌ You cannot close this ticket." });

    await interaction.editReply("🔒 Closing ticket and generating transcript...");
    const channel = interaction.channel;

    let attachment;
    try {
        attachment = await discordTranscripts.createTranscript(channel, {
            limit: -1,
            returnType: 'attachment',
            filename: `transcript-${channel.name}.html`,
            saveImages: false,
            poweredBy: false
        });
    } catch (e) {
        console.error("Failed to generate transcript via package:", e);
        attachment = new AttachmentBuilder(Buffer.from("Failed to generate HTML transcript.", 'utf-8'), { name: `transcript-${channel.name}.txt` });
    }

    if (LOGS_CHANNEL_ID !== "0") {
        try {
            const logsChannel = await client.channels.fetch(LOGS_CHANNEL_ID);
            if (logsChannel) {
                const subOpt = data ? data.subOption : "unknown";
                const logEmbed = new EmbedBuilder()
                    .setTitle("📋 Ticket Transcript")
                    .setColor(COLORS.SECONDARY)
                    .addFields(
                        { name: "Channel", value: channel.name, inline: true },
                        { name: "Category", value: TICKET_LABELS[subOpt] || subOpt, inline: true },
                        { name: "Opened By", value: data ? `<@${data.userId}>` : "Unknown", inline: true },
                        { name: "Claimed By", value: data && data.claimedBy ? `<@${data.claimedBy}>` : "Unclaimed", inline: true },
                        { name: "Closed By", value: `${interaction.user}`, inline: true }
                    )
                    .setFooter({ text: "Nachos Marketplace" })
                    .setTimestamp();

                await logsChannel.send({ embeds: [logEmbed], files: [attachment] });
            }
        } catch (e) {
            console.error("Transcript breakdown:", e);
        }
    }

    openTickets.delete(channelId);
    setTimeout(() => channel.delete().catch(() => {}), 3000);
}

async function deleteTicket(interaction, channelId) {
    await interaction.deferReply();
    const hasStaffRole = interaction.member.roles.cache.has(STAFF_ROLE_ID) || interaction.member.roles.cache.has(RESELLER_ROLE_ID);
    if (!hasStaffRole) return interaction.editReply({ content: "❌ Only staff can delete tickets." });

    await interaction.editReply("🗑️ Deleting ticket...");
    openTickets.delete(channelId);
    setTimeout(() => interaction.channel.delete().catch(() => {}), 2000);
}

// ─── Direct Command Handler ──────────────────────────────────────────────────
async function handleLockCommand(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    try {
        await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            SendMessages: false
        });
        await interaction.editReply({ content: '✅ Channel locked successfully!' });
        await interaction.channel.send('🔒 **This channel has been locked.**');
    } catch (err) {
        console.error("Error locking channel:", err);
        await interaction.editReply({ content: '❌ Failed to lock the channel. Check my permissions.' });
    }
}

async function handleUnlockCommand(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    try {
        await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            SendMessages: null
        });
        await interaction.editReply({ content: '✅ Channel unlocked successfully!' });
        await interaction.channel.send('🔓 **This channel has been unlocked.**');
    } catch (err) {
        console.error("Error unlocking channel:", err);
        await interaction.editReply({ content: '❌ Failed to unlock the channel. Check my permissions.' });
    }
}

async function handlePanelCommand(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    
    const embed = new EmbedBuilder()
        .setTitle("🌮 Nachos Marketplace")
        .setDescription(
            "Welcome to Nachos Marketplace.\n\n" +
            "We provide Discord products, Roblox items, and premium streaming services.\n\n" +
            "Select a category below to continue:\n" +
            "<a:NITRO:1511064418585415710> Discord Products\n" +
            "<:b_roblox:1538461848628629526> Roblox Marketplace\n" +
            "<a:steam:1511078817333121166> Streaming Services\n" +
            "<a:deco:1538463232933756978> Decorations\n\n" +
            "<a:LTC:1510582169674715207> Payment Method\n• Litecoin (LTC) only\n\n" +
            "⚡ Fast delivery\n🛡️ Trusted resellers\n🎫 Open a ticket to get started"
        )
        .setColor(COLORS.PRIMARY)
        .setFooter({ text: "Nachos Marketplace • Premium Digital Services" })
        .setImage("https://i.ibb.co/vxwg3knT/file-00000000d7147243905b4a29591a70fc.png")

    // FIXED: Using Object format for component emojis based on your IDs
    const mainSelect = new StringSelectMenuBuilder()
        .setCustomId('main_category')
        .setPlaceholder("🛒 Select a category...")
        .addOptions([
            { label: "Discord Products", description: "Nitro, Server Boosts, Promo Links", emoji: { name: "NITRO", id: "1511064418585415710", animated: true }, value: "discord" },
            { label: "Roblox Marketplace", description: "Blox Fruits, MM2, Adopt Me", emoji: { name: "b_roblox", id: "1538461848628629526", animated: false }, value: "roblox" },
            { label: "Streaming Services", description: "Netflix, Crunchyroll, Spotify, Disney+", emoji: { name: "steam", id: "1511078817333121166", animated: true }, value: "streaming" },
            { label: "Decorations", description: "Avatar and Profile Decorations", emoji: { name: "deco", id: "1538463232933756978", animated: true }, value: "decorations" }
        ]);

    const row = new ActionRowBuilder().addComponents(mainSelect);
    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.followUp({ content: "✅ Panel sent!", flags: MessageFlags.Ephemeral });
}

async function handleMiddlemanRequestCommand(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    
    const embed = new EmbedBuilder()
        .setTitle("🤝 Middleman Service")
        .setDescription(
            "Need a safe and secure trade?\n\n" +
            "Click the button below to request a trusted Middleman for your transaction.\n" +
            "Ensure you have all the details of your trade ready."
        )
        .setColor(COLORS.PRIMARY)
        .setFooter({ text: "Nachos Marketplace • Middleman Services" });

    const btn = new ButtonBuilder()
        .setCustomId('request_middleman')
        .setLabel('Request Middleman')
        .setEmoji('🤝')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(btn);
    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.followUp({ content: "✅ Middleman panel sent!", flags: MessageFlags.Ephemeral });
}


async function handleEmbedCommand(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    // Collect options from the command input
    const message = interaction.options.getString('message');
    const colorInput = interaction.options.getString('color');
    const title = interaction.options.getString('title');
    const footer = interaction.options.getString('footer');
    const attachment = interaction.options.getAttachment('attachment');

    // Default to the PRIMARY color if parsing fails
    let colorCode = COLORS.PRIMARY;
    
    // Parse the given hex color (removing the '#' if present)
    if (colorInput) {
        const hexMatch = colorInput.match(/^#?([0-9a-fA-F]{6})$/);
        if (hexMatch) {
            colorCode = parseInt(hexMatch[1], 16);
        }
    }

    // Build the dynamic embed
    const embed = new EmbedBuilder()
        .setDescription(message.replace(/\\n/g, '\n')) // Replace physical \n strings with real newlines
        .setColor(colorCode);

    if (title) {
        embed.setTitle(title);
    }
    
    if (footer) {
        embed.setFooter({ text: footer });
    }

    if (attachment) {
        // Only attach if the file has image dimensions/types (Discord handles preview safely)
        embed.setImage(attachment.url);
    }

    // Send silently into the channel and confirm directly to user
    await interaction.channel.send({ embeds: [embed] });
    await interaction.editReply({ content: '✅ Custom embed sent successfully!' });
}

async function handleCloseCommand(interaction) {
    const channel = interaction.channel;
    const isTicketChannel = openTickets.has(channel.id) || (TICKET_CATEGORY_ID !== "0" && channel.parentId === TICKET_CATEGORY_ID);

    if (!isTicketChannel) {
        return interaction.reply({ content: "❌ This command can only be used in ticket channels.", flags: MessageFlags.Ephemeral });
    }
    await closeTicket(interaction, channel.id);
}

async function handleRestockSetupCommand(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const role = interaction.options.getRole('role');
    const emojiStr = interaction.options.getString('emoji');

    const embed = new EmbedBuilder()
        .setDescription(`${emojiStr} Click the button below to receive the ${role} role. ${emojiStr}\nBy obtaining this role, you’ll automatically be notified whenever we restock. ${emojiStr}`)
        .setColor(COLORS.PRIMARY);

    const btn = new ButtonBuilder()
        .setCustomId(`restock_role_${role.id}`)
        .setLabel('Get/Remove Role')
        .setStyle(ButtonStyle.Secondary);

    try {
        btn.setEmoji(emojiStr);
    } catch (e) {
        console.error("Failed to set emoji on button:", e);
    }

    const row = new ActionRowBuilder().addComponents(btn);

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.editReply({ content: '✅ Restock panel sent successfully!' });
}

async function handleRestockRoleButton(interaction) {
    const roleId = interaction.customId.replace('restock_role_', '');
    const member = interaction.member;
    
    try {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        if (member.roles.cache.has(roleId)) {
            await member.roles.remove(roleId);
            await interaction.editReply({ content: `❌ You have been removed from the <@&${roleId}> role.` });
        } else {
            await member.roles.add(roleId);
            await interaction.editReply({ content: `✅ You have been given the <@&${roleId}> role!` });
        }
    } catch (err) {
        console.error("Failed to toggle restock role:", err);
        try {
            await interaction.editReply({ content: "❌ Failed to update your roles. Please ensure my role is higher than the role you are trying to give." });
        } catch (e) {}
    }
}

async function handleQuestionerCommand(interaction) {
    const title = interaction.options.getString('title');
    const question = interaction.options.getString('question');
    const answer = interaction.options.getString('answer');
    const targetChannel = interaction.options.getChannel('channel');
    const attachment = interaction.options.getAttachment('attachment');

    if (activeGames.has(targetChannel.id)) {
        return interaction.reply({ content: "❌ There is already an active game in that channel!", flags: MessageFlags.Ephemeral });
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    activeGames.add(targetChannel.id);

    try {
        // Lock the channel during the countdown
        await targetChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            SendMessages: false
        }).catch(err => console.error("Could not lock channel initially:", err));

        const countdownEmbed = new EmbedBuilder()
            .setDescription(`⏳ *A Q/A game will start and the channel will unlock in 10 seconds. Get ready!*`)
            .setColor(COLORS.PRIMARY);
        if (title) countdownEmbed.setTitle(title);

        const countdownMsg = await targetChannel.send({
            content: '@here',
            embeds: [countdownEmbed]
        });

        await interaction.followUp({ content: `✅ Game started in ${targetChannel}!`, flags: MessageFlags.Ephemeral });

        // Wait 7 seconds first
        await new Promise(resolve => setTimeout(resolve, 7000));
        
        // Count down 3, 2, 1 using reactions
        await countdownMsg.react('3️⃣').catch(() => {});
        await new Promise(resolve => setTimeout(resolve, 1000));
        await countdownMsg.react('2️⃣').catch(() => {});
        await new Promise(resolve => setTimeout(resolve, 1000));
        await countdownMsg.react('1️⃣').catch(() => {});
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Unlock the channel
        await targetChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            SendMessages: null
        }).catch(err => console.error("Could not unlock channel:", err));

        const questionEmbed = new EmbedBuilder()
            .setDescription(`Question:\n **${question}**`)
            .setColor(COLORS.PRIMARY);
        if (title) questionEmbed.setTitle(title);
        
        if (attachment) {
            questionEmbed.setImage(attachment.url);
        }

        await targetChannel.send({
            embeds: [questionEmbed]
        });

        const filter = m => m.content.toLowerCase() === answer.toLowerCase() && !m.author.bot;
        const collector = targetChannel.createMessageCollector({ filter, max: 1, time: 10 * 60 * 1000 }); // 10 minutes max

        collector.on('collect', async m => {
            activeGames.delete(targetChannel.id);
            // Lock immediately
            await targetChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: false
            }).catch(err => console.error("Could not lock channel after win:", err));

            const winnerEmbed = new EmbedBuilder()
                .setTitle("🎉 We have a winner!")
                .setDescription(`🏆 ${m.author} got it correct!\n\nThe answer was **${answer}**.`)
                .setColor(COLORS.SUCCESS);

            const unlockBtn = new ButtonBuilder()
                .setCustomId('questioner_unlock')
                .setLabel('Unlock Channel')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🔓');
            const row = new ActionRowBuilder().addComponents(unlockBtn);

            await targetChannel.send({ content: `${m.author}`, embeds: [winnerEmbed], components: [row] });
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'time' && collected.size === 0) {
                activeGames.delete(targetChannel.id);
                await targetChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                    SendMessages: false
                }).catch(err => console.error("Could not lock channel after timeout:", err));
                
                const timeoutEmbed = new EmbedBuilder()
                    .setTitle("⏰ Time's up!")
                    .setDescription(`No one got the correct answer.\n\nThe answer was **${answer}**.`)
                    .setColor(COLORS.DANGER);

                const unlockBtn = new ButtonBuilder()
                    .setCustomId('questioner_unlock')
                    .setLabel('Unlock Channel')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔓');
                const row = new ActionRowBuilder().addComponents(unlockBtn);

                await targetChannel.send({ embeds: [timeoutEmbed], components: [row] }).catch(() => {});
            }
        });

    } catch (err) {
        console.error("Error in questioner game:", err);
        activeGames.delete(targetChannel.id);
        await interaction.followUp({ content: "❌ An error occurred while starting the game. Ensure the bot has permissions to manage roles/channels.", flags: MessageFlags.Ephemeral }).catch(() => {});
    }
}

async function performPurge(channelId, attachmentUrl, client) {
    try {
        const channel = await client.channels.fetch(channelId).catch(() => null);
        if (!channel) {
            // Channel doesn't exist anymore, clean up timer
            if (autoDeleteTimers.has(channelId)) {
                clearInterval(autoDeleteTimers.get(channelId));
                autoDeleteTimers.delete(channelId);
            }
            return;
        }

        let fetched;
        do {
            fetched = await channel.messages.fetch({ limit: 100 });
            if (fetched.size > 0) {
                await channel.bulkDelete(fetched, true).catch(() => {});
            }
        } while (fetched.size >= 100);

        const embed = new EmbedBuilder()
            .setTitle("<:taco:1510341575731974194> Channel Purged")
            .setDescription("<a:redalert:1537546268493218005> The channel has been purged successfully for safety reasons")
            .setColor(COLORS.PRIMARY) // #F2B233
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() });

        if (attachmentUrl) {
            embed.setThumbnail(attachmentUrl);
        } else {
            embed.setThumbnail('https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjZmcXN3N3VoNjA4MGpyc2h2NHA5bzN4NmdpMDAwdXY0eGo4MW54eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Stm1o2JXQwDJgb0JCB/giphy.gif');
        }

        const msg = await channel.send({ embeds: [embed] });
        await msg.pin().catch(() => {});
    } catch (err) {
        if (err.code === 10003) {
            // Unknown channel, clear the timer
            if (autoDeleteTimers.has(channelId)) {
                clearInterval(autoDeleteTimers.get(channelId));
                autoDeleteTimers.delete(channelId);
            }
        } else {
            console.error("Failed to execute periodic purge:", err);
        }
    }
}

async function handleSetupAutoDeleteCommand(interaction) {
    const attachment = interaction.options.getAttachment('logo');
    const intervalMinutes = interaction.options.getInteger('interval');
    
    await interaction.reply({ content: `✅ Setup successful! The channel will now auto-purge every ${intervalMinutes} minutes.`, flags: MessageFlags.Ephemeral }).catch(() => {});

    try {
        const channel = interaction.channel;
        const client = interaction.client;
        const attachmentUrl = attachment ? attachment.url : null;
        
        // Clear any existing timer for this channel
        if (autoDeleteTimers.has(channel.id)) {
            clearInterval(autoDeleteTimers.get(channel.id));
        }
        
        // Perform an immediate purge
        await performPurge(channel.id, attachmentUrl, client);

        // Set up the recurring purge
        const timer = setInterval(() => {
            performPurge(channel.id, attachmentUrl, client);
        }, intervalMinutes * 60 * 1000);
        
        autoDeleteTimers.set(channel.id, timer);

    } catch (err) {
        console.error("Failed to setup auto purge:", err);
    }
}

async function handlePollCommand(interaction) {
    const question = interaction.options.getString('question');
    const option1 = interaction.options.getString('option_1');
    const option2 = interaction.options.getString('option_2');
    const option3 = interaction.options.getString('option_3');
    const option4 = interaction.options.getString('option_4');
    const option5 = interaction.options.getString('option_5');
    const thumbnail = interaction.options.getAttachment('thumbnail');

    const options = [option1, option2, option3, option4, option5].filter(Boolean);
    
    const pollData = {
        authorId: interaction.user.id,
        authorName: interaction.member?.nickname || interaction.user.username,
        question: question,
        options: options.map(opt => ({ text: opt, votes: new Set() })),
        thumbnailUrl: thumbnail ? thumbnail.url : null,
        ended: false,
        startTime: Date.now(),
        endTime: null
    };

    const embed = generatePollEmbed(pollData);
    
    const row1 = new ActionRowBuilder();
    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
    
    options.forEach((opt, idx) => {
        row1.addComponents(
            new ButtonBuilder()
                .setCustomId(`poll_vote_${idx}`)
                .setLabel(`Option ${idx + 1}`)
                .setEmoji(emojis[idx])
                .setStyle(ButtonStyle.Primary)
        );
    });

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`poll_end`)
            .setLabel(`End Poll`)
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🏁')
    );

    await interaction.reply({
        embeds: [embed],
        components: [row1, row2]
    });

    const message = await interaction.fetchReply();
    activePolls.set(message.id, pollData);
}

function generatePollEmbed(pollData) {
    const embed = new EmbedBuilder()
        .setTitle(`📊 ${pollData.question.toUpperCase()}`)
        .setColor(COLORS.PRIMARY);
    
    if (pollData.thumbnailUrl) {
        embed.setThumbnail(pollData.thumbnailUrl);
    }

    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
    const totalVotes = pollData.options.reduce((sum, opt) => sum + opt.votes.size, 0);

    let description = '';
    pollData.options.forEach((opt, idx) => {
        const voteCount = opt.votes.size;
        const percentage = totalVotes === 0 ? 0 : Math.round((voteCount / totalVotes) * 100);
        
        const filledBlocks = Math.round(percentage / 10);
        const emptyBlocks = 10 - filledBlocks;
        const bar = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

        description += `${emojis[idx]} **${opt.text}**\n`;
        description += `${bar} ${percentage}% (${voteCount} vote${voteCount === 1 ? '' : 's'})\n\n`;
    });

    if (pollData.ended) {
        description += `🏁 **Poll Ended**\n<t:${Math.floor(pollData.endTime / 1000)}:f>\n\n`;
    }

    embed.setDescription(description.trim());
    
    if (pollData.authorName) {
        embed.setFooter({ text: `Poll by ${pollData.authorName}` }).setTimestamp(pollData.startTime);
    }

    return embed;
}

async function handlePollVote(interaction) {
    const messageId = interaction.message.id;
    const pollData = activePolls.get(messageId);
    
    if (!pollData) {
        return interaction.reply({ content: "❌ This poll is no longer active in memory.", flags: MessageFlags.Ephemeral });
    }
    if (pollData.ended) {
        return interaction.reply({ content: "❌ This poll has already ended.", flags: MessageFlags.Ephemeral });
    }

    const optionIndex = parseInt(interaction.customId.replace('poll_vote_', ''));
    const userId = interaction.user.id;

    pollData.options.forEach(opt => opt.votes.delete(userId));
    pollData.options[optionIndex].votes.add(userId);

    const embed = generatePollEmbed(pollData);
    await interaction.update({ embeds: [embed] });
}

async function handlePollEnd(interaction) {
    const messageId = interaction.message.id;
    const pollData = activePolls.get(messageId);
    
    if (!pollData) {
        return interaction.reply({ content: "❌ This poll is no longer active in memory.", flags: MessageFlags.Ephemeral });
    }

    const isAdmin = interaction.member.permissions.has(PermissionFlagsBits.ManageMessages);
    if (pollData.authorId !== interaction.user.id && !isAdmin) {
        return interaction.reply({ content: "❌ Only the poll author or staff can end this poll.", flags: MessageFlags.Ephemeral });
    }

    if (pollData.ended) {
        return interaction.reply({ content: "❌ This poll has already ended.", flags: MessageFlags.Ephemeral });
    }

    pollData.ended = true;
    pollData.endTime = Date.now();

    const embed = generatePollEmbed(pollData);
    
    const newComponents = interaction.message.components.map(row => {
        return new ActionRowBuilder().addComponents(
            row.components.map(component => ButtonBuilder.from(component).setDisabled(true))
        );
    });

    await interaction.update({ embeds: [embed], components: newComponents });
}

// ─── Initialization deployment ───────────────────────────────────────────────
client.once('ready', async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    try {
        const commandsToDeploy = [
                {
                    name: 'lock',
                    description: 'Lock the current channel',
                    defaultMemberPermissions: PermissionFlagsBits.ManageChannels
                },
                {
                    name: 'unlock',
                    description: 'Unlock the current channel',
                    defaultMemberPermissions: PermissionFlagsBits.ManageChannels
                },
                {
                    name: 'add',
                    description: 'Add a user to the current ticket',
                    options: [
                        {
                            name: 'user',
                            description: 'The user to add to the ticket',
                            type: ApplicationCommandOptionType.User,
                            required: true
                        }
                    ]
                },
                {
                    name: 'panel',
                    description: 'Send the Nachos Marketplace ticket panel',
                    defaultMemberPermissions: PermissionFlagsBits.ManageGuild
                },
                {
                    name: 'middleman-request',
                    description: 'Send the Middleman Request panel',
                    defaultMemberPermissions: PermissionFlagsBits.ManageGuild
                },
                {
                    name: 'close',
                    description: 'Close the current ticket channel',
                },
                {
                    name: 'restock_setup',
                    description: 'Set up a restock notification role panel',
                    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
                    options: [
                        {
                            name: 'role',
                            description: 'The role to give users',
                            type: ApplicationCommandOptionType.Role,
                            required: true
                        },
                        {
                            name: 'emoji',
                            description: 'The emoji to display on the message and button',
                            type: ApplicationCommandOptionType.String,
                            required: true
                        }
                    ]
                },
                {
                    name: 'questioner',
                    description: 'Start a guessing game',
                    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
                    options: [
                        {
                            name: 'question',
                            description: 'The question people have to answer',
                            type: ApplicationCommandOptionType.String,
                            required: true
                        },
                        {
                            name: 'answer',
                            description: 'The correct answer',
                            type: ApplicationCommandOptionType.String,
                            required: true
                        },
                        {
                            name: 'channel',
                            description: 'The channel where the game will be posted',
                            type: ApplicationCommandOptionType.Channel,
                            channelTypes: [ChannelType.GuildText],
                            required: true
                        },
                        {
                            name: 'title',
                            description: 'The title of the question/game',
                            type: ApplicationCommandOptionType.String,
                            required: false
                        },
                        {
                            name: 'attachment',
                            description: 'Optional image/file attachment',
                            type: ApplicationCommandOptionType.Attachment,
                            required: false
                        }
                    ]
                },
                {
                    name: 'poll',
                    description: 'Create a poll with up to 5 options',
                    defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
                    options: [
                        {
                            name: 'question',
                            description: 'The question for the poll',
                            type: ApplicationCommandOptionType.String,
                            required: true
                        },
                        {
                            name: 'option_1',
                            description: 'First option',
                            type: ApplicationCommandOptionType.String,
                            required: true
                        },
                        {
                            name: 'option_2',
                            description: 'Second option',
                            type: ApplicationCommandOptionType.String,
                            required: true
                        },
                        {
                            name: 'option_3',
                            description: 'Third option',
                            type: ApplicationCommandOptionType.String,
                            required: false
                        },
                        {
                            name: 'option_4',
                            description: 'Fourth option',
                            type: ApplicationCommandOptionType.String,
                            required: false
                        },
                        {
                            name: 'option_5',
                            description: 'Fifth option',
                            type: ApplicationCommandOptionType.String,
                            required: false
                        },
                        {
                            name: 'thumbnail',
                            description: 'Optional image to show as a thumbnail',
                            type: ApplicationCommandOptionType.Attachment,
                            required: false
                        }
                    ]
                },
                {
                    name: 'setupautodelete',
                    description: 'Setup automatic recurring channel purge (deletes messages, does not delete channel)',
                    defaultMemberPermissions: PermissionFlagsBits.ManageChannels,
                    options: [
                        {
                            name: 'interval',
                            description: 'Interval in minutes to auto-delete messages',
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                            minValue: 1
                        },
                        {
                            name: 'logo',
                            description: 'Optional image or GIF for the thumbnail',
                            type: ApplicationCommandOptionType.Attachment,
                            required: false
                        }
                    ]
                },
                {
                    name: 'embed',
                    description: 'Create a highly-customizable aesthetic embed message',
                    defaultMemberPermissions: PermissionFlagsBits.ManageMessages, // Only staff with Manage Messages should use this
                    options: [
                        {
                            name: 'message',
                            description: 'The main text inside the embed (use \\n for line breaks)',
                            type: ApplicationCommandOptionType.String,
                            required: true
                        },
                        {
                            name: 'color',
                            description: 'Hex color code for the sidebar (e.g. #FF0000)',
                            type: ApplicationCommandOptionType.String,
                            required: true
                        },
                        {
                            name: 'title',
                            description: 'Optional title text',
                            type: ApplicationCommandOptionType.String,
                            required: false
                        },
                        {
                            name: 'footer',
                            description: 'Optional footer text',
                            type: ApplicationCommandOptionType.String,
                            required: false
                        },
                        {
                            name: 'attachment',
                            description: 'Optional image attachment for the embed',
                            type: ApplicationCommandOptionType.Attachment,
                            required: false
                        }
                    ]
                },
                {
                    name: 'massdm',
                    description: 'DM all members with a specific role (Admin only)',
                    options: [
                        {
                            name: 'role',
                            description: 'The role whose members will receive the message',
                            type: ApplicationCommandOptionType.Role,
                            required: true
                        },
                        {
                            name: 'message',
                            description: 'The message to send to the members',
                            type: ApplicationCommandOptionType.String,
                            required: true
                        }
                    ]
                }
        ];

        // Deploy slash commands:
        // 1. First deploy to all joined guilds directly
        const joinedGuilds = await client.guilds.fetch();
        console.log(`ℹ️ Bot is currently in ${joinedGuilds.size} guild(s).`);

        for (const [id, oauthGuild] of joinedGuilds) {
            try {
                const guild = await oauthGuild.fetch();
                await guild.commands.set(commandsToDeploy);
                console.log(`✅ Slash commands deployed to guild "${guild.name}" (${id})`);
            } catch (err) {
                console.warn(`⚠️ Could not deploy slash commands to joined guild ${id}:`, err.message);
            }
        }

        // 2. Also attempt specified GUILD_IDS (only if bot is in them or can fetch them)
        for (const guildId of GUILD_IDS) {
            if (joinedGuilds.has(guildId)) continue; // already deployed above
            try {
                const guild = await client.guilds.fetch(guildId).catch(() => null);
                if (guild) {
                    await guild.commands.set(commandsToDeploy);
                    console.log(`✅ Slash commands deployed to configured guild ${guildId}`);
                } else {
                    console.warn(`⚠️ Bot has not joined guild ${guildId} yet. Invite the bot to the server to enable commands.`);
                }
            } catch (guildErr) {
                console.warn(`⚠️ Could not reach guild ${guildId} (${guildErr.message}). Ensure bot is invited.`);
            }
        }

        // 3. Deploy globally so slash commands propagate anywhere the bot is invited
        try {
            await client.application.commands.set(commandsToDeploy);
            console.log("✅ Slash commands deployed globally to application.");
        } catch (globalErr) {
            console.warn("⚠️ Global command registration notice:", globalErr.message);
        }
    } catch (err) {
        console.error("Failed running sync setup:", err);
    }
});

// Auto-register commands when invited to a new server
client.on('guildCreate', async (guild) => {
    try {
        console.log(`🎉 Joined new guild: "${guild.name}" (${guild.id}). Syncing slash commands...`);
        const commands = await client.application.commands.fetch();
        if (commands && commands.size > 0) {
            await guild.commands.set(commands.map(cmd => cmd));
            console.log(`✅ Slash commands deployed immediately to newly joined guild "${guild.name}"`);
        }
    } catch (err) {
        console.warn(`⚠️ Failed registering commands on new guild join for ${guild.id}:`, err.message);
    }
});


async function handleAddCommand(interaction) {
    if (!openTickets.has(interaction.channel.id)) {
        return interaction.reply({ content: "❌ This command can only be used in a ticket channel.", flags: MessageFlags.Ephemeral });
    }

    const targetUser = interaction.options.getUser('user');
    
    try {
        await interaction.channel.permissionOverwrites.edit(targetUser.id, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            AttachFiles: true
        });
        
        await interaction.reply({ content: `✅ Successfully added <@${targetUser.id}> to the ticket.` });
    } catch (err) {
        console.error("Error adding user to ticket:", err);
        await interaction.reply({ content: "❌ Failed to add user to the ticket. Please check my permissions.", flags: MessageFlags.Ephemeral });
    }
}


async function handleMassDmCommand(interaction) {
    if (interaction.user.id !== "1421835488808931441" && interaction.user.id !== STAFF_USER_ID) {
        return interaction.reply({
            content: "❌ You are not authorized to use this command. Only user <@1421835488808931441> can use `/massdm`.",
            flags: MessageFlags.Ephemeral
        });
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const role = interaction.options.getRole('role');
    const messageContent = interaction.options.getString('message');

    let members = [];
    try {
        await interaction.guild.members.fetch();
        const freshRole = await interaction.guild.roles.fetch(role.id);
        const roleMembers = freshRole ? freshRole.members : role.members;
        members = Array.from(roleMembers.values()).filter(m => !m.user.bot);
    } catch (e) {
        console.error("Error fetching role members for massdm:", e);
        members = Array.from(role.members.values()).filter(m => !m.user.bot);
    }

    const total = members.length;
    if (total === 0) {
        return interaction.editReply({
            content: `❌ No non-bot members found with the role <@&${role.id}>.`
        });
    }

    let sent = 0;
    let failed = 0;
    let lastUpdate = Date.now();

    const buildProgressEmbed = (isDone = false) => {
        const remaining = total - (sent + failed);
        const percent = Math.round(((sent + failed) / total) * 100);
        return new EmbedBuilder()
            .setTitle(isDone ? "✅ Mass DM Completed" : "📨 Mass DM In Progress...")
            .setColor(isDone ? COLORS.SUCCESS : COLORS.PRIMARY)
            .setDescription(`**Target Role:** <@&${role.id}> (${role.name})\n**Message Preview:**\n> ${messageContent.length > 300 ? messageContent.slice(0, 300) + '...' : messageContent}`)
            .addFields(
                { name: "👥 Total Users", value: `${total}`, inline: true },
                { name: "✅ Sent", value: `${sent}`, inline: true },
                { name: "❌ Failed", value: `${failed}`, inline: true },
                { name: "⏳ Remaining", value: `${remaining}`, inline: true },
                { name: "📊 Progress", value: `${percent}% (${sent + failed}/${total})`, inline: true },
                { name: "⚡ Status", value: isDone ? "Finished 🎉" : "Sending 1 by 1 (1.5s delay)", inline: true }
            )
            .setFooter({ text: "Nachos Marketplace • Mass DM" })
            .setTimestamp();
    };

    await interaction.editReply({ embeds: [buildProgressEmbed(false)] });

    for (const member of members) {
        // Safe exit: if bot was kicked/removed from the server during execution, stop immediately
        if (!interaction.client.guilds.cache.has(interaction.guildId)) {
            console.warn(`[MassDM] Bot was kicked from guild ${interaction.guildId}. Halting operations safely.`);
            break;
        }

        try {
            await member.send({ content: messageContent });
            sent++;
        } catch (dmErr) {
            // Cannot DM user (DMs disabled, blocked bot, or no mutual guild)
            failed++;
        }

        // Update embed every 5 seconds
        if (Date.now() - lastUpdate >= 5000) {
            await interaction.editReply({ embeds: [buildProgressEmbed(false)] }).catch(() => {});
            lastUpdate = Date.now();
        }

        // 1.5s safe delay to avoid rate limits
        await new Promise(r => setTimeout(r, 1500));
    }

    await interaction.editReply({ embeds: [buildProgressEmbed(true)] }).catch(() => {});
}
if (!TOKEN || typeof TOKEN !== 'string' || TOKEN.trim() === '') {
    console.warn("⚠️ [Discord Bot] No TOKEN configured. Please set DISCORD_TOKEN in your environment.");
} else {
    client.login(TOKEN).catch((err) => {
        console.error("⚠️ [Discord Bot] Login failed (check DISCORD_TOKEN validity / intents):", err.message);
    });
}

