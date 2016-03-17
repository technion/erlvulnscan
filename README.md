Web based concurrent scanner for CVE-2015-1635.

[Live implementation running here](http://erlvulnscan.lolware.net/). This demonstration website is used for development of this project and it stability is not guaranteed.

[Information on this project is written here](https://lolware.net/2015/06/15/mass-vulnerability-scanning.html).  As the "TODO" list documented there has been completed this code is now in a stable state. 

[Code documentation can be found here](https://htmlpreview.github.io/?https://github.com/technion/erlvulnscan/blob/master/doc/index.html).

## Development and deployment

Clone the repository

	git clone https://github.com/technion/erlvulnscan.git

Get prerequisiites

	./rebar get-deps

Compile

	./rebar compile

Static analysis

    ./rebar built-plt #First time only
    ./rebar dialyzer

Generate release

	./rebar generate

Create edocs (only necessary after API change as these are synced to git)

	./rebar doc

Run test harness (EUnit and Common Test both implemented)

    ./rebar eunit
    ./rebar ct

Observing the cache whille attached to running process

    ets:match(simple_cache, '$1').

The "logs" directory can be accessed to identify two sources of tests by aliasing it to a URL. Accessing this directory without a subfolder will show the results of the CT test suite. Accessing view.png will show the PhantomJS output from the frontend test.

##Building the frontend
The frontend is built using Webpack plugins. From the frontend/ directory:

Install the requirements:

    npm install

To build the frontend:

    webpack

###nginx setup

These rules were used for routing:

    location /netscan {
        proxy_pass http://localhost:8080;
    }

###Hot code upgrades

Last chance for unit tests.

    $ ./rebar eunit

Bump the version number, and make a clean build.

    $ ./rebar eunit
    $ vim src/erlvulnscan.app.src
    Change {vsn, "1.02"}, to {vsn, "1.03"},
    $ vim rel/reltool.config
    Change {rel, "erlvulnscan", "1.02", to {rel, "erlvulnscan", "1.03",
    $ ./rebar clean
    $ ./rebar compile
    $ git commit -a
    Create a commit that bumps version. You may also wish to tag it.

Generate a new release, and the appups package

    $ cd rel
    $ ../rebar generate
    $ ../rebar generate-appups previous_release=erlvulnscan-1.02/
    $ ../rebar generate-upgrade previous_release=erlvulnscan-1.02/
    $ ls
    erlvulnscan  erlvulnscan-1.02  erlvulnscan_1.03.tar.gz  files  reltool.config
    $ mv erlvulnscan erlvulnscan-1.03
    $ mv erlvulnscan_1.03.tar.gz  erlvulnscan-1.02/releases/

Attach to the existing version, and perform the load.

```erlang
$ ./erlvulnscan-1.02/bin/erlvulnscan attach
pong
Attaching to /tmp//home/technion/erlvulnscan/rel/erlvulnscan-1.02/erlang.pipe.2 (^D to exit)
(erlvulnscan@127.0.0.1)23> release_handler:which_releases().
[{"erlvulnscan","1.02",
  ["kernel-3.2","stdlib-2.4","sasl-2.4.1","ranch-1.0.0",
   "crypto-3.5","cowlib-1.0.0","cowboy-1.0.0",
   "erlvulnscan-1.02","asn1-3.0.4","compiler-5.0.4","et-1.5",
   "hipe-3.11.3","inets-5.10.6","jiffy-0.13.3-6-g446e284",
   "mnesia-4.12.5","observer-2.0.4","public_key-0.23",
   "runtime_tools-1.8.16","ssl-6.0","syntax_tools-1.6.18",
   "tools-2.7.2","webtool-0.8.10","wx-1.3.3","xmerl-1.3.7"],
  permanent}]
(erlvulnscan@127.0.0.1)24> release_handler:unpack_release("erlvulnscan_1.03").
{ok,"1.03"}
(erlvulnscan@127.0.0.1)25> release_handler:install_release("1.03").
{ok,"1.02",[]}
(erlvulnscan@127.0.0.1)26> release_handler:make_permanent("1.03").
ok
(erlvulnscan@127.0.0.1)27> release_handler:which_releases().
[{"erlvulnscan","1.03",
  ["kernel-3.2","stdlib-2.4","sasl-2.4.1","ranch-1.0.0",
   "crypto-3.5","cowlib-1.0.0","cowboy-1.0.0",
   "erlvulnscan-1.03","asn1-3.0.4","compiler-5.0.4","et-1.5",
   "hipe-3.11.3","inets-5.10.6","jiffy-0.13.3-6-g446e284",
   "mnesia-4.12.5","observer-2.0.4","public_key-0.23",
   "runtime_tools-1.8.16","ssl-6.0","syntax_tools-1.6.18",
   "tools-2.7.2","webtool-0.8.10","wx-1.3.3","xmerl-1.3.7"],
  permanent},
 {"erlvulnscan","1.02",
  ["kernel-3.2","stdlib-2.4","sasl-2.4.1","ranch-1.0.0",
   "crypto-3.5","cowlib-1.0.0","cowboy-1.0.0",
   "erlvulnscan-1.02","asn1-3.0.4","compiler-5.0.4","et-1.5",
   "hipe-3.11.3","inets-5.10.6","jiffy-0.13.3-6-g446e284",
   "mnesia-4.12.5","observer-2.0.4","public_key-0.23",
   "runtime_tools-1.8.16","ssl-6.0","syntax_tools-1.6.18",
   "tools-2.7.2","webtool-0.8.10","wx-1.3.3",
   [...]],
  old}]
```

