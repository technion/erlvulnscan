%% @doc Module that spawns threads to scan CVE-2015-1635, and each thread reports results to the main thread
-module(mshttpsys).
-export([mshttpsys/1]).

-include("defs.hrl").

-define(TESTHEADER, <<"GET / HTTP/1.1\r\nHost: stuff\r\nRange: bytes=0-18446744073709551615\r\n\r\n">>).
-define(SCANSTR, "Requested Range Not Satisfiable").


%% @doc Connects to port 80 and sends the scan command
-spec mshttpsys(inet:ip4_address()) -> scan_result().
mshttpsys(Address) ->
    %Known vulnerable: 212.48.69.194
    case gen_tcp:connect(Address, 80, [], ?TIMEOUT) of
    {ok, Socket} ->
            ok = gen_tcp:send(Socket, ?TESTHEADER),
            ok = inet:setopts(Socket, [{active, once}]),
            receive
            {tcp, Socket, Msg} ->
                    gen_tcp:close(Socket),
                    mshttpsys_scan(Msg)
            after ?TIMEOUT ->
                    gen_tcp:close(Socket),
                    no_connection
            end;
    {error, _} ->
            no_connection
    end.

%% @doc Searches the server's return string for vulnerability confirmation
-spec mshttpsys_scan(string()) -> 'not_vulnerable' | 'vulnerable'.
mshttpsys_scan(Headers) ->
    case string:str(Headers, ?SCANSTR) == 0
    orelse string:str(Headers, "Microsoft") == 0 of
    false ->
            vulnerable;
    true ->
            not_vulnerable
    end.

-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").

safe_address_test() ->
    {ok, Localhost} = inet:parse_ipv4strict_address("127.0.0.1"),
    ?assertEqual(not_vulnerable, mshttpsys(Localhost)).
safe_iis_test() ->
    % IP of microsoft.com
    {ok, Localhost} = inet:parse_ipv4strict_address("173.223.179.235"),
    ?assertEqual(not_vulnerable, mshttpsys(Localhost)).
safe_not_iis_test() ->
    % IP of google.com
    {ok, Localhost} = inet:parse_ipv4strict_address("74.125.133.99"),
    ?assertEqual(not_vulnerable, mshttpsys(Localhost)).
dead_address_test() ->
    % Google DNS will not be listening on port 80.
    {ok, Google} = inet:parse_ipv4strict_address("8.8.8.8"),
    ?assertEqual(no_connection, mshttpsys(Google)).
-endif.
