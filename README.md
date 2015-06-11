Web based concurrent scanner for CVE-2015-1635.

Can scan an entire /24 in 200ms.

This code is very alpha.

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

