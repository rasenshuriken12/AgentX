"""AgentX local monitoring agent.

Collects host telemetry and sends it to the AgentX ingestion API.
"""

from __future__ import annotations

import os
import platform
import time
import uuid
from pathlib import Path

import psutil
import requests
from dotenv import load_dotenv

load_dotenv()

VERSION = "0.1.0"
DEVICE_ID_FILE = Path(__file__).with_name(".agentx_device_id")


def get_device_id() -> str:
    if DEVICE_ID_FILE.exists():
        return DEVICE_ID_FILE.read_text(encoding="utf-8").strip()
    device_id = str(uuid.uuid4())
    DEVICE_ID_FILE.write_text(device_id, encoding="utf-8")
    return device_id


def get_temperature() -> float | None:
    try:
        sensors = psutil.sensors_temperatures(fahrenheit=False)
        readings = [entry.current for values in sensors.values() for entry in values if entry.current is not None]
        return round(max(readings), 1) if readings else None
    except (AttributeError, OSError):
        return None


def collect_metrics() -> dict:
    net = psutil.net_io_counters()
    load_1m = None
    try:
        load_1m = round(os.getloadavg()[0], 2)
    except (AttributeError, OSError):
        pass

    return {
        "cpu_percent": psutil.cpu_percent(interval=0.5),
        "memory_percent": psutil.virtual_memory().percent,
        "disk_percent": psutil.disk_usage("/").percent,
        "network_rx_bytes": net.bytes_recv,
        "network_tx_bytes": net.bytes_sent,
        "temperature_c": get_temperature(),
        "load_1m": load_1m,
    }


def build_payload() -> dict:
    return {
        "device": {
            "id": get_device_id(),
            "name": os.getenv("AGENTX_DEVICE_NAME", platform.node() or "My PC"),
            "hostname": platform.node() or "unknown",
            "os": f"{platform.system()} {platform.release()}",
            "agent_version": VERSION,
        },
        "metrics": collect_metrics(),
    }


def main() -> None:
    api_url = os.environ.get("AGENTX_API_URL")
    api_key = os.environ.get("AGENTX_API_KEY")
    interval = max(2, int(os.environ.get("AGENTX_INTERVAL_SECONDS", "5")))

    if not api_url or not api_key:
        raise SystemExit("Set AGENTX_API_URL and AGENTX_API_KEY in agent/.env")

    print(f"AgentX {VERSION} started; reporting every {interval}s")
    while True:
        try:
            response = requests.post(
                api_url,
                json=build_payload(),
                headers={"Authorization": f"Bearer {api_key}"},
                timeout=10,
            )
            response.raise_for_status()
            result = response.json()
            anomalies = len(result.get("anomalies", []))
            print(f"telemetry sent | anomalies={anomalies}")
        except requests.RequestException as exc:
            print(f"telemetry error: {exc}")
        except Exception as exc:  # keep the monitoring loop alive
            print(f"collector error: {exc}")
        time.sleep(interval)


if __name__ == "__main__":
    main()
