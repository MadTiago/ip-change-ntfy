# ip-change-ntfy

Periodically checks the public IP (cron schedule) and sends a [ntfy](https://ntfy.sh/) notification if it changed since last check.

### Setup

Create an `.env` file with the following variables:

-   **CRON_SCHEDULE** (cron schedule format, e.g `* * * * *` to run every minute)
-   **NTFY_SERVER** (URL to ntfy server, must contain trailing slash)
-   **NTFY_TOPIC** ntfy topic name

Example `.env` file:

```
CRON_SCHEDULE=* * * * *
NTFY_SERVER=https://ntfy.sh/ # <- trailing slash
NTFY_TOPIC=public-ip-changed
```

### Install / run

Install dependencies
`pnpm install`

and run it
`node .`

### Docker

##### run

```
docker run -d --name ip-change-ntfy -e CRON_SCHEDULE="* * * * *" -e NTFY_SERVER=https://ntfy.sh/ -e NTFY_TOPIC=public-ip-changed madtiago/ip-change-ntfy
```

##### compose

```
services:
    ip-change-ntfy:
        image: madtiago/ip-change-ntfy:latest
        container_name: ip-change-ntfy
        restart: always
        environment:
            - CRON_SCHEDULE=* * * * *
            - NTFY_SERVER=https://ntfy.sh/
            - NTFY_TOPIC=public-ip-changed
```
