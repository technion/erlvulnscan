%% Feel free to use, reuse and abuse the code in this file.

%% @doc GET echo handler.
-module(toppage_handler).

-export([init/3]).
-export([handle/2]).
-export([terminate/3]).

init(_Transport, Req, []) ->
	{ok, Req, undefined}.

handle(Req, State) ->
	{Method, Req2} = cowboy_req:method(Req),
	{Echo, Req3} = cowboy_req:qs_val(<<"network">>, Req2),
	{ok, Req4} = network(Method, Echo, Req3),
	{ok, Req4, State}.

network(<<"GET">>, undefined, Req) ->
	cowboy_req:reply(400, [], <<"Missing network parameter.">>, Req);
network(<<"GET">>, Echo, Req) ->
	cowboy_req:reply(200, [
		{<<"content-type">>, <<"text/plain; charset=utf-8">>}
	], Echo, Req);
network(_, _, Req) ->
	%% Method not allowed.
	cowboy_req:reply(405, Req).

terminate(_Reason, _Req, _State) ->
	ok.
