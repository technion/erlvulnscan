%% @doc Include file for common definitions

%% @doc TIMEOUT is used by TCP connections
-define(TIMEOUT, 350).

%% @doc The atoms a scan may return.
-type scan_result() :: no_connection | not_vulnerable | vulnerable.

-define(SCANTYPE, mshttpsys).
