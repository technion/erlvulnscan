-module(erlvulnscan_SUITE).

-include_lib("common_test/include/ct.hrl").
-compile(export_all).

-define(TESTPORT, 8085).

all() -> [invalid_request, valid_request, valid_json].

init_per_suite(Config) ->
    % Run tests on a non-default port, so they can coexist with a
    % running environment.
    ok = application:load(erlvulnscan),
    ok = application:set_env(erlvulnscan, bind_port, ?TESTPORT),
    {ok, _Started} = application:ensure_all_started(erlvulnscan),
    inets:start(),
    Config.

invalid_request(_Config) ->
    % Although we are testing a "failure", the fact it connects at all
    % shows most of the app is running.
    URL = "http://localhost:" ++ integer_to_list(?TESTPORT) ++ "/netscan/",
    {ok, {{_Version, 400, "Bad Request"}, _Headers, _Body}} =
    httpc:request(get, {URL, []}, [], []).

valid_request(_Config) ->
    URL = "http://localhost:" ++ integer_to_list(?TESTPORT) ++ "/netscan?network=127.0.0.0",
    {ok, {{_Version, 200, "OK"}, _Headers, _Body}} =
    httpc:request(get, {URL, []}, [], []).

valid_json(_Config) ->
    %Same test as valid_request, but tests the JSON
    URL = "http://localhost:" ++ integer_to_list(?TESTPORT) ++ "/netscan?network=127.0.0.0",
    {ok, {{_Version, 200, "OK"}, _Headers, Body}} =
    httpc:request(get, {URL, []}, [], []),
    JSON = jiffy:decode(Body),
    254 = length(JSON).

end_per_suite(_Config) ->
    inets:stop(),
    application:stop(erlvulnscan).


