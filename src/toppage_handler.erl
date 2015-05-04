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
	{Network, Req3} = cowboy_req:qs_val(<<"network">>, Req2),
	{ok, Req4} = network(Method, Network, Req3),
	{ok, Req4, State}.

network(<<"GET">>, undefined, Req) ->
	cowboy_req:reply(400, [], <<"Missing network parameter.">>, Req);
network(<<"GET">>, _Network, Req) ->
	Scan = mshttpsys:mshttpsys_runscan("127.0.0."),
	%Convert erlang ip_address into string
	ConvertFun = fun({X,Y}) -> {X,list_to_binary(inet:ntoa(Y))} end,
	ScanConverted = lists:map(ConvertFun, Scan),
	cowboy_req:reply(200, [
		{<<"content-type">>, <<"text/plain; charset=utf-8">>}
	], jiffy:encode({ScanConverted}), Req);
network(_, _, Req) ->
	%% Method not allowed.
	cowboy_req:reply(405, Req).

terminate(_Reason, _Req, _State) ->
	ok.
