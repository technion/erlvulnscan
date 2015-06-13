%% @doc Module for converting ip formats and results
-module(ipmangle).
-export([ip_results_to_json/1, verify_address/1]).

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

