import { withPluginApi } from 'discourse/lib/plugin-api';

export default {
	name: 'discourse-private-tag-plugin',
	initialize() {
		withPluginApi('0.8.18', api => {
			let user = api.getCurrentUser();
			api.addPostTransformCallback((t) => {
				if (user === null) {
					t.cooked = "Plugin discourse-private-tag-plugin has hidden this post.";
				}
			});
		});
	}
}