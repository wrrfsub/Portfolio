---
title: nginx got two http/2 holes, here's how to not get owned
date: 2026-11-19
about: nginx
description: cve-2026-123633 and cve-2026-123007 let anyone run code on nginx 1.9.5 to 1.31.8 with http/2 on, no login needed. how the bugs work in plain words, how to check, the quick fix, how to patch properly, and which distros have a fix.
---

on 18 november nginx shipped 1.30.7 (stable) and 1.31.9 (mainline) and fixed <mark>10 security bugs</mark> in one go. two of them are the scary kind: anyone on the internet can run code on your server, no password, no login, nothing. both are rated <mark>9.2 critical</mark>.

nginx runs on more than 225 million websites, so yeah, this is a big one. if you have a vps, you probably have nginx on it somewhere, maybe even one you forgot about.

## tl;dr if you're in a hurry

1. run `nginx -v`. anything from 1.9.5 to 1.31.8 is affected.
2. run `sudo nginx -T 2>/dev/null | grep -n http2`. any output means http/2 is on, so you're exposed.
3. no fixed package for your distro yet? turn http/2 off (steps below).
4. fixed package out? install it and **restart** nginx. a reload is not enough. i'll explain why, it's a fun one.

## what actually happened

two bugs in nginx's http/2 code, both memory safety bugs (the classic c language special):

- **cve-2026-123633**, a use-after-free. nginx frees a connection's memory while a request is still using it. affects 1.19.7 to 1.31.8.
- **cve-2026-123007**, an integer underflow. a counter goes "negative" in a way that wraps into a huge number, and nginx ends up copying memory it shouldn't. affects every nginx since 1.9.5.

<span class="relative"><mark>since 2015</mark><span class="oss" aria-hidden="true"><svg width="40" height="30" viewBox="0 0 40 30"><path d="M37 6C25 4 12 9 5 26" /><path d="M5 26l-.5-8M5 26l7-4" /></svg><span>11 years bro</span></span></span>, that's how long the second one was hiding in nginx. every release in between has it.

the funny part: they weren't found by one team. [wiz](https://www.wiz.io/blog/nginx-http2-rce-vulnerabilities), ikotas labs, metnir, rapid7 and xint all found them on their own and reported them to f5 (the company behind nginx). wiz says they used ai to find both bugs, and that they have working exploits. they aren't publishing them, but the patch is public, so people will work it out from that. that's how it always goes.

## the first bug, explained like a restaurant

nginx keeps a list of idle connections it's allowed to close when it needs room for new ones. think of it as tables a restaurant can clear when it gets busy.

here's the trick:

1. the attacker sends only half of an http/2 request. nginx sees nothing going on and puts the connection on the "can be cleared" list.
2. the attacker sends the other half. the request starts, but nginx forgets to take the connection off the list.
3. nginx forwards the request to your backend app. if it's low on free connection slots, it starts clearing tables from the list. your connection is on the list. it gets cleared while the request is still being served.
4. the request keeps going and keeps using memory that has been freed and given to something else.

so the waiter cleared your table while you were still eating, seated someone else there, and you kept eating off their plate. in memory terms, the attacker gets to control what's on that plate, and that's how it turns into running code.

this one needs nginx to run short of `worker_connections`, which is easiest when nginx is a reverse proxy in front of an app. that's how most of us use it.

## the second bug, explained like a bank

http/2 lets many requests share one connection. nginx keeps a counter called `send_window`, the amount of data it's allowed to send before the client says "ok, send more". think of it as a bank balance with a max limit.

1. nginx queues some data and takes that amount off the balance.
2. the attacker cancels the request before the data goes out. nginx gives the unused amount back, but **doesn't check the max limit** when it does.
3. the attacker had already raised the balance in the meantime, so the refund pushes it over the max. the code everywhere else assumes that can't happen.
4. the next check does `max - balance` to see how much room is left. the balance is bigger than the max, the number is unsigned, so instead of going negative it wraps around to a giant number. nginx now thinks there's basically infinite room.
5. that giant number eventually becomes a negative length, and the tls code turns it into an out of bounds memory copy. now the attacker can read memory and mess up the heap.

