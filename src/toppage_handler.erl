%% Feel free to use, reuse and abuse the code in this file.

-module(toppage_handler).
%% @doc GET echo handler.

-export([init/2]).

init(Req0, State) ->
    Req2 = try
        <<"POST">> = cowboy_req:method(Req0), % Assert supported type
        true = cowboy_req:has_body(Req0),
        cowboy_req:read_body(Req0) of
    {ok, PostBody, Req1} ->
        processbody(PostBody, Req1)
    catch
    _Error:_Reason ->
        cowboy_req:reply(400, #{}, <<"Bad Request">>, Req0)
    end,
    {ok, Req2, State}.

processbody(PostBody, Req0) ->
    case jiffy:decode(PostBody, [return_maps]) of
    #{<<"network">> := Network, <<"recaptcha">> := Recaptcha} ->
        verify_network(Network, Recaptcha, Req0);
    _ ->
        cowboy_req:reply(400, #{}, <<"Invalid or missing parameter">>, Req0)
    end.

-spec verify_network(binary(), binary(), cowboy_req:req()) ->
    cowboy_req:req().
verify_network(Network, Recaptcha, Req0) ->
    % Verify against captcha
    IP = cowboy_req:header(<<"x-forwarded-for">>, Req0),
    case recaptcha:verify(IP, Recaptcha) of
    true ->
        network(Network, Req0);
    _ ->
        cowboy_req:reply(400,
            #{<<"content-type">> => <<"text/plain; charset=utf-8">>},
            <<"{error: \"Failed captcha\"}">> , Req0)
    end.

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

