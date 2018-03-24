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
					let forbiddenTags = Discourse.SiteSettings.discourse_private_tag_plugin_forbidden_tags
						.split(',')
						.map((item) => item.trim().toLowerCase());

					// Determine if we had any of the forbidden tags or not.
					let postTags = post.topic.tags.map((item) => item.trim().toLowerCase());
                    let foundTags = forbiddenTags.filter((tag) => (postTags.indexOf(tag) !== -1));
					if (foundTags.length > 0) {
						post.cooked = "<div class=\"discourse_private_tag_plugin_hidden\">" +
							Discourse.SiteSettings.discourse_private_tag_plugin_hidden_message +
							"</div>";
					}
				}
			});
		});
	}
}