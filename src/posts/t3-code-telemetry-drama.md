---
title: the t3 code telemetry drama, and why i'm still team theo
date: 2026-11-25
description: t3 code got caught with default-on telemetry, the timeline exploded, and theo shipped a dozen privacy fixes in one day. what actually happened, why i'm still on his side, and how to do telemetry so nobody writes an 18 part thread about you.
---

if you were on dev twitter this week, you saw it. t3 code, theo's open source ai coding app with 77k+ github stars, went from "cool app" to "18 part exposé, gdpr complaints and 900 posts an hour" in about 48 hours.

i use t3 code every day. i'm literally writing this in it. so let's talk about it.

## tl;dr

- it started with a **fork that kept the t3 name**, and theo calling it "temu3 code"
- someone audited the source and found **telemetry on by default since march**, while the homepage said "no telemetry" until june
- theo says it **never uploaded your files, prompts or code**, and the account hashing was to count users properly
- he then **merged a dozen privacy fixes in one day** and dumped **96,000 of his own telemetry records** publicly so people could check
- i'm still team theo. he messed up the homepage, then fixed the code faster than any company i've ever seen
- and if you're building something, there's a right way to do telemetry. i'll show you one at the end

## the timeline (grab popcorn)

**20 nov.** a chinese dev puts out "t3 stardust edition", a fork of t3 code. it's mit licensed so forking is fine, but it kept the t3 name, title and icon.

**23 nov.** a blogger thinks the fork is the real t3 code and complains about it. theo sees it, calls it "temu3 code" and a "chinese knockoff", and asks for a rename. 19 minutes later it's renamed to "stardust agent" and marked unofficial.

the temu3 line was a choice. a funny one, but a choice.

**24 nov.** developer chen dahuang posts a full source code breakdown. it gets around 2 million views. the main findings:

- default-on posthog telemetry was added in march, with no popup and no settings toggle, just an environment variable to turn it off
- the homepage said **"no telemetry / unless you opt in. full stop."** until 18 june, when those lines got removed in a redesign
- the app read your local `~/.claude.json` and `~/.codex/auth.json`, and hashed your account id into an identifier

**24 nov, later.** theo says he'll "close source t3 code tonight". then says he won't. classic theo arc.

**25 nov.** theo posts a long explanation, publishes nearly **96,000 of his own telemetry records** from the last 81 days (about 100 mb) so anyone can see what actually gets sent, and the team merges fix after fix all day.

## ok but what was actually sent

this is the part the timeline skipped.

theo's explanation is that it **never uploaded your files, your prompts or your code**. the account hashing existed because without it, one person on three laptops looks like three users, and a whole team sharing one codex login looks like one user. if you're trying to say "t3 code has 3 million users", you kind of need to count them right.

and he didn't just say it. he dumped his own data publicly so anyone could check. name one other founder who's done that mid drama.

was reading another app's auth file a good idea? no. should there have been a toggle in settings? yes. should the "no telemetry" line have been deleted the day telemetry got added, not three months later? also yes. but there's a big difference between "collected usage stats and counted users in a sketchy way" and "stole your code", and the timeline really wanted it to be the second one.

## why i'm still team theo

**1. it got caught because it's open source.**
the whole audit happened because anyone can read t3 code's source. that's the system working. closed source ai tools could be doing way worse and you'd never know. the fix for "open source app had a problem" isn't "use closed source apps".

**2. he fixed it in one day.** on 25 nov, between 4am and 2pm, more than a dozen patches landed:

| fix | what it means |
|---|---|
| no more reading claude and codex accounts | it stops touching other apps' login files |
| relay logs stop recording ip addresses | your ip isn't stored |
| custom models stop reporting their real names | your setup stays yours |
| windows telemetry off switch fixed | turning it off actually works now |
| no more reading other apps' command lines on windows | it minds its own business |
| `DO_NOT_TRACK` support | the standard "leave me alone" switch works |
| deleting a chat actually deletes it | "permanently delete" is permanent now |

most companies would take a quarter and then post "we take your privacy seriously" with a stock photo of a padlock. theo shipped it before lunch.

**3. 900 posts an hour is insane.** theo said he was getting harassed at over 900 posts an hour. criticise the code all you want, that's fair. but 900 an hour at one guy? nah.

**4. he's theo.** he says spicy stuff on the timeline. that's the brand. it's why half of us watch his videos in the first place. sometimes it backfires, and this week it backfired, and he still shipped.

## so what's the lesson

telemetry isn't evil. every app needs to know roughly how many people use it and which versions are out there, or you're building blind. the problem is never "telemetry exists". it's:

- **saying you don't have it** when you do
- **collecting stuff people wouldn't expect**, like reading another app's login file
- **making it hard to turn off**

get those three right and nobody writes an 18 part thread about you.

## how to do it right (yes this is a serveros plug)

you knew it was coming. i work at serveros, and our open source panel does telemetry too. here's exactly how it works, straight from [the self hosting docs](https://github.com/serveroshq/panel):

once a day, a self hosted install sends one tiny ping. this is **all** of it:

| field | what it is |
|---|---|
| `install_id` | a random uuid made the first time it starts. not made from anything about you |
| `version` | which version you're on |
| `edition` | `self-hosted` |
| `licensed` | true or false |
| `workspaces` | how many |
| `users` | how many |
| `machines` | how many |
| `active_machines` | how many checked in this week |

no names, no emails, no domains, no hostnames, no ip addresses. serveros.com doesn't even keep the ip or headers the ping comes from. and it doesn't read any other app's files, because why would it.

want to see exactly what gets sent, without sending it?

```sh
serveros-panel artisan install:ping --show
```

want it gone? one line in your `.env`:

```sh
SERVEROS_TELEMETRY=false
```

the docs even list the other requests the panel makes, like checking github for new releases, so nothing is a surprise. it's all written down, and it all matches the code.

theo, if you're reading this, steal the idea. it's free.

## final thoughts

t3 code had a bad week. the homepage said something the code didn't do, and that's on them. but the code is open, the problems got found, the fixes shipped in a day, and the founder put his own data out there. that's more accountability than most of the industry gives you in a year.

i'm still using it. i'm still team theo. and i'm still going to make fun of "temu3 code" forever, because it's genuinely funny.

new here and want a panel that tells you exactly what it sends? [what is serveros](/blog/what-is-serveros/) explains it, and the [self hosted version](https://github.com/serveroshq/panel) is free.
