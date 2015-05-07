-module(mshttpsys).
-export([mshttpsys_runscan/1]).

-define(TIMEOUT, 150).
-define(TESTHEADER, <<"GET / HTTP/1.1\r\nHost: stuff\r\nRange: bytes=0-18446744073709551615\r\n\r\n">>).
-define(SCANSTR, "Requested Range Not Satisfiable").

-spec mshttpsys_runscan(string()) -> 'ok'.
mshttpsys_runscan(Network) ->
	mshttpsys_spawner(254, Network),
	mshttpsys_receive(254, []).

-spec mshttpsys_receive(non_neg_integer(), _) -> any().
mshttpsys_receive(0, Results) ->
	Results;

mshttpsys_receive(T, Results) ->
	receive
	{Address, Msg} ->
		%io:fwrite("~s With ~w received address ~w~n", [Msg,Address,R]),
		mshttpsys_receive(T-1, Results ++ [{Address, Msg}])
	after ?TIMEOUT*2 ->
		Results
	end.

-spec mshttpsys_spawner(non_neg_integer(), _) -> 'ok'.
mshttpsys_spawner(0, _) ->   
	ok;

mshttpsys_spawner(N, Network) ->
	Pid = spawn(fun() ->
		receive
		{From, execute} ->
			{ok, Address} = 
			inet:parse_address(Network ++ integer_to_list(N)),
			From ! {Address, mshttpsys(Address) }
		end 
	end),
	Pid ! {self(), execute},
	mshttpsys_spawner(N-1, Network).

-spec mshttpsys({byte(),byte(),byte(),byte()}) -> 
	'no_connection' | 'not_vulnerable' | 'vulnerable'.
mshttpsys(Address) ->
	%Known vulnerable: 212.48.69.194
	case gen_tcp:connect(Address, 80, [], ?TIMEOUT) of
	{ok, Socket} ->
		gen_tcp:send(Socket, ?TESTHEADER),
		inet:setopts(Socket, [{active, once}]),
		receive
		{tcp, Socket, Msg} ->
			gen_tcp:close(Socket),
			mshttpsys_scan(Msg)
		after ?TIMEOUT ->
			no_connection
		end;
	{error, _} ->
		no_connection
	end.

-spec mshttpsys_scan(string()) -> 'not_vulnerable' | 'vulnerable'.
mshttpsys_scan(Headers) ->
	case string:str(Headers, ?SCANSTR) == 0 of
	false ->
		vulnerable;
	true ->
		not_vulnerable
	end.

