import type { FriendLink, FriendsPageConfig } from "../types/config";

// 可以在src/content/spec/friends.md中编写友链页面下方的自定义内容

// 友链页面配置
export const friendsPageConfig: FriendsPageConfig = {
	// 页面标题，如果留空则使用 i18n 中的翻译
	title: "友情链接",

	// 页面描述文本，如果留空则使用 i18n 中的翻译
	description: "一些值得访问的朋友和站点。",

	// 是否显示底部自定义内容（friends.mdx 中的内容）
	showCustomContent: false,

	// 是否显示评论区，需要先在commentConfig.ts启用评论系统
	showComment: false,

	// 是否开启随机排序配置，如果开启，就会忽略权重，构建时进行一次随机排序
	randomizeSort: false,
};

// 友链配置
export const friendsConfig: FriendLink[] = [
	{
		title: "我滴Luogu Blog",
		imgurl: "https://cdn.luogu.com.cn/upload/image_hosting/1n1ayx4m.png",
		desc: "更多的东西还没搬过来呢……嘶……",
		siteurl: "https://www.luogu.com.cn/blog/virus2017/",
		tags: ["Blog", "Luogu"],
		weight: 10, // 权重，数字越大排序越靠前
		enabled: true, // 是否启用
	},
	{
		title: "闪烁之狐",
		imgurl: "http://image.luokangyuan.com/4027734.jpeg",
		desc: "编程界大佬，技术牛，人还特别好，不懂的都可以请教大佬",
		siteurl: "https://blinkfox.github.io/",
		tags: ["Blog"],
		weight: 9,
		enabled: true,
	},
];

// 获取启用的友链并进行排序
export const getEnabledFriends = (): FriendLink[] => {
	const friends = friendsConfig.filter((friend) => friend.enabled);

	if (friendsPageConfig.randomizeSort) {
		return friends.sort(() => Math.random() - 0.5);
	}

	return friends.sort((a, b) => b.weight - a.weight);
};
