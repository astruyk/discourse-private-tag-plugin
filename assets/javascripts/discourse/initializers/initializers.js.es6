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
				console.dir (post);
				console.dir (post.topic.tags);
				console.dir (Discourse.SiteSettings.discourse_private_tag_plugin_enabled);
				console.dir (Discourse.SiteSettings.discourse_private_tag_plugin_forbidden_tags);

				if (user === null && Discourse.SiteSettings.discourse_private_tag_plugin_enabled) {
					let foundForbiddenTag = false;
					if (post.topic.tags.length > 0) {
						let forbiddenTags = Discourse.SiteSettings.discourse_private_tag_plugin_forbidden_tags.split(',');
						let foundTags = post.topic.tags.filter((tag) => (forbiddenTags.indexOf(tag) === -1));
						foundForbiddenTag = foundTags.length > 0;
					}

					if (foundForbiddenTag) {
						post.cooked = "<span class=\"discourse_private_tag_plugin_hidden\">Posts in this topic are not visible to users that are not logged in.</span>";
					}
				}
			});
		});
	}
}