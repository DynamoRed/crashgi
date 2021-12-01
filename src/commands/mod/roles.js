const conf = require('../../../conf');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { group } = require('console');

const rolesData = {
	'775007031412523040': {
		groups: [
			{
				label: 'Global Roles',
				color: '#FFBD00',
				description: 'Nisi sint id commodo officia nisi quis.',
				roles: [
					{
						id: '775007027097108523',
						emoji: '<:c_:884112642443190342>',
					}
				],
			},
			{
				label: 'Test roles',
				color: '#0060FF',
				description: 'Tempor incididunt id do et amet sint in.',
				roles: [
					{
						id: '775007027134070790',
						emoji: '<:Kappa:895274655978487878>',
					},
					{
						id: '775007027125551110',
						emoji: '<:hennoued:895282405118717992>',
					}
				]
			}
		]
	},
}

let serverRolesData = rolesData['775007031412523040'];
let optionsGroups = [];
for(let i = 0; i < serverRolesData.groups.length; i++)
	optionsGroups.push([serverRolesData.groups[i].label, serverRolesData.groups[i].label.trim().toLowerCase()]);


module.exports = {
	data: new SlashCommandBuilder()
		.setName('roles')
		.setDescription(`Adding/removing/getting auto-added roles`)
		.addSubcommand(scmd => scmd
			.setName('add')
			.setDescription('Add a new role')
			.addRoleOption(opt => opt.setName('role_mention').setDescription('Role mention').setRequired(true))
			.addStringOption(opt => opt.setName('role_emoji').setDescription('Role emoji').setRequired(true))
			.addStringOption(opt => opt
				.setName('role_group')
				.setDescription('Role group')
				.setRequired(true)
				.addChoices(optionsGroups)))
		.addSubcommand(scmd => scmd
			.setName('remove')
			.setDescription('Remove a role')
			.addRoleOption(opt => opt.setName('role_mention').setDescription('Role mention').setRequired(true)))
		.addSubcommandGroup(grp => grp
			.setName('groups')
			.setDescription("Manage roles groups")
			.addSubcommand(scmd => scmd
				.setName('add')
				.setDescription('Add a new role group')
				.addStringOption(opt => opt.setName('group_name').setDescription('Group name').setRequired(true))
				.addStringOption(opt => opt.setName('group_color').setDescription('Group color (Format: #ffffff)').setRequired(true))
				.addStringOption(opt => opt.setName('group_description').setDescription('Group description').setRequired(true)))
			.addSubcommand(scmd => scmd
				.setName('remove')
				.setDescription('Remove a role group')
				.addStringOption(opt => opt
					.setName('group_name')
					.setDescription('Group name')
					.setRequired(true)
					.addChoices(optionsGroups)
				)
			)
		)
		.addSubcommand(scmd => scmd
			.setName('get')
			.setDescription('Send message with auto-added roles')),

	async execute(interaction, bot) {
		if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return interaction.reply({embeds: [bot.errorEmbed(`Vous n'avez pas la permission de faire cela !`)]});

		if(interaction.options._group === "groups"){
			switch(interaction.options._subcommand){
				case 'add':
					await interaction.reply({content: 'Group added successfully !', ephemeral: true});
					break;
	
				case 'remove':
					await interaction.reply({content: 'Group removed successfully !', ephemeral: true});
					break;
	
				default: 
					await interaction.reply({content: 'Unknown command !', ephemeral: true});
					break;
			}
		} else {
			switch(interaction.options._subcommand){
				case 'add':
					await interaction.reply({content: 'Role added successfully !', ephemeral: true});
					break;
	
				case 'remove':
					await interaction.reply({content: 'Role removed successfully !', ephemeral: true});
					break;
	
				case 'get':
				default: 
					for(let i = 0; i < serverRolesData.groups.length; i++){
						let rolesOptions = [];

						for(let y = 0; y < serverRolesData.groups[i].roles.length; y++){
							let serverRole = interaction.guild.roles.cache.get(serverRolesData.groups[i].roles[y].id);
							let roleEmojiSplitted = serverRolesData.groups[i].roles[y].emoji.split(':');

							let roleComp = {
								label: serverRole.name,
								description: 'Aide en C',
								value: serverRole.id,
								emoji: {
									name: roleEmojiSplitted[1],
									id: roleEmojiSplitted[2],
								}
							}

							rolesOptions.push(roleComp);
						}

						const row = new MessageActionRow()
						.addComponents(
							new MessageSelectMenu()
								.setCustomId(`select${serverRolesData.groups[i].label.trim().toLowerCase()}`)
								.setPlaceholder('Aucun rôles séléctionné')
								.setMinValues(1)
								.setMaxValues(serverRolesData.groups[i].roles.length)
								.addOptions(rolesOptions),
						)

						let embedCategory = '';
						let embedCategoryCounter = Math.round((27 - serverRolesData.groups[i].label.length/2)/2);

						for(let z = 0; z < embedCategoryCounter; z++) embedCategory += ' ';
						embedCategory += serverRolesData.groups[i].label;
						for(let z = 0; z < embedCategoryCounter; z++) embedCategory += ' ';

						const groupEmbed = new MessageEmbed()
						.setColor(serverRolesData.groups[i].color)
						.setDescription(`━━━━━━━━━━━━━▼━━━━━━━━━━━━━
						**${embedCategory}**

						_${serverRolesData.groups[i].description}_
						━━━━━━━━━━━━━▲━━━━━━━━━━━━━`)

						interaction.channel.send({embeds: [groupEmbed], components: [row]});
					}

					await interaction.reply({content: 'Interaction successfully sent !', ephemeral: true});

					break;
			}	
		}
	}
};