%% @doc Caching module. Uses ETS to cache cache output.
-module(cache).
-export([cached_fun/2, create_table/0, delete_table/0]).
-include_lib("stdlib/include/ms_transform.hrl").

%% @doc LIFETIME defines, in seconds, cache lifetime
-ifdef(TEST).
-define(LIFETIME, 2).
-else.
-define(LIFETIME, 3600).
-endif.

-spec create_table() -> ok.
create_table() ->
    simple_cache = ets:new(simple_cache, [ named_table,
            {read_concurrency, true}, public, {write_concurrency, true} ]),
    ok.

-spec delete_table() -> ok.
delete_table() ->
    ets:delete(simple_cache),
    ok.

-spec now_secs() -> pos_integer().
now_secs() ->
    {MegaSecs, Secs, _MicroSecs} = os:timestamp(),
    MegaSecs*1000000 + Secs.

%% @doc Expires old content
-spec cache_flush() -> ok.
cache_flush() ->
    Now = now_secs(),
    Selector = ets:fun2ms(fun({K, Expiry, _Res}) 
            when Expiry < Now -> true end),
    ets:select_delete(simple_cache, Selector),
    ok.

%% @doc For a key K, caches the output of F(K).
-spec cached_fun(function(), list()) -> {_, 'expire' | 'hit' | 'miss'}.
cached_fun(F, K) ->
    Now = now_secs(),
    case ets:lookup(simple_cache, K) of
    [] ->  %Not present in cache
        cache_flush(), %Flushing on add ensures size is managed
        FuncRes = F(K),
        ets:insert(simple_cache, {K, Now+?LIFETIME, FuncRes}),
        {FuncRes, miss};
    [{K, Expiry, Cached}] when Now < Expiry ->
        {Cached, hit};
    [{K, _Expiry, _Cached}] -> %Cached expired
        ets:delete(simple_cache, K),
        FuncRes = F(K),
        ets:insert(simple_cache, {K, Now+?LIFETIME, FuncRes}),
        {FuncRes, expire}
    end.

-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").

create_table_test() ->
    create_table().

cached_fun_miss_test() ->
    F = fun(K) -> K ++ "demo" end, %A mock function
    ?assertEqual(cached_fun(F, "127"), {"127demo", miss}),
    ?assertEqual(cached_fun(F, "cleanme"), {"cleanmedemo", miss}).
cached_fun_insert_test() ->
    F = fun(K) -> K ++ "demo" end, %A mock function
    ?assertEqual(cached_fun(F, "127"), {"127demo", hit}).
cached_fun_expire_test() ->
    F = fun(K) -> K ++ "demo" end, %A mock function
    timer:sleep((?LIFETIME+1)*1000),
    ?assertEqual(cached_fun(F, "127"), {"127demo", expire}).
cache_cleanup_test() ->
    F = fun(K) -> K ++ "demo" end, %A mock function
    ?assertEqual(cached_fun(F, "cleanme2"), {"cleanme2demo", miss}),
    %The above insetion of a new value, afer the LIFETIME sleep ealier,
    %should have cleaned up the earlier value below.
    ?assertEqual(cached_fun(F, "cleanme"), {"cleanmedemo", miss}).

delete_table_test() ->
    delete_table().
-endif.
