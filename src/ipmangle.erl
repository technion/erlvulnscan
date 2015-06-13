%% @doc Module for converting ip formats and results
-module(ipmangle).
-export([ip_results_to_json/1, verify_address/1]).

%% @doc Verifies input is a valid network address. Converts binary input to 
%% list output. For example, binary "127.0.0.0" returns "127.0.0.".
%% This is consistent with input required for the scanner.
%% The caller should catch exceptions.
%% @end
-spec verify_address(binary()) -> [byte()].
verify_address(Network) ->
    % All functions require lists
    NetworkList = binary_to_list(Network),
    % Verifies a valid address, and verifies it is a /24
    {ok, AddrTuple} = inet:parse_ipv4strict_address(NetworkList),
    {_A, _B, _C, 0} = AddrTuple,
    NetworkSubnet = lists:droplast(NetworkList),
    NetworkSubnet.


%% @doc Converts the ip tuple for a JSON format suited for React
-spec ip_results_to_json([{list(integer()),atom()}]) -> binary().
ip_results_to_json(Results) ->
    ConvertFun = fun({X,Y}) -> {[{<<"address">>, 
            list_to_binary(inet:ntoa(X))}, {<<"stat">>, Y}]} end,
    ScanConverted = lists:map(ConvertFun, Results),
    jiffy:encode(ScanConverted).

-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").

verify_address_test() ->
    ?assertEqual("127.0.0.", verify_address(<<"127.0.0.0">>)),
    ?assertError(_, verify_address(<<"127.324324234.43432.12321">>)),
    ?assertError(_, verify_address(<<"127.0.0.1">>)).

ip_results_to_json_test() ->
    ?assertEqual(ip_results_to_json([{{127,0,0,253},not_vulnerable}, {{127,0,0,252},not_vulnerable}]), <<"[{\"address\":\"127.0.0.253\",\"stat\":\"not_vulnerable\"},{\"address\":\"127.0.0.252\",\"stat\":\"not_vulnerable\"}]">>).

-endif.
