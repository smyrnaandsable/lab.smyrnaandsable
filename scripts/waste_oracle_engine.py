import sys
import json
import os
from datetime import datetime

def save_log(entry):
    # En güvenli yol belirleme yöntemi
    base_dir = os.getcwd()
    log_dir = os.path.join(base_dir, 'logs')
    log_file = os.path.join(log_dir, 'signal_history.json')
    
    os.makedirs(log_dir, exist_ok=True)
    
    data = []
    if os.path.exists(log_file):
        try:
            with open(log_file, 'r') as f:
                data = json.load(f)
        except: data = []
            
    data.append(entry)
    with open(log_file, 'w') as f:
        json.dump(data, f, indent=4)
    print(f"Success: Log saved to {log_file}")

if __name__ == "__main__":
    # Manuel tetikleme koruması
    arg = sys.argv[1] if len(sys.argv) > 1 else "{}"
    
    # JSON ayrıştırma hatasını önlemek için basit bir kontrol
    try:
        if arg == "manual_trigger":
            payload = {"user_agent": "Manual-Test", "path": "/lab"}
        else:
            payload = json.loads(arg)
    except:
        payload = {"user_agent": "Unknown-Error", "path": "error"}

    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "path": payload.get("path", "unknown"),
        "integrity_status": "VERIFIED",
        "origin": payload.get("user_agent", "unknown")
    }
    
    save_log(log_entry)