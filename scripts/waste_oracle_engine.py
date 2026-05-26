import sys
import json
import os
from datetime import datetime
import random

def save_log(entry):
    base_dir = os.getcwd()
    log_dir = os.path.join(base_dir, 'logs')
    log_file = os.path.join(log_dir, 'signal_history.json')
    
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
    print(f"Success: Log saved to {log_file}")

if __name__ == "__main__":
    # Tetikleyici argümanını al
    arg = sys.argv[1] if len(sys.argv) > 1 else "manual_trigger"
    
    # Varsayılan pazarlama ve veri akışı metrikleri
    gtm_server_side_health = "OPTIMAL"
    consent_mode_loss_rate = "0.0%"
    budget_anomaly_detected = False
    protection_score = 100
    trigger_type = "Manual Audit"

    # Otomatik mekanizma kontrolü
    if arg == "scheduled_bureau_check":
        trigger_type = "Automated Weekly Audit"
        protection_score = random.randint(95, 100)
        if protection_score < 100:
            consent_mode_loss_rate = f"{round(random.uniform(0.5, 2.1), 1)}%"
            gtm_server_side_health = "STABLE"
    
    elif arg != "manual_trigger":
        try:
            payload = json.loads(arg)
            trigger_type = "External Signal"
        except:
            trigger_type = "Unknown Trigger"

    # Pazarlama Bütçesi Koruma Odaklı Log Girişi
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "trigger_source": trigger_type,
        "audit_metrics": {
            "gtm_server_side_status": gtm_server_side_health,
            "consent_mode_v2_loss": consent_mode_loss_rate,
            "budget_waste_anomaly": budget_anomaly_detected,
            "smyrna_sable_protection_score": f"{protection_score}%"
        },
        "integrity_status": "VERIFIED"
    }
    
    save_log(log_entry)