-module(erlvulnscan_app).

-behaviour(application).

%% Application callbacks
-export([start/2, stop/1]).

%% ===================================================================
%% Application callbacks
%% ===================================================================

getport() ->
    case application:get_env(erlvulnscan, test_bind_port) of
    {ok, Port} ->
        Port;
    true ->
        {ok, Port} = application:get_env(erlvulnscan, bind_port),
        Port
    end.

start(_StartType, _StartArgs) ->
    Port = getport(),
    cache:create_table(),
    Dispatch = cowboy_router:compile([
        {'_', [
            {"/netscan", toppage_handler, []}
        ]}
    ]),
    {ok, _} = cowboy:start_http(http, 100, [{port, Port}], [
        {env, [{dispatch, Dispatch}]}
    ]),
    erlvulnscan_sup:start_link().

stop(_State) ->
    cache:delete_table(),
    ok.
