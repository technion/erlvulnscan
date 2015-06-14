Web based concurrent scanner for CVE-2015-1635.

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

	dialyzer --src src/ -Wunmatched_returns  -Wrace_conditions -Wunderspecs

Generate release

	./rebar generate

Create edocs (only necessary after API change as these are synced to git)

	./rebar doc

Run test harness (currently only eunit)

    ./rebar eunit

##Building the frontend
The frontend is built using several Grunt plugins. From the frontend/ directory:

Install the plugins:

    npm install

To build the frontend:

    grunt

### nginx setup

These rules were used for routing:

    location /netscan {
        proxy_pass http://localhost:8080;
    }

