import { withPluginApi } from 'discourse/lib/plugin-api';

export default {
	name: 'discourse-private-tag-plugin',
	initialize() {
		withPluginApi('0.8.18', api => {
			let user = api.getCurrentUser();

			api.addPostTransformCallback((post) => {
				if (user === null && Discourse.SiteSettings.discourse_private_tag_plugin_enabled) {
					let foundForbiddenTag = false;
					let forbiddenTags = Discourse.SiteSettings.discourse_private_tag_plugin_forbidden_tags
						.split(',')
						.map((item) => item.trim().toLowerCase());

					// This is a bit hacky, but for each tag on this post there is a '.tag-<tagName>' class present
					// So if we find any of the forbidden tags, we know we should hide this post.
					console.dir(forbiddenTags);
					let foundTags = forbiddenTags.filter((tag) => ($(".tag-" + tag).length > 0));
					console.dir(foundTags);
					foundForbiddenTag = foundTags.length > 0;
					console.dir(foundForbiddenTag);

					if (foundForbiddenTag) {
						post.cooked = "<div class=\"discourse_private_tag_plugin_hidden\">" +
							Discourse.SiteSettings.discourse_private_tag_plugin_hidden_message +
							"</div>";
					}
				}
			});
		});
	}
}