-module(recaptcha).
-define(RECAPTHA_API_URL, "https://www.google.com/recaptcha/api/siteverify").
-export([verify/2]).

-spec verify_live(binary(), binary(), string()) -> atom().
verify_live(RemoteIP, Captcha, Key) ->
    URL = ?RECAPTHA_API_URL ++ "?"
    "secret=" ++ Key ++ "&"
    "remoteip=" ++ binary_to_list(RemoteIP) ++ "&"
    "response=" ++ binary_to_list(Captcha),
    {ok, {{_Version, 200, "OK"}, _Headers, Body}} =
        httpc:request(get, {URL, []}, [], []),
    {Google} = jiffy:decode(Body),
    proplists:get_value(<<"success">>, Google).

-spec verify(binary(), binary()) -> atom().
verify(RemoteIP, Captcha) ->
    {ok, Key} = application:get_env(erlvulnscan, captcha_key),
    case Key of
    undefined ->
        % Recaptcha key not setup - probably testing
        true;
    _ ->
        verify_live(RemoteIP, Captcha, Key)
    end.
