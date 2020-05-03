const Discord = require("discord.js");
const bot = new Discord.Client();
const token = "no token for u";


let news = ["live", "maintenance"];
let gacha = ["higher rate"];
let pv = ["PV", "Trailer"];

/**
 * @param {string} pattern
 * @return {number[]}
 */

function buildPatternTable(pattern) {
	const patternTable = [0];
	let prefixIdx = 0;
	let suffixIdx = 1;

	while (suffixIdx < pattern.length) {
		if (pattern[prefixIdx] === pattern[suffixIdx]) {
			patternTable[suffixIdx] = prefixIdx + 1;
			suffixIdx += 1;
			prefixIdx += 1;
		} else if (prefixIdx === 0) {
			patternTable[suffixIdx] = 0;
			suffixIdx += 1;
		} else {
			prefixIdx = patternTable[prefixIdx - 1];
		}
	}

	return patternTable;
}

/**
 * @param {string} text
 * @param {string} pattern
 * @return {boolean}
 */

function knuthMorrisPratt(text, pattern) {
	if (pattern.length === 0) {
		return false;
	}

	let textIdx = 0;
	let patternIdx = 0;

	const patternTable = buildPatternTable(pattern);

	while (textIdx < text.length) {
		if (text[textIdx] === pattern[patternIdx]) {
			if (patternIdx === pattern.length - 1) {
				return true; //pattern ditemukan
			}

			patternIdx += 1;
			textIdx += 1;
		} else if (patternIdx > 0) {
			patternIdx = patternTable[patternIdx - 1];
		} else {
			patternIdx = 0;
			textIdx += 1;
		}
	}

	return false;
}

/**
 * @param {string} text
 * @return {string}
 */

function categorize(text) {
	for (let i = 0; i < news.length; i++) {
		if (knuthMorrisPratt(text, news[i])) {
			return "news";
		}
	}

	for (let i = 0; i < gacha.length; i++) {
		if (knuthMorrisPratt(text, gacha[i])) {
			return "gacha";
		}
	}

	for (let i = 0; i < pv.length; i++) {
		if (knuthMorrisPratt(text, pv[i])) {
			return "pv";
		}
	}
}

bot.on("ready", () => {
	console.log("Bot is Online");
});

bot.on("message", (msg) => {
	let category = categorize(msg.content);
	switch (category) {
		case "news":
			msg.channel.send("@everyone news for arknights");
			break;
		case "gacha":
			msg.channel.send("@everyone new gacha info");
			break;
		case "pv":
			msg.channel.send("@everyone new promotional video is out");
			break;
		default:
			break;
	}
});

bot.login(token);
