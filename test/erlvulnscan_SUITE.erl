-module(erlvulnscan_SUITE).

-include_lib("common_test/include/ct.hrl").
-compile(export_all).

-define(TESTPORT, "8085").

all() -> [invalid_request].

init_per_suite(Config) ->
    % Run tests on a non-default port, so they can coexist with a
    % running environment.
    application:set_env(erlvulnscan, bind_port, ?TESTPORT),
    {ok, _Started} = application:ensure_all_started(erlvulnscan),
    inets:start(),
    Config.

invalid_request(_Config) ->
    % Although we are testing a "failure", the fact it connects at all
    % shows most of the app is running.
    timer:sleep(10000),
    URL = "http://localhost:" ++ ?TESTPORT ++ "/netscan/",
    {ok, {{_Version, 400, "Bad Request"}, _Headers, _Body}} =
    httpc:request(get, {URL, []}, [], []).

end_per_suite(_Config) ->
    inets:stop(),
    application:stop(erlvulnscan).


