%% Feel free to use, reuse and abuse the code in this file.

-module(toppage_handler).
%% @doc GET echo handler.

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
network(<<"GET">>, Network, Req) ->
    case catch ipmangle:verify_address(Network) of
    {'EXIT', _} ->
        % This handles the exception from the address verifier
        cowboy_req:reply(400, [
            {<<"content-type">>, <<"text/plain; charset=utf-8">>}
            ], <<"{error: \"Invalid input\"}">> , Req);
    Network2 ->
        % If Network = <<"127.0.0.1">>, Network2 = "127.0.0."
        CacheF = fun(K) ->
            Scan = netscan:netscan_runscan(K),
            %Convert erlang ip_address into string
            ipmangle:ip_results_to_json(Scan)
            end,
        {ScanJson, _Hit} = cache:cached_fun(CacheF, Network2),
        cowboy_req:reply(200, [
            {<<"content-type">>, <<"application/json; charset=utf-8">>}
            ], ScanJson, Req)
    end;
network(_, _, Req) ->
    %% Method not allowed.
    cowboy_req:reply(405, Req).

terminate(_Reason, _Req, _State) ->
    ok.
