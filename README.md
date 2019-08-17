# is-localhost-ip
Comprehensively checks whether given DNS name or IPv4/IPv6 address belongs to local machine

Main difference from othre libraries here is comprehensivenes: we start from simple RegExp checks, then fallbacks to `hosts` file and DNS resolver.
