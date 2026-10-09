from flask import Flask, request, jsonify
import sqlite3
import os

app = Flask(__name__)
DB_PATH = '/app/data/clicks.db'

def init_db():
    os.makedirs('/app/data', exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS clicks
                 (button_id TEXT PRIMARY KEY, count INTEGER)''')
    conn.commit()
    conn.close()

@app.route('/click', methods=['POST'])
def track_click():
    data = request.json
    if not data or 'button' not in data:
        return jsonify({"error": "Bad Request"}), 400
        
    button_id = data['button']
    
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    # Insert or update count if button_id already exists
    c.execute("""
        INSERT INTO clicks (button_id, count) 
        VALUES (?, 1) 
        ON CONFLICT(button_id) 
        DO UPDATE SET count = count + 1
    """, (button_id,))
    conn.commit()
    conn.close()
    
    return jsonify({"status": "success", "tracked": button_id})

@app.route('/stats', methods=['GET'])
def get_stats():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT button_id, count FROM clicks")
    rows = c.fetchall()
    conn.close()
    
    return jsonify([{"button": r[0], "count": r[1]} for r in rows])

if __name__ == '__main__':
    init_db()
    # Run the app on all interfaces
    app.run(host='0.0.0.0', port=5000)