basically the bank says you're over the limit by so much that you have infinite money. love that for the attacker.

this one is worse because it needs nothing special. http/2 over https, that's it. wiz got code running on a server that **only served static files**, no backend, no extra modules. your little landing page counts.

## "but i'm behind cloudflare"

doesn't save you if your server still answers on port 443 to anyone who knows its ip. and people find origin ips all the time (old dns records, certificate logs, that one subdomain you forgot).

check from a machine outside your network, not from the server itself:

```bash
curl -sk -o /dev/null -w '%{http_version}\n' --http2 --resolve your-site.com:443:YOUR.SERVER.IP https://your-site.com/
```

`2` means your origin talks http/2 straight to the internet. wiz says a cdn or waf that terminates http/2 *might* break parts of the exploit, but it depends on the setup. don't bet your server on "might".

## the quick fix: turn http/2 off

most distros didn't have a fixed package on day one, so this is the step that matters for most people. your sites keep working over http/1.1, browsers fall back on their own. you lose a bit of speed for a few days, not the end of the world.

on nginx 1.25.1 or newer, add `http2 off;` and take `http2` out of every `listen` line:

```nginx
server {
    listen 443 ssl;
    http2 off;
}
```

on older nginx there's no `http2` directive, so just take `http2` off every `listen` line.

get **all** of them. if even one site on the same ip and port still has it, http/2 stays on for every site on that port. `grep` doesn't lie, run it again after.

then test, reload and check from outside:

```bash
sudo nginx -t && sudo systemctl reload nginx
curl -so /dev/null -w '%{http_version}\n' --http2 https://your-site.com/
```

`1.1` means you're good. `2` means something still has it on, go find it.

this only covers the two http/2 bugs. the same release fixes 8 more, so you still need to patch.

## the other 8 bugs nobody is talking about

the http/2 ones got the headlines, but some of these are rough too. scores are from wiz's table:

| cve | what | when it hits you | score |
|---|---|---|---|
| 2026-121810 | use-after-free in http/3 | http/3 on, nginx as a proxy | 9.2 |
| 2026-123634 | use-after-free in the dns resolver | attacker controls an upstream host name | 9.2 |
| 2026-113425 | use-after-free in the mail proxy | mail proxy with auth_http | 9.2 |
| 2026-118899 | infinite loop reading the request body | tls 1.3, can take the server down | 8.7 |
| 2026-120993 | null pointer crash | proxy_protocol v2, mainline 1.31.4+ only | 6.9 |
| 2026-125283 | buffer overflow with alias + try_files | uncommon configs | 6.9 |
| 2026-123640 | bad validation in ssl_preread | can get around security rules | 6.9 |
| 2026-120967 | client certificate bypass | specific sni setups in stream | 6.3 |

if you turned on http/3 because it sounded cool (guilty), turning off http/2 doesn't help with the first one. patch.

## patch it properly

back up your config first, future you will say thanks:

```bash
sudo cp -a /etc/nginx /etc/nginx.bak
```

then upgrade:

