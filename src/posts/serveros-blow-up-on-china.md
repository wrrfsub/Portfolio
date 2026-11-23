---
title: serveros blow up on china
date: 2026-11-23
about: serveros
description: serveros got two full write ups on gitcode, one of the biggest chinese dev sites. they counted the code, read the install script and loved the security. here's what they said, translated.
---

ok so someone sends me a link. it's all in chinese. i scroll down and see "serveros" in the middle of it.

my first thought was "oh no what broke".

nothing broke. **serveros blew up in china bruh.** 😭

## wait what happened

gitcode, one of the biggest chinese dev sites (think github but chinese), has a mirror of the serveros panel. and their blog posted not one but **two** full articles about it, on 16 and 17 november.

the title, translated: **"627 stars in four days, real demand or just chasing shiny new stuff?"**

and the answer both of them landed on was basically: real demand. lets gooo.

- article one went through the source code like a security auditor
- article two explained it like you're a small business owner with three vps and zero patience
- together they got around 3,600 reads when i checked

people in china are reading about the panel i work on. i'm normal about it. (i am not normal about it.)

## they actually counted the code

article one didn't just skim the readme. it opened the repo and started counting stuff:

| what | count |
|---|---|
| php files in `app/` | 643 |
| test files | 176 |
| database migrations | 115 |
| mcp tool classes | 173 |
| vue files | 339 |
| lines of php | about 108,000 |

and then said most projects that get 627 stars in four days are "a demo that runs plus a pretty landing page", but serveros is clearly **"past the demo stage"**.

bro looked at 108k lines and went "ok this is real". we take those.

## "doesn't change your household registration"

this is my favorite line in both articles.

article two said the big difference between serveros and panels like bt panel and 1panel is that serveros **"不改户口"**. literally: "doesn't change your household registration".

meaning other panels move into your server and become the owner. serveros lets your server keep its own identity. your box, your cloud account, your ip, your bill. serveros just builds you the remote control.

<span class="relative"><mark>i'm putting that on my resume</mark><span class="oss" aria-hidden="true"><svg width="40" height="30" viewBox="0 0 40 30"><path d="M37 6C25 4 12 9 5 26" /><path d="M5 26l-.5-8M5 26l7-4" /></svg><span>not joking</span></span></span>. "experience: helped servers keep their household registration."

## they loved the security

article one went deep on how a server gets connected and was very into it:

- you run one command with a **one time token** that's stored hashed and **expires after 15 minutes**
- the little daemon on your server connects **out** to the panel. the panel never ssh's into your box
- running shell commands through mcp **needs two factor auth**
- root power is split into small named actions that each get checked on their own, not one big scary web terminal

it called that "the standard answer" for panels with this much power. then it noticed two more things most people never even look at:

- the install script has a public key baked in, and your server **checks the daemon's signature** before installing it
- telemetry is just eight fields, you can turn it off, and `php artisan install:ping --show` prints exactly what gets sent

their line on that: if a project lets you print its telemetry, that tells you more than any privacy policy. facts.

## the server agent knows when to shut up

article two loved the ai diagnosis. it reads your machine's state, services, recent logs and failed deploys, then tells you what's probably wrong, which log lines prove it, and how to fix it. but:

- it gives you **at most 4 steps**
- it never runs anything until **you click approve**
- if the evidence isn't there, it literally says **"i don't know"** instead of making stuff up

their take: "in an age where every ai can't wait to press delete for you", that kind of restraint is worth more than ten extra features.

an ai that admits it doesn't know something. rarest thing on the internet.

## "copying an old sysadmin's brain"

article two also went through the ready made workflows and said it's like someone **copied an old sysadmin's brain** into the panel:

- site down? restart the service behind it, wait, and email you either way
- backup every night at 3am. stay quiet if it worked, yell if it didn't
- something breaks at night? try a restart first, only wake a human during work hours
- push to deploy, and if the build fails, your live site just stays on the old version

and you just tick boxes. no code.

## they even liked the boring stuff

article one also noticed:

- every migration has to run on **sqlite, postgres and mysql**
- **phpstan at level 7** on the whole thing
- the self hosted install script checks your ports, checks your dns, waits for a health check, sets up nightly backups and even has a **cloudflare tunnel mode**
- the repo has an ai policy: no prs opened by agents on their own, a human owns every pr

it said that last one means the maintainers care about review time and are "more likely to still be alive in six months". we're planning on way longer than six months but thank you.

## "check back in 2 to 4 weeks"

article one said hyped panels usually cool off 2 to 4 weeks after launch, and the real test is if it's still shipping after that.

challenge accepted. the panel went public on 9 november. today:

- **1,191 stars**, 117 forks
- **176 commits**, 46 merged prs
- **5 releases in 4 days**: v1.9.0 on the 18th, v1.10.0 and v1.10.1 on the 19th, v1.11.0 on the 20th, v1.11.1 on the 21st
- last push this morning

the curve didn't cool off. it went to the gym.

## best lines, translated

i'm framing these:

- "hype is other people's opinion, architecture is your own bill."
- "cloud servers keep getting cheaper, but knowing how to run one never did."
- "most people aren't buying compute. they're buying the peace of mind of 'i don't want to learn this, but i have to be able to manage it'."

that last one is literally why serveros exists. they get it.

## so yeah

serveros is international now. two big write ups, thousands of reads, and a whole new country learning that their server can keep its household registration.

if you want to see it yourself:

- the articles: [the deep dive](https://blog.gitcode.com/df483d66822a3ef1521c08226c52104d.html) and [the friendly one](https://blog.gitcode.com/3977a9915acc8cd267d657ff65451d76.html) (in chinese, your browser can translate)
- the repo: [github.com/serveroshq/panel](https://github.com/serveroshq/panel), go give it a star, china already did
- new here? [what is serveros](/blog/what-is-serveros/), or [serveros vs coolify](/blog/serveros-vs-coolify/) if you're picking a panel

谢谢 china. 🫡
