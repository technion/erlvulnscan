%% @doc Module for converting ip formats and results
-module(ipmangle).
-export([ip_results_to_json/1]).

%% @doc Converts the ip tuple for a JSON format suited for React
-spec ip_results_to_json([{list(integer()),atom()}]) -> binary().
ip_results_to_json(Results) ->
	ConvertFun = fun({X,Y}) -> {[{<<"address">>, 
		list_to_binary(inet:ntoa(X))}, {<<"stat">>, Y}]} end,
	ScanConverted = lists:map(ConvertFun, Results),
	jiffy:encode(ScanConverted).



