import { withPluginApi } from 'discourse/lib/plugin-api';

export default {
	name: 'discourse-private-tag-plugin',
	initialize() {
		withPluginApi('0.8.18', api => {
			let user = api.getCurrentUser();

			api.includePostAttributes('topic');

			api.addPostTransformCallback((post) => {
				if (user === null) {
					console.log("Running plugin on post...");
					console.dir(post);
					post.cooked = "Plugin discourse-private-tag-plugin has hidden this post.";
				}
			});
		});
	}
}