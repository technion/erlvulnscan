Webbased concurrent scanner for CVE-2015-1635.

[Live implementation running here](http://erlvulnscan.lolware.net/). This demonstration website is used for development of this project and it stability is not guaranteed.

[Information on this project is written here](https://lolware.net/2015/06/15/mass-vulnerability-scanning.html).  As the "TODO" list documented there has been completed this code is now in a stable state. 

[Code documentation can be found here](https://htmlpreview.github.io/?https://github.com/technion/erlvulnscan/blob/master/doc/index.html).

## Development and deployment

Clone the repository

	git clone https://github.com/technion/erlvulnscan.git

Get prerequisiites

	./rebar3 get-deps

Compile

	./rebar3 compile

Static analysis

    ./rebar3 built-plt #First time only
    ./rebar3 dialyzer

Generate release

	./rebar3 generate

Create edocs (only necessary after API change as these are synced to git)

	./rebar3 doc

Run test harness (EUnit and Common Test both implemented)

    ./rebar3 eunit
    ./rebar3 ct

Observing the cache whille attached to running process

    ets:match(simple_cache, '$1').

The "logs" directory can be accessed to identify two sources of tests by aliasing it to a URL. Accessing this directory without a subfolder will show the results of the CT test suite. Accessing view.png will show the PhantomJS output from the frontend test.

## Building the frontend
The frontend is built using Webpack plugins. From the frontend/ directory:

Install the requirements:

    npm install

To build the frontend:

    webpack

### nginx setup

These rules were used for routing:

    location /netscan {
        proxy_pass http://localhost:8080;
    }

