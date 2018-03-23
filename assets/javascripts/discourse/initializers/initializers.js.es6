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
					
					console.dir($(".tag-private"));

					let foundForbiddenTag = false;
					if (post.topic.tags.length > 0) {
						// Figure out what the tags on the post are, and what tags we don't want to allow.
						let forbiddenTags = Discourse.SiteSettings.discourse_private_tag_plugin_forbidden_tags
							.split(',')
							.map((item) => item.trim().toLowerCase());
						let postTags = post.topic.tags;

						// Search for any of the tags that we don't want to allow.
						let foundTags = postTags.filter((tag) => (forbiddenTags.indexOf(tag.toLowerCase()) !== -1));
						foundForbiddenTag = foundTags.length > 0;
					}

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