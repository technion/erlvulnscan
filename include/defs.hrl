%% Include file for common definitions
%% ?TIMEOUT defines the TCP connection timeout.
%% ?SDCANTYPE defines the scan module used
%% scan_result() is a type definition for the three atoms a scan can return.

-define(TIMEOUT, 350).

-type scan_result() :: no_connection | not_vulnerable | vulnerable.

-define(SCANTYPE, mshttpsys).
