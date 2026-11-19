---
title: everything serveros shipped in 6 weeks (it's a lot)
date: 2026-11-19
about: serveros
description: a recap of the serveros changelog from 7 october to 19 november 2026. coding agents, open source, dashboard themes, serveros cloud, one click restores, a database tab and more, explained by someone who works there.
---

the [serveros changelog](https://serveros.com/changelog) has gotten so long that scrolling it counts as cardio. so here's the version for people who don't want to read 15 posts. i work at serveros, so yes, i'm biased. everything here is real and shipped though.

## some numbers first

between 7 october and 19 november there were <mark>15 changelog posts</mark>. that's one every 3 days, and some of them are basically 4 updates stuck together.

<span class="relative"><mark>12 releases in 7 days</mark><span class="oss" aria-hidden="true"><svg width="40" height="30" viewBox="0 0 40 30"><path d="M37 6C25 4 12 9 5 26" /><path d="M5 26l-.5-8M5 26l7-4" /></svg><span>sleep is optional</span></span></span> on the open source panel, from v1.3.0 on nov 12 to v1.10.0 on nov 19.

the [panel repo](https://github.com/serveroshq/panel) went up on nov 9 and is now at <mark>1,166 stars</mark>, <mark>114 forks</mark>, <mark>13 contributors</mark> and <mark>39 merged pull requests</mark>. <mark>5</mark> of those merges were me, so if your pr got in, you might be welcome.

## the big ones

### coding agents on your own servers (nov 19)

the newest one and honestly the coolest. you describe a task, pick a repo and a machine, and up to <mark>20 agents</mark> work on it side by side. each one gets its own branch, does the work, and opens a pull request. you get merge, preview and deploy buttons right there.

the parts i like:

- agents check their own work in a browser and put up to 3 screenshots in the pr. receipts.
- you can schedule a task for tonight. it waits for 1am and a quiet machine, so your server isn't busy doing ai stuff while people use it.
- it runs claude code, codex or opencode with your own anthropic or openai key, or a local model through ollama so nothing leaves the machine.
- a deploy failed or a monitor is down? there's a "fix with an agent" button.
- nothing gets merged until you press merge, and agents never see your github token.

it comes with pro and business. self hosting? it's in v1.10.0, turn it on with `SERVEROS_AGENTS=true` in `/opt/serveros/.env`.

### the panel went open source (nov 15)

the panel is on github under agpl-3.0, next to the daemon which was already public. you can self host it with one command, and serveros.com runs the exact same panel. some of the prs in that release came from people outside the team, which is still wild to me.

that same post also had:

- **deploy your own docker compose file.** point it at a repo or upload a zip, and every service in the file runs as one stack. paste a repo link and it finds the compose file and the port for you.
- **supabase and appwrite** in the app catalog, as whole stacks. supabase even comes with its keys made for you.
- **a database tab** for postgres, mysql and mariadb. browse tables and rows, run queries with ⌘↵, export to csv. it's read only unless you tick "allow changes", and it needs a two factor unlock. no database port to open.
- **pick a repo instead of pasting a link**, private ones too.
- **serveros on your phone.** the whole panel fits a phone screen now, no scrolling sideways.

and my favourite fix of all time: times no longer say "60 minutes ago". justice.

### themes for your dashboard (nov 17)

catppuccin, nord, rosé pine, gruvbox, solarized, dracula and a high contrast one, each in light and dark. or write your own css. you can share a theme as a link and anyone can import it.

you can also ask the ai to make one, or drop in a screenshot and say "match this". themes work on every plan. for safety they can only load fonts from google fonts or bunny fonts, so no, you can't load a crypto miner through your theme. nice try.

### serveros cloud (nov 8)

you can rent servers straight from serveros now. and it's an actual vm, not a container pretending to be a server, so you can run as many apps, databases and workers as it can handle without paying per app. it's hosted in the uk with stacklayer, and stock was limited at launch.

### fixes you approve (nov 6)

press fixes, pick a machine, say what's wrong. the server agent reads the logs and state the panel already has, then tells you what's broken in plain words, quotes the log lines that prove it, and says how sure it is: not very, fairly or very. i love that it's allowed to say "not very".

then it proposes steps, each with a reason, and **nothing runs until you approve it**. it can restart, start, stop, reload or repair services serveros manages, and that's it. no shell on the machine, no reboots. if the fix needs a human (like a missing setting), it proposes nothing and tells you what to do. an ai that knows when to back off, rare.

this one also brought coding agents into flows. there's a template that turns github issues labelled "agent" into pull requests.

### restores, rollbacks with data, and ai apps (oct 7)

the og big update. the highlights:

- **one click restore** for any backup. before it overwrites anything it takes a snapshot, so there's an undo for your undo.
- **database backups use the real tools now** (`pg_dumpall`, `mysqldump`), not copying files while the database runs. so the backups actually work.
- **snapshots before every deploy**, including the app's database. a bad migration? roll back code *and* data. that's the "oh no" button every dev wants.
- **connect claude, chatgpt or cursor** to your machines through mcp. check what's running, read logs, restart, deploy. anything that deletes or stops something asks first.
- **repair old pterodactyl containers** that stopped starting after a reboot. if you've been there, you know the pain.

## the smaller ones i still think are cool

- **clone a running service** (oct 12). copy a container with its data (or empty) to test an upgrade or a migration, while the original keeps running. databases get copied with their own dump tools.
- **your logs, your rules** (oct 11). mask ips before they leave your server (`203.0.113.42` becomes `203.0.113.x`, or a hash like `ip-3f9a1c2e`), keep some services' logs on the machine, delete lines in bulk. business can keep logs in their own postgres.
- **new status pages** (oct 8). every service gets its own status and 30 days of uptime bars, light and dark, embeddable, and link previews in discord, slack and x show the live status.
- **spanish and german** (oct 8). the whole dashboard, the site and every doc.
- **new emails** (oct 11). dark, a custom illustration for each one, and they look the same in gmail, outlook and apple mail. the real title of that changelog post is "new emails! woohooo", and i think that's beautiful.
- **settings got a sidebar and search** (oct 16). press `/`, type "webhook", and it takes you straight to alerts. settings had grown to ten tabs in one row, it was time.
- **a new look** (nov 1). tabs, flatter boxes, a softer charcoal dark mode, and a console that slides up from any machine.
- **a 30 second film** on the homepage (oct 12). everything in it is the real panel, no fake mockups.

## why so fast?

honestly? the team just ships every day, and since nov 15 anyone can open a pr too. every change gets written up the day it goes out and posted to discord. no magic, just a lot of commits.

## keeping up

- the [changelog](https://serveros.com/changelog), which has an rss feed
- the [panel repo](https://github.com/serveroshq/panel), watch releases
- the serveros discord, where every changelog post lands too

new to serveros? i wrote [what is serveros](/blog/what-is-serveros/) for that. and if you self host, update from settings › general, you're probably a few versions behind already. no judgement.
