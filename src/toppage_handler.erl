%% Feel free to use, reuse and abuse the code in this file.

-module(toppage_handler).
%% @doc GET echo handler.

-export([init/2]).

init(Req0, State) ->
    Req = try
        <<"GET">> = cowboy_req:method(Req0), % Assert supported type
        cowboy_req:match_qs([{network, nonempty}], Req0) of
    #{network := Network} -> 
        network(Network, Req0)
    catch
    _Error:_Reason -> 
        cowboy_req:reply(400, #{}, <<"Invalid or missing parameter">>, Req0)
    end,
    {ok, Req, State}.

-spec network('true' | binary(), cowboy_req:req()) ->
    cowboy_req:req().
network(Network, Req) ->
    case catch ipmangle:verify_address(Network) of
    {'EXIT', _} ->
        % This handles the exception from the address verifier
        cowboy_req:reply(400, 
            #{<<"content-type">> => <<"text/plain; charset=utf-8">>},
            <<"{error: \"Invalid input\"}">> , Req);
    Network2 ->
        % If Network = <<"127.0.0.1">>, Network2 = "127.0.0."
        CacheF = fun(K) ->
            Scan = netscan:netscan_runscan(K),
            %Convert erlang ip_address into string
            ipmangle:ip_results_to_json(Scan)
            end,
        {ScanJson, _Hit} = cache:cached_fun(CacheF, Network2),
        cowboy_req:reply(200,
            #{<<"content-type">> => <<"application/json; charset=utf-8">>},
            ScanJson, Req)
    end.

