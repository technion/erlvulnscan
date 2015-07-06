-module(erlvulnscan_app).

-behaviour(application).

%% Application callbacks
-export([start/2, stop/1]).

%% ===================================================================
%% Application callbacks
%% ===================================================================


start(_StartType, _StartArgs) ->
    {ok, Port} = application:get_env(erlvulnscan, bind_port),
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
