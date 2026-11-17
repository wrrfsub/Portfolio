---
title: what is serveros?
date: 2026-11-17
about: serveros
description: serveros is an open source linux server management panel. what it does, how it connects to your vps, what it costs, and why it's open source, explained by someone who works on it.
---

people keep asking me what i actually work on, so here it is. i'm a jr. swe at [serveros](https://serveros.com/). i build features, review and merge pull requests, go through issues on the open source repo, and help users when something breaks. this is the plain version of what it is.

## what is serveros, in one line

serveros is an open source linux server management panel. it runs the linux servers you already own from one place. their own tagline says it better: "run your servers without the terminal."

you rent a vps from hetzner, digitalocean, vultr, ovhcloud, scaleway or linode like you normally would. you connect it to serveros. then you deploy apps, sites and databases, watch them, back them up and fix them from a panel instead of living in ssh.

the important bit: your servers stay with your provider, on your account. serveros doesn't take them over.

## how serveros connects to your server

one command, pasted on the machine:

```sh
curl -fsSL https://serveros.com/install.sh | sudo bash -s -- --token=ENROL_TOKEN
```

that script checks you're on linux with systemd, downloads a small daemon called `serverosd`, verifies its checksum and release signature, and enrols the machine. the homepage says it takes about 20 seconds, and "nothing is changed or restarted."

the daemon connects out to the panel, so there are no ports to open on your server. if you change your mind, `serverosd uninstall` removes everything.

## what serveros can do

the features page lists 45 features in 7 groups. the ones that matter most day to day:

- **machines**: cpu, memory and disk, os updates, and cve alerts when something on the box has a known hole.
- **deploys**: from a github repo, a .zip or a one click app, with deploy on push, domains and https, databases, staging with real data and pull request previews.
- **monitoring**: uptime checks from outside, status pages, incidents, and every service's logs in one place.
- **backups**: scheduled, and kept somewhere other than the machine they came from. a backup on the same disk that dies isn't a backup.
- **workflows**: steps that run on a schedule, on a push or by hand, like deploy, check, promote.
- **teams**: members, roles, two factor sign in and an activity log.

## the serveros ai agent (the part i actually like)

when something breaks, the server agent looks at it, explains what went wrong and proposes a fix. it runs nothing until you approve it. no ai going rogue on prod at 3am.

there's also an mcp server and a rest api, so you can talk to your servers from claude, chatgpt, codex, cursor or vs code. you can even plug in your own anthropic or openai key.

## is serveros open source? yes, for real

the panel and the daemon are both on github under agpl-3.0:

- [serveroshq/panel](https://github.com/serveroshq/panel), the web app. mostly php (laravel) and vue.
- [serveroshq/daemon](https://github.com/serveroshq/daemon), the `serverosd` thing that runs on each server.

this repo is where a lot of my day goes. checking issues, reviewing pull requests, testing them and merging the good ones.

the panel repo went up on nov 9. as i write this, 8 days later, it has <span class="relative"><mark>1,113 stars</mark><span class="oss" aria-hidden="true"><svg width="40" height="30" viewBox="0 0 40 30"><path d="M37 6C25 4 12 9 5 26" /><path d="M5 26l-.5-8M5 26l7-4" /></svg><span>that's insane</span></span></span>, <mark>106 forks</mark>, <mark>12 contributors</mark>, and v1.7.1 shipped yesterday. not bad for a week.

you can self host the whole panel for free with unlimited machines. you need a linux box with docker, ports 80, 443 and 8443 open, and a domain. then:

```sh
curl -fsSL https://raw.githubusercontent.com/serveroshq/panel/main/docker/self-hosted/install.sh | sudo bash -s -- --domain=panel.example.com --email=you@example.com
```

## how much serveros costs

prices are in gbp, per month:

- **self host**: £0 forever, unlimited machines, agents with your own ai key.
- **essential**: £5, 1 machine. for solo devs.
- **pro**: £12, up to 5 machines. for small teams.
- **business**: £79, up to 25 machines. adds sso, scim, custom roles and logs in your own database.
- **enterprise**: custom pricing.

every plan has unlimited apps, sites and databases. you pay for servers, not apps. yearly billing gets you 2 months free, and every new workspace starts with 14 days of pro.

## some real numbers

the about page counts these live from the panel, rounded down:

- 3.9k+ services running on connected servers
- 30m+ log lines made searchable
- 210k+ uptime checks run

it's built by two co-founders, dylan (engineering and product) and harry (cto), plus a few more people. i'm one of the few more.

## who serveros is for

if you rent a vps and you're tired of ssh, nginx configs and "why is the disk full again", it's for you. if you're an agency juggling client servers, the business plan is literally built for that. and if you just want to read the code, it's [right there](https://github.com/serveroshq/panel).

go break something on it, then tell me about it on [discord](https://discord.com/users/1338099754080665651).
