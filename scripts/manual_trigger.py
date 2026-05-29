# manual_trigger.py
import sys

def manual_execution():
    print("Sovereign System: Manual Audit Triggered.")
    # Burada doğrudan engine'i çağırabiliriz
    from scripts import waste_oracle_engine
    print("Engine initialized manually.")

if __name__ == "__main__":
    manual_execution()