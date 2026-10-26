import { apiInitializer } from "discourse/lib/api";
import getURL from "discourse/lib/get-url";
import { scriptAttributes, shouldSkip } from "../lib/privatus-analytics.js";

const MARK = "data-privatus-discourse";

// Adds the Privatus Analytics tracker to the page once, when the forum boots.
//
// Discourse changes pages with history.pushState. The tracker follows
// pushState by itself (data-spa="auto", its default), so every topic and list
// view is counted once and no api.onPageChange hook is needed. Adding one
// would count every page twice.
//
// The tag is added from JavaScript, not from head_tag.html, so that staff can
// be left out (the current user is only known here). Discourse's content
// security policy uses 'strict-dynamic', which lets a script added by the
// theme's own JavaScript load.
export default apiInitializer((api) => {
  if (document.querySelector(`script[${MARK}]`)) {
    return;
  }
  if (shouldSkip(api.getCurrentUser(), settings.do_not_count)) {
    return;
  }

  const attrs = scriptAttributes(settings, { basePath: getURL("/") });
  if (!attrs) {
    return;
  }

  const script = document.createElement("script");
  script.defer = true;
  Object.entries(attrs).forEach(([name, value]) =>
    script.setAttribute(name, value)
  );
  script.setAttribute(MARK, "");
  document.head.appendChild(script);
});
