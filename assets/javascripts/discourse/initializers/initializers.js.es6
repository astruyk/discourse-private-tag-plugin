import { withPluginApi } from 'discourse/lib/plugin-api';

export default {
	name: 'discourse-private-tag-plugin',
	initialize() {
		withPluginApi('0.8.18', api => {
			let user = api.getCurrentUser();

			// We need to include the 'topic' object so that we can get the tags from it.
			// TODO there must be a better way to do this...
			api.includePostAttributes('topic');

			api.addPostTransformCallback((post) => {
				if (user === null && Discourse.SiteSettings.discourse_private_tag_plugin_enabled) {
					if (post.topic !== null && post.topic.tags !== null && post.topic.tags.length > 0) {
						console.log("Tags: " + post.topic.tags);
						console.log("Forbidden: " + Discourse.SiteSettings.discourse_private_tag_plugin_keys)
					}

					post.cooked = "Plugin discourse-private-tag-plugin has hidden this post.";
				}
			});
		});
	}
}