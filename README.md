# Privatus Analytics for Discourse

**See how many people visit your Discourse forum, which topics they read and
where they came from. No cookies, honest numbers, and a dashboard you
understand in seconds.**

This is a theme component, so it works on every Discourse site, hosted ones
included. You install it from this repository's address in your admin
panel. No server access is needed.

## The problem

You run a forum and want to know if it is growing. Most analytics tools make
that hard. Google Analytics is slow, confusing and sends what your members do
to Google. In many countries it also means showing a cookie pop-up (the box
that asks visitors to accept cookies). Many people click "reject", so you
never see them. Bots fill up the numbers that are left. And your own visits,
and your moderators' visits, get mixed in with your members'.

## The solution

Privatus Analytics counts visits to your forum without cookies and never
stores IP addresses. Bots are filtered out before they are counted. This
component adds the small Privatus Analytics script to your forum. You paste
your site id once in the component's settings and you are done.

## What you get

- **A dashboard you understand in seconds.** Visitors, top topics and where
  people came from, all on one screen.
- **Every topic counted once.** Discourse changes pages without a full
  reload. The tracker sees each page change by itself, so every topic and
  list someone opens is counted, and scrolling through a topic is not.
- **Your team left out.** Logged in admins and moderators are not counted,
  unless you change that.
- **No cookie pop-up needed for our analytics.** We set no cookies and store
  no personal data. Laws differ by country, so check your own legal advice.
- **Honest numbers.** Known bots and fake traffic are left out on every plan.
- **A fast forum.** The tracking script is about 3 KB and loads after your
  page.
- **Data you own.** We never sell it or show you ads, and you can pull it out
  any time through the API.

**Start free.** The Free plan has 10,000 events a month and 3 sites, with no
card. Every new account also gets 14 days of Pro free, with no card.
[Create your account](https://privatusanalytics.com).

## Requirements

- Discourse 3.3 or later. Hosted plans that let you install themes from a
  Git repository work too.
- A Privatus Analytics site id. It starts with `pa_`. You find it in Privatus
  Analytics under Site settings, Tracking.

## Install

1. In your forum, go to **Admin → Appearance → Themes and components**, open
   the **Components** tab and click **Install**.
2. Choose **From a git repository** and paste:

   ```
   https://github.com/Privatus-Analytics/discourse-privatus-analytics
   ```

3. Click **Install**, then add the component to your theme (or to every theme
   your members can pick).
4. Open the component's settings, paste your site id into **site id** and
   save.

Reload your forum in a private window and open your Privatus Analytics
dashboard. You show up in the live view within a few seconds.

More help: [how to install a theme or theme
component](https://meta.discourse.org/t/how-do-i-install-a-theme-or-theme-component/63682).

## Settings

| Setting | Default | What it does |
|---|---|---|
| **site id** | empty | Your Privatus Analytics site id, like `pa_7Q2K9XH3AB`. Leave it empty to turn tracking off. |
| **do not count** | `staff` | Who is left out while logged in. `staff` is admins and moderators, `admins` is admins only, `nobody` counts everyone. |
| **modules** | `engage,auto,vitals,clicks,ask` | Extra tracker features, split by commas. `engage` is time on page and scroll depth, `auto` is downloads, outside links and forms, `vitals` is page speed, `clicks` is click maps and `ask` is on-site surveys. Leave it empty to load none. See [modules](https://privatusanalytics.com/docs/tracker/modules). |
| **exclude paths** | `/admin`, `/admin/*` | Pages that are never counted. A `*` matches anything. On a forum in a subfolder (like `/forum`), the subfolder is added for you. |
| **script domain** | empty | Only if you serve the tracker from your own domain, like `stats.example.com`. The script then loads from there and the hits are sent there. |
| **debug** | off | Shows each hit in the browser console instead of sending it. Turn it on to check your setup, then turn it off. |
| **extend content security policy** | `script_src: https://privatusstats.com` | Lets older Discourse versions load the script. Add your script domain here if you set one. Newer versions do not need it. |

With a site id saved, the component adds this to the page `<head>`:

```html
<script defer src="https://privatusstats.com/js/pa.js" data-site="pa_7Q2K9XH3AB" data-modules="engage,auto,vitals,clicks,ask" data-exclude="/admin,/admin/*"></script>
```

## How it works

- The script is added by a small piece of JavaScript in the component when
  the forum starts, not by a fixed tag in the page head. That is how it knows
  who is logged in, so staff can be left out.
- Discourse moves between pages with the browser's history (no full reload).
  The tracker follows those moves on its own (see [single-page
  apps](https://privatusanalytics.com/docs/tracker/spa)), so the component
  does not send page views itself. That would count each page twice.
  When Discourse updates the address as you scroll through a topic, the
  tracker does not count it as a new page.
- Discourse's content security policy allows a script that the theme's own
  code adds, so no change to your site settings is needed.
- A site id that does not look like `pa_` followed by letters and digits adds
  nothing.

## Privacy

The component only adds a script tag. Your visitors' browsers send the page
views to Privatus Analytics. Your forum server sends nothing. The script sets
no cookies and stores nothing in the browser. See the
[privacy documentation](https://privatusanalytics.com/docs/privacy) for what
is collected.

If you have a privacy policy, it should say which tools handle your visitors'
data. You can paste this:

> This website uses [Privatus Analytics](https://privatusanalytics.com/privacy-analytics)
> to count visits. It does not use cookies and does not follow you from one
> website to another. Your IP address is used for a moment to count visits and
> is never stored.

## Development

The code follows the
[Discourse theme skeleton](https://github.com/discourse/discourse-theme-skeleton).

```sh
pnpm install
pnpm lint
```

`spec/system/` holds system specs. Run them against a Discourse development
checkout with the [`discourse_theme`](https://github.com/discourse/discourse_theme)
CLI:

```sh
discourse_theme rspec .
```

## Contributing

Bug reports and pull requests are welcome at
https://github.com/Privatus-Analytics/discourse-privatus-analytics.

## License

MIT. See [LICENSE](LICENSE). Privatus Analytics is a product of Two Phase LLC,
Wyoming, USA.
