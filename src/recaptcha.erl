-module(recaptcha).
-define(RECAPTHA_API_URL, "https://www.google.com/recaptcha/api/siteverify").
-define(RECAPTHA_PRIVATE_KEY, "6Leegh0UAAAAACjYYMJ57PkJbpJ21uVuTdcsZ5i7").
-export([verify/2]).

-spec verify_live(string(), binary(), string()) -> atom().
verify_live(RemoteIP, Captcha, Key) ->
    URL = ?RECAPTHA_API_URL ++ "?"
    "secret=" ++ Key ++ "&"
%BAD "remoteip=" ++ RemoteIP ++ "&"
    "response=" ++ binary_to_list(Captcha),
    {ok, {{_Version, 200, "OK"}, _Headers, Body}} =
        httpc:request(get, {URL, []}, [], []),
    {Google} = jiffy:decode(Body),
    proplists:get_value(<<"success">>, Google).

-spec verify(string(), binary()) -> atom().
verify(RemoteIP, Captcha) ->
    {ok, Key} = application:get_env(erlvulnscan, captcha_key),
    case Key of
    undefined ->
        % Recaptcha key not setup - probably testing
        true;
    _ ->
        verify_live(RemoteIP, Captcha, Key)
    end.
