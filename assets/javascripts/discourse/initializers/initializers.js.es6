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
				dir (post);
				dir (Discourse.SiteSettings.discourse_private_tag_plugin_enabled);
				dir (Discourse.SiteSettings.discourse_private_tag_plugin_forbidden_tags);

				if (user === null && Discourse.SiteSettings.discourse_private_tag_plugin_enabled) {
					if (post.topic !== null && post.topic.tags !== null && post.topic.tags.length > 0) {
						dir (post.topic.tags);
					}

					post.cooked = "Plugin discourse-private-tag-plugin has hidden this post.";
				}
				else
				{
					// TODO remove this.
					post.cooked = "OK " + post.cooked;
				}
			});
		});
	}
}