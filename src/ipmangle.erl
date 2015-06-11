-module(ipmangle).
-export([ip_results_to_json/1]).
%% @doc Module for converting ip formats and results

-spec ip_results_to_json([{list(integer()),atom()}]) -> binary().
ip_results_to_json(Results) ->
%% @doc Converts the ip tuple for a JSON format suited for React
	ConvertFun = fun({X,Y}) -> {[{<<"address">>, 
		list_to_binary(inet:ntoa(X))}, {<<"stat">>, Y}]} end,
	ScanConverted = lists:map(ConvertFun, Results),
	jiffy:encode(ScanConverted).