- **ubuntu / debian:** `sudo apt update && sudo apt install --only-upgrade nginx`
- **rhel, alma, rocky, fedora, amazon linux:** `sudo dnf upgrade nginx`
- **alpine:** `sudo apk upgrade nginx`
- **arch:** `sudo pacman -Syu` (arch doesn't do one package upgrades, you get the whole thing)
- **docker:** pull `nginx:1.30.7` or `nginx:1.31.9` and **recreate** the container. restarting the old one just runs the old image again.

then restart:

```bash
sudo systemctl restart nginx
```

## why reload isn't enough

`reload` tells the running nginx to reread its config. it doesn't swap the program itself. so the new package is sitting on disk and the old, holey binary is still the one running. you "patched" and you're still exposed.

here's how to check what's actually running:

```bash
sudo ls -l /proc/$(pgrep -o -x nginx)/exe
```

if the path ends in `(deleted)`, linux is telling you the file that process started from is gone, replaced by the new one. nginx is still running the old binary. restart it.

## "my version didn't change, did it work?"

probably yes. ubuntu, debian and rhel backport fixes into the version they already ship. so on ubuntu 24.04 you'll still see 1.24.0 from `nginx -v`, but the package version is the patched one. check the package instead:

```bash
dpkg -l nginx
rpm -q nginx
```

and compare it with the table below.

## which distros have a fix

this is from [mattias geniar's tracker](https://ma.ttias.be/nginx-http2-cve-2026-123633-123007/) as of 19 november, 07:09 utc. it changes fast, so check there for the latest.

| distro | status |
|---|---|
| nginx.org packages | fixed, 1.30.7 and 1.31.9 |
| official docker image | fixed, 1.30.7 and 1.31.9 |
| ubuntu, every supported release | fixed in usn-9159-1 (24.04 is 1.24.0-2ubuntu7.20) |
| ubuntu 20.04 and older | fixed through ubuntu pro |
| debian 12 and 13 | not yet |
| debian sid | fixed, 1.30.6-4 |
| rhel 8, 9, 10 | not yet |
| almalinux 9 and 10 (default nginx) | fixed, ahead of red hat |
| almalinux 8, and the nginx 1.24 and 1.26 streams on 9 | not yet |
| amazon linux 2023 and al2 nginx1 | fixed |
| alpine 3.24 and edge | fixed, 1.30.7-r0 |
| alpine 3.22 and 3.23 | fixed on x86_64 (1.28.3-r8), other archs still coming |
| alpine 3.21 | not yet |
| arch | fixed, 1.30.7-1 and mainline 1.31.9-1 |
| fedora 43, 44, 45 | not yet |
| suse, opensuse | still analysing |
| nginx plus | check f5's advisories k000163928 and k000163926 |

debian 12 is a super common vps image, and it's still waiting. if that's you, http/2 off, today.

## can't wait? use nginx's own packages

nginx.org already has the fix for ubuntu, debian, rhel and friends, alpine, amazon linux and sles. you add their repo and install from it. geniar's post has [the copy paste steps](https://ma.ttias.be/nginx-http2-cve-2026-123633-123007/) for each distro.

two things that will bite you:

- their `nginx.conf` reads `conf.d/*.conf`, not `sites-enabled/`. your sites can just silently not load.
- modules from your distro won't load with their build.

so run `sudo nginx -t` before you restart, and once it's up, turn http/2 back on.

## was i already hacked?

there's no confirmed sign for these bugs yet, but wiz says to look for nginx workers crashing out of nowhere, or nginx starting commands it has no reason to start. a memory bug going wrong usually shows up as a crash first:

```bash
sudo grep -i "exited on signal" /var/log/nginx/error.log
```

a lot of `signal 11` (a segfault) lately on a server that was fine before? look closer. for the window bug, wiz also says the attack sends a huge number of http/2 window updates over long connections that move lots of data, so that's a pattern worth watching if you have network monitoring.

## if you use serveros

shameless plug, i work there. serveros checks every connected server's pending updates against the public cve databases every 15 minutes. when your distro ships the fixed nginx, it shows up as a security update with the cves it fixes, and you get an email for high, critical or actively exploited ones. install it from the server's updates page, then restart nginx and do the `/proc` check above.

until your distro ships the package, there's nothing to install, so turning off http/2 is still on you.

## the bigger picture

the 2015 bug sat in one of the most used programs on the internet for 11 years, and five different teams found it on their own. wiz basically says ai is making these hard memory bugs easy to find, for the good guys and the bad guys. so expect more of these, and expect the gap between "fix is out" and "people are exploiting it" to get shorter.

the lesson isn't anything fancy. turn on security update alerts for your servers, and know how to patch fast. ten minutes today beats explaining to your client why their site is mining crypto.

thanks to wiz for the deep dive, nginx for the fast fix, and mattias geniar for tracking every distro so we don't have to.
