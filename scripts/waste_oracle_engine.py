import sys
import json
import os
from datetime import datetime

def process_signal(payload_str):
    try:
        # Eğer gelen veri "manual_trigger" veya boşsa, varsayılan bir veri oluştur
        if not payload_str or payload_str == "manual_trigger":
            payload = {"user_agent": "Manual-Test", "path": "/lab"}
        else:
            payload = json.loads(payload_str.replace("'", '"'))
            
        status = "BLOCKED" if is_bot else "VERIFIED"
        
        # Log entry creation
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "path": payload.get("path"),
            "integrity_status": status,
            "origin": payload.get("user_agent")
        }
        
        # In a real scenario, here we would call Google Ads / Meta API
        print(f"Signal Processed: {status}")
        
        # Save to local log for prototype demonstration
        save_log(log_entry)

    except Exception as e:
        print(f"Error processing signal: {e}")

def save_log(entry):
    # Projenin ana dizinini bul
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    log_dir = os.path.join(base_dir, 'logs')
    log_file = os.path.join(log_dir, 'signal_history.json')
    
    # Klasörü oluştur
    os.makedirs(log_dir, exist_ok=True)
    
    data = []
    if os.path.exists(log_file):
        try:
            with open(log_file, 'r') as f:
                data = json.load(f)
        except:
            data = []
            
    data.append(entry)
    with open(log_file, 'w') as f:
        json.dump(data, f, indent=4)
    print(f"Log successfully saved to: {log_file}") # Bu satır çok önemli!

if __name__ == "__main__":
    if len(sys.argv) > 1:
        process_signal(sys.argv[1])
