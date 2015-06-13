%% @doc Module that spawns threads to scan CVE-2015-1635, and each thread reports results to the main thread
-module(mshttpsys).
-export([mshttpsys/1]).

-include("defs.hrl").

-define(TESTHEADER, <<"GET / HTTP/1.1\r\nHost: stuff\r\nRange: bytes=0-18446744073709551615\r\n\r\n">>).
-define(SCANSTR, "Requested Range Not Satisfiable").


%% @doc Connects to port 80 and sends the scan command
-spec mshttpsys({byte(),byte(),byte(),byte()}) -> 
    'no_connection' | 'not_vulnerable' | 'vulnerable'.
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

