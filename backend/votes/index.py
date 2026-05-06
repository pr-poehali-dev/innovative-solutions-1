"""Голосование: сохранение голоса и получение результатов"""
import json
import os
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        participant_id = body.get("participant_id")
        if participant_id not in (1, 2, 3):
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "invalid participant_id"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute("INSERT INTO votes (participant_id) VALUES (%s)", (participant_id,))
        conn.commit()
        cur.close()
        conn.close()

        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    # GET — результаты
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        SELECT participant_id, COUNT(*) as cnt
        FROM votes
        GROUP BY participant_id
        ORDER BY participant_id
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    result = {1: 0, 2: 0, 3: 0}
    for pid, cnt in rows:
        result[pid] = int(cnt)

    total = sum(result.values())
    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({"votes": result, "total": total}),
    }
