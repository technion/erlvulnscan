%% Feel free to use, reuse and abuse the code in this file.

-module(toppage_handler).
%% @doc GET echo handler.

-export([init/2]).

init(Req, Opts) ->
    Method = cowboy_req:method(Req),
    Req2 = case Method of
    <<"GET">> ->
        network_get(Req);
    _ ->
        % Currently only supporting GET queries
        cowboy_req:reply(405, Req)
    end,
    {ok, Req2, Opts}.

-define(QPARM(Q), {Q, [], undefined}). 
-spec network_get(cowboy_req:req()) -> cowboy_req:req().
network_get(Req) ->
    QS = cowboy_req:match_qs([?QPARM(network)], Req),
    %This pattersn of searching for undefined params is more scaleable
    %to many parameters
    UndefFilter = fun(_K,V) -> V =:= undefined end,
    case maps:filter(UndefFilter, QS) of
    #{} ->
        #{network := Network} = QS,
        network(Network, Req);    
    _ ->
        cowboy_req:reply(400, [], <<"Missing network parameter.">>, Req)
    end.

-spec network('true' | binary(),cowboy_req:req()) -> 
    cowboy_req:req().

network(Network, Req) ->
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
    end.

